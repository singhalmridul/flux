"use server"

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { fluxNodeSchema, FluxNodeInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getDashboardData() {
    const session = await auth();
    if (!session?.user?.id) return { priorityTasks: [], upcomingEvents: [], recentDocs: [] };

    const userId = session.user.id;

    // Fetch high priority tasks
    const priorityTasks = await db.fluxNode.findMany({
        where: {
            type: 'task',
            userId,
        },
        take: 5,
        orderBy: { updatedAt: 'desc' }
    });

    const upcomingEvents = await db.fluxNode.findMany({
        where: {
            type: 'event',
            userId,
        },
        take: 3,
        orderBy: { createdAt: 'desc' }
    });

    const recentDocs = await db.fluxNode.findMany({
        where: {
            type: 'note',
            userId,
        },
        take: 3,
        orderBy: { updatedAt: 'desc' }
    });

    return { priorityTasks, upcomingEvents, recentDocs };
}

export async function createNode(data: FluxNodeInput) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const validated = fluxNodeSchema.parse(data);

    const node = await db.fluxNode.create({
        data: {
            type: validated.type,
            title: validated.title,
            content: validated.content,
            parentId: validated.parentId,
            properties: validated.properties ? JSON.stringify(validated.properties) : undefined,
            position: validated.position ? JSON.stringify(validated.position) : undefined,
            startDate: validated.startDate,
            endDate: validated.endDate,
            userId: session.user.id,
        },
    });

    revalidatePath("/dashboard");
    revalidatePath("/execution");
    revalidatePath("/ideation");
    return node;
}

export async function updateNode(id: string, data: Partial<FluxNodeInput>) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // partial validation could be tricky with zod schema defined as required, 
    // but for now we assume the client sends valid partials or we trust the types.
    // Ideally we create a partial schema.

    // We fetch existing check ownership ideally
    const existing = await db.fluxNode.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) throw new Error("Not found or unauthorized");

    const updated = await db.fluxNode.update({
        where: { id },
        data: {
            title: data.title,
            content: data.content,
            // merge properties if needed, but here we replace for simplicity or handle logic
            properties: data.properties ? JSON.stringify(data.properties) : undefined,
            position: data.position ? JSON.stringify(data.position) : undefined,
            startDate: data.startDate,
            endDate: data.endDate,
        }
    });

    revalidatePath("/dashboard");
    revalidatePath("/execution");
    revalidatePath("/ideation");
    return updated;
}

export async function deleteNode(id: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const existing = await db.fluxNode.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) throw new Error("Not found or unauthorized");

    await db.fluxNode.delete({ where: { id } });

    revalidatePath("/dashboard");
    revalidatePath("/execution");
    revalidatePath("/ideation");
}

// Return type includes generic nodes and edges
export async function getCanvasNodes() {
    const session = await auth();
    if (!session?.user?.id) return { nodes: [], edges: [] };

    const nodes = await db.fluxNode.findMany({
        where: {
            userId: session.user.id,
            type: { in: ['note', 'whiteboard', 'image', 'task'] }
        },
    });

    const edges = await db.fluxEdge.findMany({
        where: {
            source: { userId: session.user.id }
        }
    });

    return { nodes, edges };
}

export async function getEvents(start: Date, end: Date) {
    const session = await auth();
    if (!session?.user?.id) return [];

    const nodes = await db.fluxNode.findMany({
        where: {
            userId: session.user.id,
            OR: [
                {
                    startDate: {
                        gte: start,
                        lte: end,
                    },
                },
                {
                    endDate: {
                        gte: start,
                        lte: end,
                    },
                }
            ],
            type: { in: ['task', 'event', 'milestone', 'meeting'] }
        },
        orderBy: { startDate: 'asc' }
    });

    return nodes;
}

export async function saveAvailability(rules: any) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Check if availability node exists
    const existing = await db.fluxNode.findFirst({
        where: {
            userId: session.user.id,
            type: 'availability'
        }
    });

    if (existing) {
        return await db.fluxNode.update({
            where: { id: existing.id },
            data: {
                properties: JSON.stringify(rules)
            }
        });
    } else {
        return await db.fluxNode.create({
            data: {
                type: 'availability',
                title: 'Default Availability',
                userId: session.user.id,
                properties: JSON.stringify(rules)
            }
        });
    }
}

export async function getPublicAvailability(userId: string, start: Date, end: Date) {
    // 1. Get Availability Rules
    const availabilityNode = await db.fluxNode.findFirst({
        where: { userId, type: 'availability' }
    });

    // Default to Mon-Fri 9-5 if no rules
    const rules = availabilityNode?.properties
        ? JSON.parse(availabilityNode.properties as string)
        : { days: ["Mon", "Tue", "Wed", "Thu", "Fri"], start: "09:00", end: "17:00" };

    // 2. Get Existing Events (busy times)
    const events = await db.fluxNode.findMany({
        where: {
            userId,
            OR: [
                { startDate: { gte: start, lte: end } },
                { endDate: { gte: start, lte: end } }
            ],
            type: { in: ['task', 'event', 'meeting'] }
        }
    });

    // 3. Calculate Slots (Simplified for MVP: Just return busy events and rules, let client compute)
    // In a real app, logic would be here. We'll return the raw data for the client to render.
    return { rules, events };
}

export async function bookEvent(targetUserId: string, data: { title: string, start: Date, end: Date, guestEmail: string }) {
    // Public action, no session check for the caller (guest)
    // But we validate target user exists check could be added

    const node = await db.fluxNode.create({
        data: {
            type: 'meeting',
            title: data.title,
            content: `Booked by ${data.guestEmail}`,
            startDate: data.start,
            endDate: data.end,
            userId: targetUserId,
            properties: JSON.stringify({ guestEmail: data.guestEmail, status: 'scheduled' })
        }
    });

    revalidatePath(`/book/${targetUserId}`);
    revalidatePath("/scheduling"); // Revalidate for the owner
    return node;
}
