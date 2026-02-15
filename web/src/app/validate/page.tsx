'use client';

import React, { useState } from 'react';
import { PMFScoreCard } from '@/components/PMFScoreCard';
import { IdeaValidation } from '@/lib/agents/IdeaValidatorAgent';

export default function ValidatePage() {
    const [idea, setIdea] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<IdeaValidation | null>(null);

    const handleValidate = async () => {
        if (!idea.trim()) return;
        setLoading(true);
        setResult(null);

        try {
            const res = await fetch('/api/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idea })
            });

            if (!res.ok) throw new Error('Validation failed');

            const data = await res.json();
            setResult(data);
        } catch (error) {
            console.error(error);
            alert('Ralph is offline. Check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">
                        <span className="gradient-text">VALIDATE</span> YOUR THESIS
                    </h1>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        Submit your narrative to the Council. Receive a ruthless 10-point PMF analysis from the Oracle's autonomous agents.
                    </p>
                </div>

                {/* Input Section */}
                <div className="glass p-8 rounded-3xl mb-12 border border-white/5 relative overflow-hidden group focus-within:border-primary/50 transition-colors">
                    <div className="absolute inset-0 bg-marble-texture opacity-30 pointer-events-none" />

                    <textarea
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        placeholder="Describe your startup idea, protocol, or narrative here... (Be specific about the problem and solution)"
                        className="w-full bg-transparent text-lg text-text-primary placeholder:text-text-muted focus:outline-none min-h-[150px] resize-none relative z-10 font-sans"
                    />

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleValidate}
                            disabled={loading || !idea.trim()}
                            className="bg-primary hover:bg-primary-light text-surface font-bold py-3 px-8 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2 relative z-10"
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin text-xl">◉</span>
                                    <span>CONSULTING ORACLE...</span>
                                </>
                            ) : (
                                <span>VALIDATE IDENTITY</span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Results Section */}
                {result && (
                    <div className="animate-fade-in-up">
                        <PMFScoreCard validation={result} />

                        {/* Refinement Suggestions */}
                        <div className="mt-12 grid md:grid-cols-2 gap-8">
                            <div className="glass p-6 rounded-2xl border border-validates/20">
                                <h3 className="text-validates font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span className="text-xl">⊕</span> Strengths
                                </h3>
                                <ul className="space-y-3">
                                    {result.strengths.map((str, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-text-secondary">
                                            <span className="text-validates mt-1">✓</span>
                                            {str}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="glass p-6 rounded-2xl border border-challenges/20">
                                <h3 className="text-challenges font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span className="text-xl">⊖</span> Weaknesses & Improvements
                                </h3>
                                <div className="space-y-4">
                                    {result.improvements.map((imp, i) => (
                                        <div key={i} className="text-sm p-3 bg-white/5 rounded-lg border border-white/5">
                                            <span className="text-challenges font-bold block mb-1">Fix Required:</span>
                                            <span className="text-text-secondary">{imp}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
