import { NextResponse } from 'next/server';

// Mock database for now - this will be populated by the Coordinator Agent
const mockNarratives = [
    {
        id: 1,
        title: "The Solana Sovereign Agent Era",
        confidence: 94,
        signals: 12,
        context: "Emerging trend of independent on-chain agents managing protocol treasury via OEV capture.",
        tags: ["On-Chain AI", "Treasury", "Gov"]
    },
    {
        id: 2,
        title: "Liquid Restaking Pivot",
        confidence: 81,
        signals: 8,
        context: "Massive liquidity shift towards Jito-style restaking frameworks for secondary yield.",
        tags: ["DeFi", "LRT", "Restaking"]
    },
    {
        id: 3,
        title: "Hyper-Personalized Social Trading",
        confidence: 76,
        signals: 15,
        context: "Social clustering suggests a move from copy-trading to intent-based personal agents.",
        tags: ["SocialFi", "Intents"]
    }
];

export async function GET() {
    // In the future, this will fetch from a DB or direct from the Anchor program
    return NextResponse.json(mockNarratives);
}
