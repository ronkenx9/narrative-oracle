import { NextResponse } from 'next/server';
import { OllamaAdapter } from '@/lib/agents/OllamaAdapter';
import { IdeaValidatorAgent } from '@/lib/agents/IdeaValidatorAgent';

// Force dynamic to prevent static optimization of API route
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { idea } = body;

        if (!idea || typeof idea !== 'string') {
            return NextResponse.json(
                { error: 'Idea description is required' },
                { status: 400 }
            );
        }

        const ollama = new OllamaAdapter({
            baseUrl: process.env.NEXT_PUBLIC_OLLAMA_ENDPOINT || 'http://localhost:11434',
            model: process.env.NEXT_PUBLIC_OLLAMA_MODEL || 'glm-5:cloud'
        });

        const agent = new IdeaValidatorAgent(ollama);
        const validation = await agent.validateIdea(idea);

        return NextResponse.json(validation);

    } catch (error: any) {
        console.error('Validation API Error:', error);
        return NextResponse.json(
            { error: 'Failed to validate idea', details: error.message },
            { status: 500 }
        );
    }
}
