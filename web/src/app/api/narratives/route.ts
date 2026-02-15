import { NextResponse } from 'next/server';
import { Connection } from '@solana/web3.js';
import { getAllNarratives } from '@/lib/solana';

export async function GET() {
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
    const connection = new Connection(rpcUrl, 'confirmed');

    try {
        const narratives = await getAllNarratives(connection);

        // Sort by confidence or stake if needed
        const sortedNarratives = narratives.sort((a, b) => b.confidenceScore - a.confidenceScore);

        return NextResponse.json(sortedNarratives);
    } catch (error) {
        console.error('API Error fetching narratives:', error);
        return NextResponse.json({ error: 'Failed to fetch narratives' }, { status: 500 });
    }
}
