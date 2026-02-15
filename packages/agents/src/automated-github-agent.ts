
export interface GitHubSignal {
    type: 'trending' | 'recent';
    name: string;
    description: string;
    stars: number;
    stargazers_growth?: number;
    category: string;
    url: string;
    created_at: string;
}

export class AutomatedGitHubAgent {

    async detectSignals(): Promise<GitHubSignal[]> {
        console.log('[GitHub Agent] Analyzing developer activity...');

        const [trending, recent] = await Promise.all([
            this.getTrendingRepos(),
            this.getRecentRepos()
        ]);

        const allSignals = [...trending, ...recent];
        console.log(`[GitHub Agent] Found ${allSignals.length} repos (${trending.length} trending, ${recent.length} recent)`);

        return allSignals;
    }

    private async getTrendingRepos(): Promise<GitHubSignal[]> {
        try {
            const response = await fetch(
                'https://api.github.com/search/repositories?' +
                'q=solana+stars:>50+pushed:>2026-01-01&' +
                'sort=stars&order=desc&per_page=30',
                {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        // No authentication needed for public data
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`GitHub API returned ${response.status}`);
            }

            const data = await response.json();

            return data.items.map((repo: any) => ({
                type: 'trending' as const,
                name: repo.name,
                description: repo.description || 'No description',
                stars: repo.stargazers_count,
                category: this.categorizeRepo(repo),
                url: repo.html_url,
                created_at: repo.created_at
            }));

        } catch (error) {
            console.error('[GitHub Agent] Failed to fetch trending repos:', error);
            return [];
        }
    }

    private async getRecentRepos(): Promise<GitHubSignal[]> {
        try {
            // New projects (last 30 days) with traction
            const response = await fetch(
                'https://api.github.com/search/repositories?' +
                'q=solana+created:>2026-01-15+stars:>10&' +
                'sort=stars&order=desc&per_page=20',
                {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`GitHub API returned ${response.status}`);
            }

            const data = await response.json();

            return data.items.map((repo: any) => ({
                type: 'recent' as const,
                name: repo.name,
                description: repo.description || 'No description',
                stars: repo.stargazers_count,
                category: this.categorizeRepo(repo),
                url: repo.html_url,
                created_at: repo.created_at
            }));

        } catch (error) {
            console.error('[GitHub Agent] Failed to fetch recent repos:', error);
            return [];
        }
    }

    private categorizeRepo(repo: any): string {
        const desc = (repo.description || '').toLowerCase();
        const topics = repo.topics || [];
        const name = repo.name.toLowerCase();

        if (desc.includes('mobile') || topics.includes('mobile') || name.includes('mobile')) return 'Mobile';
        if (desc.includes('depin') || topics.includes('depin')) return 'DePIN';
        if (desc.includes('defi') || topics.includes('defi') || topics.includes('dex')) return 'DeFi';
        if (desc.includes('nft') || topics.includes('nft')) return 'NFT';
        if (desc.includes('agent') || topics.includes('ai') || desc.includes('ai')) return 'AI Agents';
        if (desc.includes('game') || topics.includes('gaming')) return 'Gaming';

        return 'Infrastructure';
    }
}
