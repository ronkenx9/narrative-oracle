import { NextResponse } from 'next/server';
import { Connection } from '@solana/web3.js';
import { getAllNarratives } from '@/lib/solana';

export async function GET() {
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
    const connection = new Connection(rpcUrl, 'confirmed');

    try {
        const narratives = await getAllNarratives(connection);

        if (narratives.length === 0) {
            console.log('⚠️ No on-chain data found. Injecting Pantheon Mocks for Demo.');
            return NextResponse.json([
                {
                    publicKey: '8PH2BtyQzVwaxzhEqs6bNSR43LiwYNZqp5pAjMfQnSm5',
                    author: 'G2P...9x2A',
                    metadataUrl: 'The Rise of Sovereign AI Agents',
                    confidenceScore: 92,
                    totalStaked: 1450.5,
                    bump: 254,
                    timestamp: new Date().toISOString(),
                    signature: '5KMz...9x2A',
                    buildIdeas: [
                        'Decentralized Compute Marketplace for Agents',
                        'Agent-to-Agent Payment Channels',
                        'Reputation Scoring Protocol for AI',
                        'Sovereign Personal Data Vaults',
                        'AI-Governed DAOs'
                    ]
                },
                {
                    publicKey: '3Xx...Mockkw',
                    author: 'D4...Mock',
                    metadataUrl: 'Solana Mobile Stack v2 Explosion',
                    confidenceScore: 85,
                    totalStaked: 890.2,
                    bump: 253,
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    signature: '2Xy...Mock',
                    buildIdeas: [
                        'Mobile-First NFT Marketplace',
                        'SMS-based Crypto Payments',
                        'AR Wallet for Saga Phone',
                        'Gesture-based DeFi Trading',
                        'Mobile Gaming SDK'
                    ]
                },
                {
                    publicKey: '9Zz...Mock',
                    author: 'E5...Mock',
                    metadataUrl: 'DePIN Energy Grid Saturation',
                    confidenceScore: 78,
                    totalStaked: 420.0,
                    bump: 252,
                    timestamp: new Date(Date.now() - 7200000).toISOString(),
                    signature: '7Wz...Mock',
                    buildIdeas: [
                        'P2P Energy Trading Platform',
                        'Smart Meter Oracle',
                        'Carbon Credit Tokenization',
                        'Grid Balancing Algorithms',
                        'Home Battery Optimization'
                    ]
                }
            ]);
        }

        const sortedNarratives = narratives.sort((a, b) => b.confidenceScore - a.confidenceScore);
        return NextResponse.json(sortedNarratives);
    } catch (error) {
        console.error('API Error fetching narratives:', error);
        // Fallback to mocks on RPC failure to ensure demo stability
        console.log('⚠️ RPC Failed. Injecting Pantheon Mocks for Demo.');
        return NextResponse.json([
            {
                publicKey: '8PH2BtyQzVwaxzhEqs6bNSR43LiwYNZqp5pAjMfQnSm5',
                author: 'G2P...9x2A',
                metadataUrl: 'The Rise of Sovereign AI Agents',
                confidenceScore: 92,
                totalStaked: 1450.5,
                bump: 254,
                timestamp: new Date().toISOString(),
                signature: '5KMz...9x2A',
                buildIdeas: [
                    'Decentralized Compute Marketplace for Agents',
                    'Agent-to-Agent Payment Channels',
                    'Reputation Scoring Protocol for AI',
                    'Sovereign Personal Data Vaults',
                    'AI-Governed DAOs'
                ]
            },
            {
                publicKey: '3Xx...Mockkw',
                author: 'D4...Mock',
                metadataUrl: 'Solana Mobile Stack v2 Explosion',
                confidenceScore: 85,
                totalStaked: 890.2,
                bump: 253,
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                signature: '2Xy...Mock',
                buildIdeas: [
                    'Mobile-First NFT Marketplace',
                    'SMS-based Crypto Payments',
                    'AR Wallet for Saga Phone',
                    'Gesture-based DeFi Trading',
                    'Mobile Gaming SDK'
                ]
            },
            {
                publicKey: '9Zz...Mock',
                author: 'E5...Mock',
                metadataUrl: 'DePIN Energy Grid Saturation',
                confidenceScore: 78,
                totalStaked: 420.0,
                bump: 252,
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                signature: '7Wz...Mock',
                buildIdeas: [
                    'P2P Energy Trading Platform',
                    'Smart Meter Oracle',
                    'Carbon Credit Tokenization',
                    'Grid Balancing Algorithms',
                    'Home Battery Optimization'
                ]
            }
        ]);
    }
}
