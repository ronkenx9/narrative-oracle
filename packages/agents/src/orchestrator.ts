
import { AutomatedReportsAgent } from './automated-reports-agent';
import { AutomatedGitHubAgent } from './automated-github-agent';
import { AutomatedCommunityAgent } from './automated-community-agent';
import { AutomatedSynthesis } from './automated-synthesis';

export class NarrativeOrchestrator {
    private reports: AutomatedReportsAgent;
    private github: AutomatedGitHubAgent;
    private community: AutomatedCommunityAgent;
    private synthesis: AutomatedSynthesis;

    constructor() {
        this.reports = new AutomatedReportsAgent();
        this.github = new AutomatedGitHubAgent();
        this.community = new AutomatedCommunityAgent();
        this.synthesis = new AutomatedSynthesis();
    }

    async detectNarratives() {
        console.log('\n🔮 NARRATIVE ORACLE - DETECTION STARTED\n');

        // Gather all signals in parallel (resiliently)
        const results = await Promise.allSettled([
            this.reports.detectSignals(),
            this.github.detectSignals(),
            this.community.detectSignals()
        ]);

        const reportSignals = results[0].status === 'fulfilled' ? results[0].value : [];
        const githubSignals = results[1].status === 'fulfilled' ? results[1].value : [];
        const communitySignals = results[2].status === 'fulfilled' ? results[2].value : [];

        if (results[0].status === 'rejected') console.error('[Orchestrator] Reports Agent failed:', results[0].reason);
        if (results[1].status === 'rejected') console.error('[Orchestrator] GitHub Agent failed:', results[1].reason);
        if (results[2].status === 'rejected') console.warn('[Orchestrator] Community Agent warning (skipping):', results[2].reason.message);

        console.log('\n📊 SIGNAL SUMMARY:');
        console.log(`Reports: ${reportSignals.length}`);
        console.log(`GitHub: ${githubSignals.length}`);
        console.log(`Community: ${communitySignals.length}`);
        console.log(`Total: ${reportSignals.length + githubSignals.length + communitySignals.length}\n`);

        // Synthesize into narratives
        // OPTIMIZATION: Slice to top 10 signals to speed up GLM-5 inference for demo
        const narratives = await this.synthesis.synthesize({
            reports: reportSignals.slice(0, 5),
            github: githubSignals.slice(0, 10),
            community: communitySignals.slice(0, 5)
        });

        console.log('\n✅ DETECTION COMPLETE\n');
        console.log(`Generated ${narratives.length} narratives:`);
        narratives.forEach((n: any, i: number) => {
            console.log(`  ${i + 1}. ${n.title} (${n.confidence}% confidence)`);
        });
        console.log('');

        return narratives;
    }
}
