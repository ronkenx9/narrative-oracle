import { Connection, PublicKey } from '@solana/web3.js';
import { Helius } from 'helius-sdk';
import { OllamaAdapter } from './OllamaAdapter';

export interface OnChainSignal {
    programId: string;
    description: string;
    timestamp: number;
    activitySummary: string;
}

export class OnChainAgent {
    private helius: Helius;
    private connection: Connection;
    private ollama: OllamaAdapter;

    constructor(heliusKey: string, rpcUrl: string, ollama: OllamaAdapter) {
        this.helius = new Helius(heliusKey);
        this.connection = new Connection(rpcUrl);
        this.ollama = ollama;
    }

    /**
     * Detect signals by looking at a specific program or recent activity
     */
    async detectSignals(targetProgram?: string): Promise<OnChainSignal[]> {
        console.log('Detecting signals on-chain...');

        // In a real scenario, we'd use Helius Webhooks or getSelectedAccountTransactions
        // For MVP, we'll fetch recent transactions for a known "hot" program or generally
        const programId = targetProgram || 'ComputeBudget111111111111111111111111111111'; // Placeholder

        try {
            const signatures = await this.connection.getSignaturesForAddress(
                new PublicKey(programId),
                { limit: 5 }
            );

            const signals: OnChainSignal[] = [];

            for (const sig of signatures) {
                const txInfo = await this.connection.getParsedTransaction(sig.signature, {
                    maxSupportedTransactionVersion: 0
                });

                if (txInfo) {
                    const activityRaw = JSON.stringify(txInfo.meta?.logMessages || []);
                    const summaryPrompt = `
                        Summarize the following Solana transaction logs into a one-sentence "narrative signal".
                        Focus on what the user is doing (e.g., swapping, minting, staking).
                        Logs: ${activityRaw}
                    `;

                    const summary = await this.ollama.generate(summaryPrompt);

                    signals.push({
                        programId: programId,
                        description: `Transaction ${sig.signature.slice(0, 8)}...`,
                        timestamp: sig.blockTime || Date.now(),
                        activitySummary: summary.trim()
                    });
                }
            }

            return signals;
        } catch (error) {
            console.error('Error detecting on-chain signals:', error);
            return [];
        }
    }
}
