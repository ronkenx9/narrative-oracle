import { NextResponse } from 'next/server';
import { Connection } from '@solana/web3.js';
import { getAllNarratives } from '@/lib/solana';

// Force dynamic to prevent static optimization
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { transaction_signature, filters } = body;

        // 1. Payment Verification (Simulated for MVP)
        // In a real version, we would verify the tx transfers 0.01 SOL to our treasury
        if (!transaction_signature) {
            // Allow free tier for MVP demo purposes, or return 402
            // return NextResponse.json({ error: 'Payment required: 0.01 SOL' }, { status: 402 });
            console.log('⚠️ No payment signature provided (Demo Mode)');
        }

        // 2. Fetch Intelligence
        const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
        const connection = new Connection(rpcUrl, 'confirmed');
        const narratives = await getAllNarratives(connection);

        // 3. Filter Results
        const minConfidence = filters?.minConfidence || 0;
        const filtered = narratives.filter(n => n.confidenceScore >= minConfidence);

        return NextResponse.json({
            meta: {
                timestamp: new Date().toISOString(),
                count: filtered.length,
                protocol: 'Narrative Oracle Agent Protocol v1',
            },
            data: filtered.map(n => ({
                id: n.publicKey.toBase58(),
                topic: n.metadataUrl,
                confidence: n.confidenceScore,
                opportunities: n.buildIdeas,
                proof: `https://explorer.solana.com/address/${n.publicKey.toBase58()}?cluster=devnet`
            }))
        });

    } catch (error) {
        console.error('Agent Query Error:', error);
        return NextResponse.json(
            { error: 'Failed to query intelligence' },
            { status: 500 }
        );
    }
}
