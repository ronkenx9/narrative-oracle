import { OllamaAdapter } from './OllamaAdapter';

export interface BuildIdea {
    concept: string;
    targetUser: string;
    feasibilityScore: number; // 0-10
}

export class BuildIdeasAgent {
    private ollama: OllamaAdapter;

    constructor(ollama: OllamaAdapter) {
        this.ollama = ollama;
    }

    /**
     * Generates concrete product/build ideas for a given narrative
     */
    async generateIdeas(narrativeTitle: string, justification: string): Promise<BuildIdea[]> {
        console.log(`Generating build ideas for: ${narrativeTitle}`);

        const ideationPrompt = `
            Context: A new crypto narrative has been detected: "${narrativeTitle}"
            Reasoning: ${justification}

            Task: Generate 3 concrete "Build Ideas" for developers responding to this narrative.
            Each idea should have:
            1. A clear concept title and description.
            2. The target user persona.
            3. A feasibility score from 0 to 10.

            Output JSON only as an array: [{"concept": "...", "targetUser": "...", "feasibilityScore": 8}]
        `;

        try {
            const response = await this.ollama.generate(ideationPrompt);
            const jsonMatch = response.match(/\[.*\]/s);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return [];
        } catch (error) {
            console.error('Error generating build ideas:', error);
            return [];
        }
    }
}
