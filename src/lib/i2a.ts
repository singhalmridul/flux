import { ClientFluxNode as FluxNode } from "./types";
// import { v4 as uuidv4 } from 'uuid'; // Not needed for parsing logic alone

export type IntentType = 'CONVERT_TO_TASKS' | 'SCHEDULE_EVENT';

export interface Intent {
    type: IntentType;
    confidence: number;
    payload: any;
    description: string;
}

export function detectIntent(node: FluxNode): Intent[] {
    const intents: Intent[] = [];
    const content = node.content || "";

    // 1. Detect Task Lists
    // Patterns: "- [ ]", "- ", "[]", "TODO:"
    const taskLines = content.split('\n').filter((line: string) =>
        line.trim().startsWith('- ') ||
        line.trim().startsWith('- [ ]') ||
        line.trim().startsWith('[] ') ||
        line.toLowerCase().includes('todo:')
    );

    if (taskLines.length > 0) {
        intents.push({
            type: 'CONVERT_TO_TASKS',
            confidence: 0.9,
            payload: {
                tasks: taskLines.map((line: string) => line.replace(/^-\s*\[\s*\]\s*|^-\s*|^\[\s*\]\s*|todo:\s*/i, '').trim())
            },
            description: `Convert ${taskLines.length} lines into tasks`
        });
    }

    // 2. Detect Scheduling
    // Patterns: "tomorrow", "next week", "at 5pm"
    // Very basic regex for MVP
    const timeKeywords = ['tomorrow', 'next week', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const hasTimeKeyword = timeKeywords.some(kw => content.toLowerCase().includes(kw));

    if (hasTimeKeyword) {
        intents.push({
            type: 'SCHEDULE_EVENT',
            confidence: 0.7,
            payload: {
                originalText: content
            },
            description: "Schedule this as an event"
        });
    }

    return intents;
}
