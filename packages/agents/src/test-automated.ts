
import { NarrativeOrchestrator } from './orchestrator';

async function main() {
    const oracle = new NarrativeOrchestrator();
    const narratives = await oracle.detectNarratives();

    console.log('\nFull Output:');
    console.log(JSON.stringify(narratives, null, 2));
}

main();
