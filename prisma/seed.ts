import { PrismaClient } from '@prisma/client';

import 'dotenv/config';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL || "file:./dev.db",
        },
    },
});

async function main() {
    console.log('Start seeding ...');

    // Clear existing
    await prisma.fluxNode.deleteMany();

    // 0. Create Owner User
    const user = await prisma.user.create({
        data: {
            name: "Mridul S.",
            email: "mridul@flux.os",
            image: "https://github.com/shadcn.png"
        }
    });

    // 1. Create a Project (Parent)
    const project = await prisma.fluxNode.create({
        data: {
            type: 'project',
            title: 'Flux OS Launch',
            properties: JSON.stringify({ status: 'active', priority: 'critical' }),
            userId: user.id
        },
    });

    // 2. Create Tasks (Linked to Project)
    await prisma.fluxNode.createMany({
        data: [
            {
                type: 'task',
                title: 'Design System Audit',
                content: 'Review all shadcn components.',
                parentId: project.id,
                properties: JSON.stringify({ status: 'todo', priority: 'high' }),
                userId: user.id
            },
            {
                type: 'task',
                title: 'Database Schema Review',
                content: 'Verify polymorphic relationships.',
                parentId: project.id,
                properties: JSON.stringify({ status: 'in-progress', priority: 'critical' }),
                userId: user.id
            },
        ],
    });

    // 3. Create a Canvas Note (Ideation)
    await prisma.fluxNode.create({
        data: {
            type: 'note',
            title: 'Architecture Scratchpad',
            content: 'Remember to use proper indexes.',
            position: JSON.stringify({ x: 100, y: 100 }),
            userId: user.id
        },
    });

    // 4. Create a Meeting (Scheduling)
    await prisma.fluxNode.create({
        data: {
            type: 'event',
            title: 'Sync with Engineering',
            properties: JSON.stringify({ date: new Date().toISOString(), duration: 60 }),
            userId: user.id
        },
    });

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
