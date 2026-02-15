
import Parser from 'rss-parser';

export interface ReportSignal {
    source: 'Messari' | 'Helius';
    title: string;
    content: string;
    url: string;
    published: Date;
    category?: string;
}

export class AutomatedReportsAgent {
    private rssParser = new Parser();

    private sources = [
        {
            name: 'Messari' as const,
            rss: 'https://messari.io/rss',
            weight: 1.0
        },
        {
            name: 'Helius' as const,
            rss: 'https://www.helius.dev/blog/rss.xml',
            weight: 1.0
        }
    ];

    async detectSignals(): Promise<ReportSignal[]> {
        console.log('[Reports Agent] Fetching institutional intelligence...');

        const allSignals: ReportSignal[] = [];

        for (const source of this.sources) {
            try {
                const feed = await this.rssParser.parseURL(source.rss);

                // Filter for Solana content from last 2 weeks
                const twoWeeksAgo = new Date();
                twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

                const solanaContent = feed.items
                    .filter(item => {
                        const pubDate = new Date(item.pubDate || Date.now());
                        const content = `${item.title} ${item.content || item.contentSnippet}`.toLowerCase();
                        const isSolana = content.includes('solana');
                        const isRecent = pubDate > twoWeeksAgo;

                        return isSolana && isRecent;
                    })
                    .map(item => ({
                        source: source.name,
                        title: item.title || '',
                        content: item.content || item.contentSnippet || '',
                        url: item.link || '',
                        published: new Date(item.pubDate || Date.now()),
                        category: this.categorizeContent(item.title || '')
                    }));

                allSignals.push(...solanaContent);
                console.log(`[Reports Agent] ${source.name}: Found ${solanaContent.length} Solana articles`);

            } catch (error) {
                console.error(`[Reports Agent] Failed to fetch ${source.name}:`, error);
            }
        }

        return allSignals;
    }

    private categorizeContent(text: string): string {
        const lower = text.toLowerCase();

        if (lower.includes('mobile') || lower.includes('saga')) return 'Mobile';
        if (lower.includes('depin')) return 'DePIN';
        if (lower.includes('defi') || lower.includes('swap')) return 'DeFi';
        if (lower.includes('nft')) return 'NFT';
        if (lower.includes('agent') || lower.includes('ai')) return 'AI Agents';
        if (lower.includes('game')) return 'Gaming';

        return 'Infrastructure';
    }
}
