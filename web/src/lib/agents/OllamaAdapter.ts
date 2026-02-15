
export interface OllamaOptions {
    model: string;
    baseUrl?: string;
}

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export class OllamaAdapter {
    private model: string;
    private baseUrl: string;

    constructor(options: OllamaOptions) {
        this.model = options.model;
        this.baseUrl = options.baseUrl || 'http://localhost:11434';
        // Default to glm-5:cloud if not specified
        this.model = options.model || 'glm-5:cloud';
    }

    /**
     * Generate a completion for a given prompt
     */
    async generate(prompt: string): Promise<string> {
        try {
            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: this.model,
                    prompt: prompt,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`Ollama API error: ${response.statusText}`);
            }

            const data = await response.json() as any;
            return data.response;
        } catch (error) {
            console.error('Ollama generation failed:', error);
            throw error;
        }
    }

    /**
     * Chat with the model (Claude-like interface)
     */
    async chat(messages: ChatMessage[]): Promise<string> {
        try {
            const response = await fetch(`${this.baseUrl}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`Ollama API error: ${response.statusText}`);
            }

            const data = await response.json() as any;
            return data.message.content;
        } catch (error) {
            console.error('Ollama chat failed:', error);
            throw error;
        }
    }

    /**
     * Set a new model at runtime
     */
    setModel(model: string) {
        this.model = model;
    }
}
