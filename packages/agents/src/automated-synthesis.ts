
import { OllamaAdapter } from './OllamaAdapter';

export interface AutomatedNarrative {
    narrative_id: string;
    title: string;
    description: string;
    confidence: number; // 0-100
    category: string;
    evidence: {
        reports: string[];
        github: string[];
        community: string[];
    };
    sources: Array<{
        type: string;
        content: string;
        url: string;
    }>;
    build_ideas: Array<{
        title: string;
        description: string;
        rationale: string;
    }>;
    first_detected: Date;
}

export class AutomatedSynthesis {
    private ollama: OllamaAdapter;

    constructor() {
        // Use the model that is actually installed: glm-5:cloud
        this.ollama = new OllamaAdapter({ model: process.env.OLLAMA_MODEL || 'glm-5:cloud' });
    }

    async synthesize(signals: {
        reports: any[];
        github: any[];
        community: any[];
    }): Promise<AutomatedNarrative[]> {

        console.log('[Synthesis] Starting multi-source analysis...');
        console.log(`[Synthesis] Inputs: ${signals.reports.length} reports, ${signals.github.length} repos, ${signals.community.length} posts`);

        // Step 1: Cluster all signals into narratives
        const narratives = await this.clusterIntoNarratives(signals);

        // Step 2: Calculate confidence for each
        const scoredNarratives = narratives.map((n: any) =>
            this.calculateConfidence(n, signals)
        );

        // Step 3: Generate build ideas
        const withBuildIdeas = await Promise.all(
            scoredNarratives.map((n: any) => this.generateBuildIdeas(n))
        );

        // Step 4: Rank and return top 10
        const ranked = withBuildIdeas
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, 10);

        console.log(`[Synthesis] Generated ${ranked.length} narratives`);

        return ranked;
    }

    private async clusterIntoNarratives(signals: any) {
        const prompt = `
You are analyzing the Solana ecosystem to identify emerging narratives.

INSTITUTIONAL REPORTS (50% weight):
${signals.reports.map((r: any) => `- ${r.title}: ${r.content.slice(0, 200)}`).join('\n')}

DEVELOPER ACTIVITY (30% weight):
${signals.github.map((g: any) => `- ${g.name} (${g.stars} stars): ${g.description}`).join('\n')}

Identify 5-10 emerging narratives. For each, provide:
1. title (short, memorable)
2. description (2-3 sentences explaining the trend)
3. category (Mobile, DeFi, NFT, DePIN, AI Agents, Gaming, Infrastructure)
4. evidence (which specific signals support this)

Focus on narratives that appear across MULTIPLE sources (reports + github).

Return JSON array.
    `;

        const response = await this.ollama.generate({
            prompt,
            format: 'json'
        });

        return JSON.parse(response);
    }

    private calculateConfidence(
        narrative: any,
        signals: any
    ): AutomatedNarrative {

        // Count supporting evidence from each source
        const reportEvidence = signals.reports.filter((r: any) =>
            narrative.evidence?.reports?.includes(r.title) ||
            r.category === narrative.category
        );

        const githubEvidence = signals.github.filter((g: any) =>
            narrative.evidence?.github?.includes(g.name) ||
            g.category === narrative.category
        );

        // Weighted scoring
        const reportScore = Math.min(reportEvidence.length * 15, 50); // Max 50 points
        const githubScore = Math.min(githubEvidence.length * 5, 30);  // Max 30 points
        const communityScore = 0; // Temporarily 0

        const confidence = Math.min(reportScore + githubScore + communityScore, 100);

        // Build source citations
        const sources = [
            ...reportEvidence.map((r: any) => ({
                type: 'Report',
                content: r.title,
                url: r.url
            })),
            ...githubEvidence.slice(0, 5).map((g: any) => ({
                type: 'GitHub',
                content: `${g.name} (${g.stars} stars)`,
                url: g.url
            }))
        ];

        return {
            ...narrative,
            narrative_id: `narrative_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
            confidence,
            sources,
            evidence: {
                reports: reportEvidence.map((r: any) => r.title),
                github: githubEvidence.map((g: any) => g.name),
                community: []
            },
            first_detected: new Date(),
            build_ideas: [] // Will be filled next
        };
    }

    private async generateBuildIdeas(narrative: AutomatedNarrative) {
        const prompt = `
Generate 5 concrete product ideas for this Solana narrative.

NARRATIVE: ${narrative.title}
DESCRIPTION: ${narrative.description}
CATEGORY: ${narrative.category}
CONFIDENCE: ${narrative.confidence}%

SUPPORTING EVIDENCE:
${narrative.sources.map(s => `- ${s.type}: ${s.content}`).join('\n')}

For each idea:
1. title (max 60 chars, specific)
2. description (2-3 sentences, buildable product)
3. rationale (why this fits the narrative)

Requirements:
- Unbuilt products (not existing ones)
- Leverage Solana-specific advantages
- Realistic (buildable in 2-4 weeks by solo dev)
- Directly tied to the narrative momentum

Return JSON array of exactly 5 ideas.
    `;

        const response = await this.ollama.generate({
            prompt,
            format: 'json'
        });

        const build_ideas = JSON.parse(response);

        return {
            ...narrative,
            build_ideas
        };
    }
}
