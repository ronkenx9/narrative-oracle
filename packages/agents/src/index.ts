import dotenv from 'dotenv';
import { Connection, Keypair } from '@solana/web3.js';
import { OllamaAdapter } from './OllamaAdapter';
import { OnChainAgent } from './OnChainAgent';
import { SocialAgent, SocialSignal } from './SocialAgent';
import { CoordinatorAgent } from './CoordinatorAgent';
import { BuildIdeasAgent } from './BuildIdeasAgent';

dotenv.config();

const ROLL_INTERVAL = 2 * 60 * 1000; // 2 minutes

async function main() {
    console.log('🦅 Narrative Oracle Agent Runner Starting...');

    const rpcUrl = process.env.SOLANA_RPC_URL!;
    const heliusKey = process.env.HELIUS_API_KEY!;
    const connection = new Connection(rpcUrl, 'confirmed');

    // In production, load from a secure file. For MVP, we use the local keypair if exists
    const wallet = Keypair.generate();

    const ollama = new OllamaAdapter({
        baseUrl: process.env.OLLAMA_ENDPOINT || 'http://localhost:11434',
        model: process.env.OLLAMA_MODEL || 'glm-5:cloud'
    });

    const onChainAgent = new OnChainAgent(heliusKey, rpcUrl, ollama);
    const socialAgent = new SocialAgent(ollama);
    const buildIdeasAgent = new BuildIdeasAgent(ollama);
    const coordinatorAgent = new CoordinatorAgent(connection, wallet, ollama, '8PH2BtyQzVwaxzhEqs6bNSR43LiwYNZqp5pAjMfQnSm5');

    const runCycle = async () => {
        try {
            console.log('\n--- Starting Oracle Cycle ---');

            // 1. Detect On-Chain Signals
            const onChainSignals = await onChainAgent.detectSignals();

            // 2. Mock Social Signals (Replace with real X API if available)
            const mockSocialSignals: SocialSignal[] = [
                { author: 'solana_whale', content: 'Seeing massive yield shifts towards Jito restaking.', source: 'twitter', timestamp: Date.now() },
                { author: 'defi_expert', content: 'Solana agents are the new meta. Treasury automation is key.', source: 'twitter', timestamp: Date.now() }
            ];
            const socialThemes = await socialAgent.detectThemes(mockSocialSignals);

            // 3. Synthesize & Register
            const synthesis = await coordinatorAgent.synthesize(onChainSignals, socialThemes);
            console.log(`New Narrative Detected: ${synthesis.title} (Confidence: ${synthesis.confidence}%)`);

            // 4. Generate Build Ideas
            const ideas = await buildIdeasAgent.generateIdeas(synthesis.title, synthesis.metadata);
            console.log('Generated Build Ideas:', ideas);

            // 5. Register on-chain
            if (synthesis.confidence > 70) {
                await coordinatorAgent.registerOnChain(synthesis.title, synthesis.confidence);
            }

            console.log('--- Oracle Cycle Complete ---\n');
        } catch (error) {
            console.error('Error in oracle cycle:', error);
        }
    };

    // Initial run
    await runCycle();

    // Loop
    setInterval(runCycle, ROLL_INTERVAL);
}

main().catch(console.error);
