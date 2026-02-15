'use client';

import React, { useEffect, useState } from "react";
import { NarrativeCard } from "@/components/NarrativeCard";

const MOCK_NARRATIVES = [
  {
    publicKey: '8PH2BtyQzVwaxzhEqs6bNSR43LiwYNZqp5pAjMfQnSm5',
    author: 'G2P8zkcKyUVCgvKbQYj8jBvWxVVdPTp9ZYt49r9x2A',
    metadataUrl: 'Sovereign AI Agents on Solana',
    confidenceScore: 92,
    totalStaked: 1450500000000,
    bump: 254,
    timestamp: new Date().toISOString(),
    signature: '5KMzQ7XqR2P8zkcKyUVCgvKbQYj8jBvWxVVdPTp9ZYt49r9x2A',
    buildIdeas: [
      'Decentralized Compute Marketplace for Agents',
      'Agent-to-Agent Payment Channels',
      'Reputation Scoring Protocol for AI',
      'Sovereign Personal Data Vaults',
      'AI-Governed DAOs'
    ],
    evidence: { institutional: 2, github: 5, community: 34 }
  },
  {
    publicKey: '8PH2BtyQzVwaxzhEqs6bNSR43LiwYNZqp5pAjMfQnSm6',
    author: 'G2P8zkcKyUVCgvKbQYj8jBvWxVVdPTp9ZYt49r9x2B',
    metadataUrl: 'Solana Mobile Stack v2 Explosion',
    confidenceScore: 85,
    totalStaked: 890200000000,
    bump: 253,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    signature: '2XyZ3aB4cD5eF6gH7iJ8kL9mN0oP1qR2sT3uV4wX5yZ6aB7cD8eF9gH0iJ1kL2m',
    buildIdeas: [
      'Mobile-First NFT Marketplace',
      'SMS-based Crypto Payments',
      'AR Wallet for Saga Phone',
      'Gesture-based DeFi Trading',
      'Mobile Gaming SDK'
    ],
    evidence: { institutional: 1, github: 3, community: 23 }
  }
];

export default function Home() {
  const [narratives, setNarratives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const fetchNarratives = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch('/api/narratives', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // NO HYDRATION - Use plain data to prevent base58 crashes
          setNarratives(data);
          setLoading(false);
          return;
        }
      }
      throw new Error('No data');
    } catch (error) {
      console.warn('API unavailable or empty, using Pantheon Mocks:', error);
      setNarratives(MOCK_NARRATIVES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchNarratives();
    const interval = setInterval(fetchNarratives, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen pb-20">
      <div className="bg-glow" />

      <main id="main-content" className="mx-auto max-w-7xl px-6 pt-32">
        {!mounted ? (
          <div className="py-20 text-center animate-pulse text-zinc-500">Initializing Neural Mesh...</div>
        ) : (
          <>
            <div className="text-center mb-20">
              <h2 className="mb-4 text-sm font-bold tracking-[0.2em] text-accent-secondary uppercase">
                Intelligence Stream
              </h2>
              <h1 className="mb-8 text-6xl font-extrabold tracking-tight sm:text-7xl">
                Detecting the <span className="gradient-text">Future</span> <br />
                before it benchmarks.
              </h1>
              <p className="mx-auto max-w-2xl text-xl text-zinc-400">
                The first sovereign agentic protocol for narrative intelligence on Solana.
                Institutional (50%) + Developer (30%) + Community (20%) weighted synthesis.
              </p>

              {/* Stats Dashboard */}
              <div className="mt-12 flex flex-wrap justify-center gap-8 border-y border-white/5 py-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{narratives.length || 5}</div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500">Active Prophecies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary-light">84%</div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500">Avg Confidence</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-validates">3.4k</div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500">SOL Staked</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-secondary">0</div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500">Oracle Challenges</div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {!loading ? (
                narratives.map((n) => (
                  <NarrativeCard key={n.publicKey.toString()} narrative={n} onUpdate={fetchNarratives} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center glass">
                  <div className="text-zinc-500 font-mono text-sm uppercase tracking-widest animate-pulse">
                    Scanning for on-chain signals...
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
          </>
        )}
      </main>
    </div>
  );
}
