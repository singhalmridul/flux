
export interface AIClient {
    generateText(prompt: string): Promise<string>;
    analyzeIntent(text: string): Promise<string>;
}


export class RealAIClient implements AIClient {
    private apiKey: string;

    constructor() {
        this.apiKey = process.env.OPENAI_API_KEY || '';
        if (!this.apiKey) {
            console.warn("OPENAI_API_KEY is not set. AI features will fail.");
        }
    }

    async generateText(prompt: string): Promise<string> {
        if (!this.apiKey) return "Error: API Key missing.";

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o', // or gpt-3.5-turbo
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.7
                })
            });

            const data = await response.json();
            return data.choices?.[0]?.message?.content || "AI Error: No response";
        } catch (error) {
            console.error("OpenAI API Error:", error);
            return "AI Error: Failed to fetch";
        }
    }

    async analyzeIntent(text: string): Promise<string> {
        const prompt = `Analyze the intent of this text: "${text}". Return strictly JSON { "intent": "TYPE", "confidence": 0-1 }`;
        return this.generateText(prompt);
    }
}

// Switch to Real Client
export const aiClient = new RealAIClient();
