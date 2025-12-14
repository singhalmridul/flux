
import { aiClient } from './client';

export async function summarizeNode(content: string): Promise<string> {
    const prompt = `Summarize the following text concisely:\n\n${content}`;
    return await aiClient.generateText(prompt);
}

export async function planProject(goal: string): Promise<string[]> {
    // In a real implementation, we'd ask for a JSON array
    const prompt = `Break down the following goal into 3 actionable steps:\n\n${goal}`;
    const response = await aiClient.generateText(prompt);

    // Mock parsing for now since our mock client returns plain text
    return [
        `Phase 1: Research ${goal.substring(0, 10)}...`,
        `Phase 2: Implement core logic`,
        `Phase 3: Verify and Launch`
    ];
}
