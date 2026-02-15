import dotenv from 'dotenv';
import { OllamaAdapter } from './OllamaAdapter';
import { SocialAgent, SocialSignal } from './SocialAgent';

dotenv.config();

async function main() {
    console.log('🧪 Testing Social Agent...');

    const ollama = new OllamaAdapter({
        baseUrl: process.env.OLLAMA_ENDPOINT || 'http://localhost:11434',
        model: process.env.OLLAMA_MODEL || 'glm-5:cloud'
    });

    const socialAgent = new SocialAgent(ollama);

    const mockSignals: SocialSignal[] = [
        { author: 'user1', content: 'Solana blinks are going to change everything for payments.', source: 'twitter', timestamp: Date.now() },
        { author: 'user2', content: 'Just saw a demo of a Blink on X. It is seamless.', source: 'twitter', timestamp: Date.now() },
        { author: 'user3', content: 'The UX for Solana Blinks is incredible. Mass adoption incoming.', source: 'twitter', timestamp: Date.now() },
        { author: 'user4', content: 'Unpopular opinion: Blinks are overrated.', source: 'twitter', timestamp: Date.now() },
        { author: 'user5', content: 'DePIN on Solana is heating up with Hivemapper.', source: 'twitter', timestamp: Date.now() }
    ];

    console.log(`\nAnalyzing ${mockSignals.length} signals...`);

    const themes = await socialAgent.detectThemes(mockSignals);

    console.log('\n--- Detected Themes ---');
    console.log(JSON.stringify(themes, null, 2));
}

main().catch(console.error);
