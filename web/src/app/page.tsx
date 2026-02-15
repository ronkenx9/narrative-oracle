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

      <nav className="fixed top-0 z-50 w-full px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between glass px-6 py-3">
          <div className="text-xl font-bold tracking-tighter">
            <span className="gradient-text">NARRATIVE</span> ORACLE
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="#" className="hover:text-accent-secondary transition-colors">Signals</Link>
            <Link href="#" className="hover:text-accent-secondary transition-colors">Predictions</Link>
            {mounted && <WalletMultiButton className="!bg-white/5 !border !border-white/10 !rounded-xl !h-10 !text-sm hover:!bg-white/10" />}
          </div>
        </div>
      </nav>

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
    </div>
  );
}
