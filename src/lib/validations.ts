import { z } from "zod";

export const fluxNodeSchema = z.object({
    type: z.enum(["project", "task", "note", "event", "whiteboard", "view"]),
    title: z.string().min(1, "Title is required"),
    content: z.string().optional(),
    parentId: z.string().optional(),
    properties: z.record(z.string(), z.any()).optional(), // We will stringify this before saving to DB
    position: z.object({ x: z.number(), y: z.number() }).optional(), // We will stringify this before saving to DB
    startDate: z.date().optional(),
    endDate: z.date().optional(),
});

export type FluxNodeInput = z.infer<typeof fluxNodeSchema>;
