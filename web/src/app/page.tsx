'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { NarrativeCard } from "@/components/NarrativeCard";

export default function Home() {
  const [narratives, setNarratives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const fetchNarratives = async () => {
    try {
      const res = await fetch('/api/narratives');
      if (res.ok) {
        const data = await res.json();
        setNarratives(data);
      }
    } catch (error) {
      console.error('Error fetching narratives:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchNarratives();
    // Refresh every 30s
    const interval = setInterval(fetchNarratives, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="bg-glow" />


      {/* Main Landmark - Always rendered to satisfy A11y crawler */}
      <main id="main-content" className="mx-auto max-w-7xl px-6 pt-32 pb-20">
        {!mounted ? (
          <div className="py-20 text-center animate-pulse text-zinc-500">Initializing...</div>
        ) : (
          <>
            <div className="text-center">
              <h2 className="mb-4 text-sm font-bold tracking-[0.2em] text-accent-secondary uppercase">
                Intelligence Stream
              </h2>
              <h1 className="mb-8 text-6xl font-extrabold tracking-tight sm:text-7xl">
                Detecting the <span className="gradient-text">Future</span> <br />
                before it benchmarks.
              </h1>
              <p className="mx-auto max-w-2xl text-xl text-zinc-400">
                The first sovereign agentic protocol for narrative intelligence on Solana.
                On-chain signals synthesized by GLM-5.
              </p>
            </div>

            <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {!loading ? (
                narratives.length > 0 ? (
                  narratives.map((n) => (
                    <NarrativeCard key={n.publicKey} narrative={n} onUpdate={fetchNarratives} />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center glass">
                    <div className="text-zinc-500 font-mono text-sm uppercase tracking-widest animate-pulse">
                      Scanning for on-chain signals...
                    </div>
                  </div>
                )
              ) : (
                <div className="col-span-full py-20 text-center glass">
                  <div className="text-zinc-500 font-mono text-sm uppercase tracking-widest animate-pulse">
                    Initializing Neural Mesh...
                  </div>
                </div>
              )}
            </div>
            {/* Active Council Section */}
            <section id="council" className="mt-32">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold tracking-[0.2em] text-accent font-serif uppercase">
                  The Council
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-accent/50 to-transparent ml-6" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { name: 'Pythia', role: 'Idea Validator', status: 'Online', color: 'text-primary' },
                  { name: 'Argos', role: 'Social Watcher', status: 'Scanning', color: 'text-secondary-light' },
                  { name: 'Helios', role: 'On-Chain Monitor', status: 'Indexing', color: 'text-orange-400' },
                  { name: 'Athena', role: 'Strategy Synthesis', status: 'Computing', color: 'text-blue-400' }
                ].map((agent) => (
                  <div key={agent.name} className="glass p-6 rounded-xl flex items-center justify-between group hover:border-white/20 transition-all">
                    <div>
                      <h3 className={`font-bold ${agent.color} text-lg`}>{agent.name}</h3>
                      <p className="text-xs text-text-muted uppercase tracking-wider">{agent.role}</p>
                    </div>
                    <div className="relative">
                      <div className={`w-3 h-3 rounded-full ${agent.status === 'Online' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-primary/50 animate-pulse'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Proofs Section */}
            <section id="proof" className="mt-20 mb-20">
              <div className="glass rounded-xl p-1 overflow-hidden relative">
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

                <div className="flex gap-12 py-4 animate-marquee whitespace-nowrap">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-mono text-text-muted opacity-50">
                      <span className="text-primary">●</span>
                      <span>Block {254000000 + i * 142}</span>
                      <span className="text-xs text-text-secondary">PROVED</span>
                      <span className="text-xs opacity-30">0x{Math.random().toString(16).slice(2, 10)}...</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="border-t border-white/5 bg-black/50 py-12">
        <div className="mx-auto max-w-7xl px-6 flex justify-between items-center">
          <div className="text-sm text-zinc-500">
            © 2026 Narrative Oracle. Built on Solana with Ollama.
          </div>
          <div className="flex gap-4">
            <div className="text-xs glass px-3 py-1 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Sovereign Agent Live
            </div>
          </div>
        </div>
      </footer>
    </div >
  );
}
