import dotenv from 'dotenv';
import { OllamaAdapter } from './OllamaAdapter';
import { IdeaValidatorAgent } from './IdeaValidatorAgent';

dotenv.config();

async function main() {
    console.log('🧪 Testing Idea Validator Agent...');

    const ollama = new OllamaAdapter({
        baseUrl: process.env.OLLAMA_ENDPOINT || 'http://localhost:11434',
        model: process.env.OLLAMA_MODEL || 'glm-5:cloud'
    });

    const validator = new IdeaValidatorAgent(ollama);

    const weakIdea = "A social network for dogs.";
    console.log(`\nOriginal Idea: "${weakIdea}"`);

    const result = await validator.refineIdea(weakIdea, 2, 8.0);

    console.log('\n--- Refinement History ---');
    result.history.forEach((val, i) => {
        console.log(`Cycle ${i}: Score ${val.average}`);
        console.log(`Strengths: ${val.strengths.join(', ')}`);
        console.log(`Weaknesses: ${val.weaknesses.join(', ')}`);
    });

    console.log('\n--- Final Refined Idea ---');
    console.log(result.finalIdea);
}

main().catch(console.error);
