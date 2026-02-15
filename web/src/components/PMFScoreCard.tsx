import React from 'react';
import { IdeaValidation, ValidationScore } from '@/lib/agents/IdeaValidatorAgent';

interface PMFScoreCardProps {
    validation: IdeaValidation;
}

const DimensionRow = ({ label, data }: { label: string, data: ValidationScore }) => (
    <div className="mb-4">
        <div className="flex justify-between items-end mb-1">
            <span className="text-sm font-medium text-text-secondary uppercase tracking-wider">{label}</span>
            <span className={`font-mono font-bold ${data.score >= 8 ? 'text-primary' : data.score >= 5 ? 'text-text-primary' : 'text-challenges'}`}>
                {data.score}/10
            </span>
        </div>
        <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
            <div
                className={`h-full rounded-full transition-all duration-1000 ${data.score >= 8 ? 'bg-primary shadow-[0_0_10px_rgba(212,175,55,0.5)]' : data.score >= 5 ? 'bg-secondary' : 'bg-challenges'}`}
                style={{ width: `${data.score * 10}%` }}
            />
        </div>
        <p className="mt-1 text-xs text-text-muted leading-relaxed">{data.reasoning}</p>
    </div>
);

export const PMFScoreCard: React.FC<PMFScoreCardProps> = ({ validation }) => {
    const { scores } = validation;
    const ralphFactor = scores.ralphFactor;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
            {/* Left Column: Core Viability */}
            <div className="glass p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl font-serif text-primary pointer-events-none">I</div>
                <h3 className="text-xl font-bold text-primary mb-6 border-b border-white/10 pb-2">Core Viability</h3>
                <DimensionRow label="Problem Clarity" data={scores.problemClarity} />
                <DimensionRow label="Market Size" data={scores.marketSize} />
                <DimensionRow label="Uniqueness" data={scores.uniqueness} />
                <DimensionRow label="Feasibility" data={scores.feasibility} />
                <DimensionRow label="Monetization" data={scores.monetization} />
            </div>

            {/* Right Column: Growth & Moat */}
            <div className="glass p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl font-serif text-secondary pointer-events-none">II</div>
                <h3 className="text-xl font-bold text-secondary mb-6 border-b border-white/10 pb-2">Growth & Moat</h3>
                <DimensionRow label="Timing" data={scores.timing} />
                <DimensionRow label="Virality" data={scores.virality} />
                <DimensionRow label="Defensibility" data={scores.defensibility} />
                <DimensionRow label="Team Fit" data={scores.teamFit} />

                {/* Ralph Factor - Special Highlight */}
                <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-marble-texture opacity-20" />
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-primary font-bold tracking-[0.2em] uppercase">Ralph Factor</span>
                            <span className="text-2xl font-bold text-primary animate-pulse">{ralphFactor.score}/10</span>
                        </div>
                        <p className="text-sm text-text-primary italic">"{ralphFactor.reasoning}"</p>
                    </div>
                </div>
            </div>

            {/* Total Score Banner */}
            <div className="md:col-span-2 glass p-8 text-center relative overflow-hidden rounded-3xl border-t border-primary/50">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-pulse-slow" />
                <div className="relative z-10">
                    <h2 className="text-sm font-bold tracking-[0.3em] text-text-muted uppercase mb-2">Total Intelligence Score</h2>
                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary via-white to-secondary drop-shadow-lg">
                        {validation.average}
                    </div>
                </div>
            </div>
        </div>
    );
};
