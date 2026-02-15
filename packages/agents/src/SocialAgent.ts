import { OllamaAdapter } from './OllamaAdapter';

export interface SocialSignal {
    source: string;
    content: string;
    author: string;
    timestamp: number;
}

export interface NarrativeTheme {
    title: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    strength: number; // 0-1
}

export class SocialAgent {
    private ollama: OllamaAdapter;

    constructor(ollama: OllamaAdapter) {
        this.ollama = ollama;
    }

    /**
     * Clusters a set of social signals into emerging narrative themes
     */
    async detectThemes(signals: SocialSignal[]): Promise<NarrativeTheme[]> {
        console.log(`Analyzing ${signals.length} social signals...`);

        if (signals.length === 0) return [];

        const signalsText = signals.map(s => `${s.author}: ${s.content}`).join('\n---\n');

        const clusterPrompt = `
            Analyze the following social media posts and extract the top 3 "emerging themes" or "narratives".
            For each theme, provide:
            1. A short title.
            2. Sentiment (positive, negative, or neutral).
            3. Strength (a number between 0 and 1).

            Output the result ONLY as a JSON array of objects with keys: "title", "sentiment", "strength".

            Posts:
            ${signalsText}
        `;

        try {
            const response = await this.ollama.generate(clusterPrompt);
            // Ollama might return some preamble, try to extract JSON
            const jsonMatch = response.match(/\[.*\]/s);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return [];
        } catch (error) {
            console.error('Error clustering social signals:', error);
            return [];
        }
    }
}
