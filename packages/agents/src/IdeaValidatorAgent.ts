import { OllamaAdapter } from './OllamaAdapter';

export interface ValidationScore {
    score: number;
    reasoning: string;
}

export interface IdeaValidation {
    scores: {
        problemClarity: ValidationScore;
        marketSize: ValidationScore;
        uniqueness: ValidationScore;
        feasibility: ValidationScore;
        monetization: ValidationScore;
        timing: ValidationScore;
        virality: ValidationScore;
        defensibility: ValidationScore;
        teamFit: ValidationScore;
        oracleFactor: ValidationScore;
    };
    average: number;
    strengths: string[];
    weaknesses: string[];
    improvements: string[];
}

const PMF_DIMENSIONS = [
    'problemClarity', 'marketSize', 'uniqueness', 'feasibility', 'monetization',
    'timing', 'virality', 'defensibility', 'teamFit', 'oracleFactor'
];

export class IdeaValidatorAgent {
    private ollama: OllamaAdapter;

    constructor(ollama: OllamaAdapter) {
        this.ollama = ollama;
    }

    async validateIdea(ideaDescription: string): Promise<IdeaValidation> {
        console.log(`🔍 Validating Idea: "${ideaDescription.slice(0, 50)}..."`);

        const prompt = `
        You are "Pythia", a wise but ruthless Oracle validator. Score this idea on 10 PMF dimensions (1-10 each).

        IDEA: ${ideaDescription}

        SCORING RUBRIC:
        1. Problem Clarity: Is the pain point quantified? (1=Vague, 10=Quantified $$$)
        2. Market Size: Is TAM > $1B? (1=Niche, 10=Unicorn potential)
        3. Uniqueness: Is there a moat? (1=Commodity, 10=Novel mechanism)
        4. Feasibility: Can an indie team build it? (1=Impossible, 10=MVP in 2 weeks)
        5. Monetization: Is there clear WTP? (1=Ads?, 10=Pre-sales)
        6. Timing: Why now? (1=Too early/late, 10=Perfect catalyst)
        7. Virality: Are there growth loops? (1=Sales-led, 10=Product-led)
        8. Defensibility: Switching costs? (1=None, 10=Lock-in)
        9. Team Fit: Low ops? (1=Heavy ops, 10=Automated code)
        10. Oracle Factor: Is it cool? (1=Boring, 10=Mind-blowing)

        OUTPUT JSON format ONLY:
        {
          "scores": {
            "problemClarity": { "score": 0, "reasoning": "..." },
            "marketSize": { "score": 0, "reasoning": "..." },
            "uniqueness": { "score": 0, "reasoning": "..." },
            "feasibility": { "score": 0, "reasoning": "..." },
            "monetization": { "score": 0, "reasoning": "..." },
            "timing": { "score": 0, "reasoning": "..." },
            "virality": { "score": 0, "reasoning": "..." },
            "defensibility": { "score": 0, "reasoning": "..." },
            "teamFit": { "score": 0, "reasoning": "..." },
            "oracleFactor": { "score": 0, "reasoning": "..." }
          },
          "strengths": ["..."],
          "weaknesses": ["..."],
          "improvements": ["Apply specifically to low scores..."]
        }
        `;

        try {
            const response = await this.ollama.generate(prompt);

            // Attempt to parse JSON (Ollama can be chatty)
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("No JSON found in response");

            const validation = JSON.parse(jsonMatch[0]);

            // Calculate average manually to be safe
            const scores = Object.values(validation.scores).map((s: any) => s.score);
            const average = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;

            return {
                ...validation,
                average: parseFloat(average.toFixed(1))
            };
        } catch (error) {
            console.error("Validation failed:", error);
            throw new Error("Failed to validate idea. Agent confusion.");
        }
    }

    async refineIdea(originalIdea: string, maxIterations = 3, targetScore = 8.5): Promise<{ history: IdeaValidation[], finalIdea: string }> {
        let currentIdea = originalIdea;
        const history: IdeaValidation[] = [];

        for (let i = 0; i < maxIterations; i++) {
            console.log(`🔄 Refinement Cycle ${i + 1}/${maxIterations}`);

            const validation = await this.validateIdea(currentIdea);
            history.push(validation);

            if (validation.average >= targetScore) {
                console.log(`✨ Target Score Reached: ${validation.average}`);
                break;
            }

            console.log(`📉 Score ${validation.average} < ${targetScore}. Improving...`);

            // Ask Ollama to rewrite the idea based on improvements
            const improvePrompt = `
            Rewrite this startup idea to address the following weaknesses and implement these improvements:

            CURRENT IDEA: ${currentIdea}

            WEAKNESSES: ${validation.weaknesses.join(', ')}
            IMPROVEMENTS: ${validation.improvements.join(', ')}

            Make it sound professional, punchy, and highly investable.
            JUST RETURN THE NEW IDEA TEXT. NO COMMENTARY.
            `;

            const improvedResponse = await this.ollama.generate(improvePrompt);
            currentIdea = improvedResponse.trim();
        }

        return { history, finalIdea: currentIdea };
    }
}
