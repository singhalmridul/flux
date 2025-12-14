
import { NextResponse } from 'next/server';
import { summarizeNode, planProject } from '@/lib/ai/actions';

export async function POST(req: Request) {
    try {
        const { action, payload } = await req.json();

        if (action === 'summarize') {
            const summary = await summarizeNode(payload.content);
            return NextResponse.json({ success: true, data: summary });
        } else if (action === 'plan') {
            const plan = await planProject(payload.content);
            return NextResponse.json({ success: true, data: plan });
        }

        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error("AI Action Error:", error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
