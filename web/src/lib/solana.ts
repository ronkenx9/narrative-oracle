import { Connection, PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import idl from './idl.json';

const PROGRAM_ID = new PublicKey(idl.address);

export interface Narrative {
    publicKey: PublicKey;
    author: PublicKey;
    metadataUrl: string;
    confidenceScore: number;
    totalStaked: number;
    bump: number;
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

        return accounts.map(acc => ({
            publicKey: acc.publicKey,
            author: acc.account.author,
            metadataUrl: acc.account.metadataUrl,
            confidenceScore: acc.account.confidenceScore,
            totalStaked: acc.account.totalStaked.toNumber(),
            bump: acc.account.bump,
        }));
    } catch (error) {
        console.error('Error fetching narratives from Solana:', error);
        return [];
    }
}
