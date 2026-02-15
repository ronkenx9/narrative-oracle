
export interface CommunitySignal {
    source: 'Reddit' | 'Farcaster';
    content: string;
    author: string;
    engagement: number;
    timestamp: Date;
    url: string;
    category?: string;
}

export class AutomatedCommunityAgent {
    private neynarApiKey: string;

    constructor() {
        this.neynarApiKey = process.env.NEYNAR_API_KEY || 'DA135291-2CAB-4D2D-B1C7-51720E163804';
    }

    async detectSignals(): Promise<CommunitySignal[]> {
        console.log('[Community Agent] Gathering community signals...');

        // Reddit skipped for now (requires OAuth setup), focusing on Farcaster
        const farcaster = await this.getFarcasterSignals();

        console.log(`[Community Agent] Found ${farcaster.length} Farcaster signals`);

        return farcaster;
    }

    private async getFarcasterSignals(): Promise<CommunitySignal[]> {
        try {
            const response = await fetch(
                `https://api.neynar.com/v2/farcaster/cast/search?q=solana&limit=30`,
                {
                    headers: {
                        'api_key': this.neynarApiKey,
                        'accept': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Neynar API returned ${response.status}`);
            }

            const data = await response.json();

            return data.result.casts.map((cast: any) => ({
                source: 'Farcaster' as const,
                content: cast.text,
                author: cast.author.username,
                engagement: cast.reactions.likes_count + cast.reactions.recasts_count,
                timestamp: new Date(cast.timestamp),
                url: `https://warpcast.com/${cast.author.username}/${cast.hash.slice(0, 10)}`,
                category: this.categorizePost(cast.text)
            }));

        } catch (error) {
            console.error('[Community Agent] Farcaster fetch failed:', error);
            return [];
        }
    }

    private categorizePost(text: string): string {
        const lower = text.toLowerCase();

        if (lower.includes('mobile') || lower.includes('saga')) return 'Mobile';
        if (lower.includes('depin')) return 'DePIN';
        if (lower.includes('defi') || lower.includes('swap') || lower.includes('dex')) return 'DeFi';
        if (lower.includes('nft')) return 'NFT';
        if (lower.includes('agent') || lower.includes('ai')) return 'AI Agents';
        if (lower.includes('game') || lower.includes('gaming')) return 'Gaming';

        return 'General';
    }
}
