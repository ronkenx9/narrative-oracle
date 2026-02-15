import { Connection, PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import idl from './idl.json';

const PROGRAM_ID = new PublicKey(idl.address);

export interface Narrative {
    publicKey: any; // Allow string or PublicKey for hydration safety
    author: any;
    metadataUrl: string;
    confidenceScore: number;
    totalStaked: number;
    bump: number;
    // Enhanced fields for 10/10 MVP
    buildIdeas: string[];
    timestamp: string;
    signature: string;
}

export async function getAllNarratives(connection: Connection): Promise<Narrative[]> {
    const provider = new anchor.AnchorProvider(
        connection,
        { publicKey: PublicKey.default } as any, // Dummy wallet for read-only
        { commitment: 'confirmed' }
    );
    const program = new anchor.Program(idl as any, provider) as any;

    try {
        const accounts = await program.account.narrative.all();

        return accounts.map((acc: any) => ({
            publicKey: acc.publicKey,
            author: acc.account.author,
            metadataUrl: acc.account.metadataUrl,
            confidenceScore: acc.account.confidenceScore,
            totalStaked: acc.account.totalStaked.toNumber(),
            bump: acc.account.bump,
            // Mock data for MVP visual completeness
            timestamp: new Date().toISOString(),
            signature: '5KMz...9x2A', // Mock signature for UI
            buildIdeas: [
                `Build a ${acc.account.metadataUrl.split(' ').slice(0, 2).join(' ')} prediction market`,
                'Develop an agent-swarms arbitrage bot',
                'Create a tokenized governance layer',
                'Launch a mobile-first wallet adapter',
                'Deploy a sovereign data availability node'
            ]
        }));
    } catch (error) {
        console.error('Error fetching narratives from Solana:', error);
        return [];
    }
}
