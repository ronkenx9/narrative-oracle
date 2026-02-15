
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

        // Gather all signals in parallel
        const [reportSignals, githubSignals, communitySignals] = await Promise.all([
            this.reports.detectSignals(),
            this.github.detectSignals(),
            this.community.detectSignals()
        ]);

        // const communitySignals: any[] = []; // Skipping community for now

        console.log('\n📊 SIGNAL SUMMARY:');
        console.log(`Reports: ${reportSignals.length}`);
        console.log(`GitHub: ${githubSignals.length}`);
        console.log(`Community: ${communitySignals.length} (Skipped)`);
        console.log(`Total: ${reportSignals.length + githubSignals.length + communitySignals.length}\n`);

        // Synthesize into narratives
        const narratives = await this.synthesis.synthesize({
            reports: reportSignals,
            github: githubSignals,
            community: communitySignals
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
