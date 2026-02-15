import Link from "next/link";

const narratives = [
  {
    id: 1,
    title: "The Solana Sovereign Agent Era",
    confidence: 94,
    signals: 12,
    context: "Emerging trend of independent on-chain agents managing protocol treasury via OEV capture.",
    tags: ["On-Chain AI", "Treasury", "Gov"]
  },
  {
    id: 2,
    title: "Liquid Restaking Pivot",
    confidence: 81,
    signals: 8,
    context: "Massive liquidity shift towards Jito-style restaking frameworks for secondary yield.",
    tags: ["DeFi", "LRT", "Restaking"]
  },
  {
    id: 3,
    title: "Hyper-Personalized Social Trading",
    confidence: 76,
    signals: 15,
    context: "Social clustering suggests a move from copy-trading to intent-based personal agents.",
    tags: ["SocialFi", "Intents"]
  }
async function getNarratives() {
    const res = await fetch('http://localhost:3000/api/narratives', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  }

export default async function Home() {
  const narratives: any[] = await getNarratives();
  return (
    <div className="relative min-h-screen">
      <div className="bg-glow" />

      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between glass px-6 py-3">
          <div className="text-xl font-bold tracking-tighter">
            <span className="gradient-text">NARRATIVE</span> ORACLE
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="#" className="hover:text-accent-secondary transition-colors">Signals</Link>
            <Link href="#" className="hover:text-accent-secondary transition-colors">Predictions</Link>
            <Link href="#" className="glass px-4 py-2 hover:bg-white/10 transition-colors">Connect Wallet</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-6 pt-32 pb-20">
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

        {/* Narrative Grid */}
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {narratives.map((n) => (
            <div key={n.id} className="glass group p-6 transition-all hover:border-accent-primary/50 hover:bg-white/5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Confidence</span>
                <span className="text-sm font-mono text-accent-secondary">{n.confidence}%</span>
              </div>
              <h3 className="mb-3 text-xl font-bold leading-tight group-hover:text-accent-primary transition-colors">
                {n.title}
              </h3>
              <p className="mb-6 text-sm text-zinc-400 leading-relaxed">
                {n.context}
              </p>
              <div className="flex flex-wrap gap-2">
                {n.tags.map(tag => (
                  <span key={tag} className="bg-white/5 border border-white/5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer / Stats */}
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
