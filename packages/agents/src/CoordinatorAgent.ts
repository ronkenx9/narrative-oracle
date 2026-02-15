import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { OnChainSignal } from './OnChainAgent';
import { SocialSignal, NarrativeTheme } from './SocialAgent';
import { OllamaAdapter } from './OllamaAdapter';

export class CoordinatorAgent {
    private connection: Connection;
    private wallet: Keypair;
    private ollama: OllamaAdapter;
    private programId: PublicKey;

    constructor(
        connection: Connection,
        wallet: Keypair,
        ollama: OllamaAdapter,
        programId: string
    ) {
        this.connection = connection;
        this.wallet = wallet;
        this.ollama = ollama;
        this.programId = new PublicKey(programId);
    }

    /**
     * Synthesizes all signals into a single consensus narrative
     */
    async synthesize(
        onChainSignals: OnChainSignal[],
        socialThemes: NarrativeTheme[]
    ): Promise<{ title: string; confidence: number; metadata: string }> {
        console.log('Synthesizing signal consensus...');

        const synthesisPrompt = `
            Task: Synthesize a "Narrative Title" based on on-chain and social signals.
            
            On-Chain Signals:
            ${onChainSignals.map(s => s.activitySummary).join('\n')}

            Social Themes:
            ${socialThemes.map(t => `${t.title} (${t.sentiment}, strength: ${t.strength})`).join('\n')}

            Requirements:
            1. Output a catchy title.
            2. Compute an overall "Narrative Confidence Score" (0-100).
            3. Provide a 1-sentence metadata justification.

            Output JSON only: {"title": "...", "confidence": 85, "justification": "..."}
        `;

        const response = await this.ollama.generate(synthesisPrompt);
        const jsonMatch = response.match(/\{.*\}/s);
        const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { title: 'Unknown Narrative', confidence: 0, justification: '' };

        return {
            title: result.title,
            confidence: result.confidence,
            metadata: result.justification
        };
    }

    /**
     * Registers the narrative on-chain via the Anchor program
     */
    async registerOnChain(title: string, confidence: number): Promise<string> {
        console.log(`Registering narrative on-chain: ${title}`);

        // This is a placeholder for the actual Anchor instruction call
        // we'll implement the full Anchor client interaction in the next step
        return "TransactionSignaturePlaceholder";
    }
}
