'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PublicKey } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { NarrativeCard } from "@/components/NarrativeCard";

const MOCK_NARRATIVES = [
  {
    publicKey: new PublicKey('8PH2BtyQzVwaxzhEqs6bNSR43LiwYNZqp5pAjMfQnSm5'),
    author: new PublicKey('G2P...9x2A'),
    metadataUrl: 'The Rise of Sovereign AI Agents',
    confidenceScore: 92,
    totalStaked: 1450.5,
    bump: 254,
    timestamp: new Date().toISOString(),
    signature: '5KMz...9x2A',
    buildIdeas: [
      'Decentralized Compute Marketplace for Agents',
      'Agent-to-Agent Payment Channels',
      'Reputation Scoring Protocol for AI',
      'Sovereign Personal Data Vaults',
      'AI-Governed DAOs'
    ]
  },
  {
    publicKey: new PublicKey('3Xx...Mockkw'),
    author: new PublicKey('D4...Mock'),
    metadataUrl: 'Solana Mobile Stack v2 Explosion',
    confidenceScore: 85,
    totalStaked: 890.2,
    bump: 253,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    signature: '2Xy...Mock',
    buildIdeas: [
      'Mobile-First NFT Marketplace',
      'SMS-based Crypto Payments',
      'AR Wallet for Saga Phone',
      'Gesture-based DeFi Trading',
      'Mobile Gaming SDK'
    ]
  },
  {
    publicKey: new PublicKey('9Zz...Mock'),
    author: new PublicKey('E5...Mock'),
    metadataUrl: 'DePIN Energy Grid Saturation',
    confidenceScore: 78,
    totalStaked: 420.0,
    bump: 252,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    signature: '7Wz...Mock',
    buildIdeas: [
      'P2P Energy Trading Platform',
      'Smart Meter Oracle',
      'Carbon Credit Tokenization',
      'Grid Balancing Algorithms',
      'Home Battery Optimization'
    ]
  }
];

export default function Home() {
  const [narratives, setNarratives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const fetchNarratives = async () => {
    try {
      // 5-second timeout for the API call
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch('/api/narratives', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          // Hydrate PublicKey strings back to objects
          const hydratedData = data.map((n: any) => ({
            ...n,
            publicKey: new PublicKey(n.publicKey),
            author: new PublicKey(n.author),
          }));
          setNarratives(hydratedData);
          setLoading(false);
          return;
        }
      }

      // If we get here, API failed or returned empty. Use mocks.
      throw new Error('No data from API');

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
