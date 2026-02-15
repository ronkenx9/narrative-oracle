'use client';

import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import idl from '../lib/idl.json';
import { Narrative } from '../lib/solana';

interface NarrativeCardProps {
    narrative: Narrative;
    onUpdate?: () => void;
}

export const NarrativeCard: React.FC<NarrativeCardProps> = ({ narrative, onUpdate }) => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [isStaking, setIsStaking] = useState(false);
    const [amount, setAmount] = useState('0.1');

    const handleStake = async () => {
        if (!publicKey) return alert('Connect wallet to prophesy.');
        setIsStaking(true);

        try {
            const provider = new anchor.AnchorProvider(
                connection,
                { publicKey, signTransaction: (tx: any) => tx, signAllTransactions: (txs: any) => txs } as any,
                { commitment: 'confirmed' }
            );
            const program = new anchor.Program(idl as any, provider) as any;

            const tx = await program.methods
                .validateNarrative(new anchor.BN(parseFloat(amount) * 1e9))
                .accounts({
                    narrative: narrative.publicKey,
                    signer: publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                } as any)
                .transaction();

            const signature = await sendTransaction(tx, connection);
            await connection.confirmTransaction(signature, 'confirmed');

            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Prophecy failed:', error);
            alert('Prophecy failed to register.');
        } finally {
            setIsStaking(false);
        }
    };

    // Calculate confidence pillars (1-10 scale)
    const confidenceLevel = Math.round(narrative.confidenceScore / 10);
    const pillars = Array.from({ length: 10 }, (_, i) => i < confidenceLevel);

    // Mock challenge data for now (program only tracks total stake)
    const totalStaked = narrative.totalStaked / 1e9;
    const validateRatio = 0.85; // Mock: 85% validates

    return (
        <div className="glass group relative overflow-hidden transition-all hover:border-primary/50">
            {/* Marble Texture Overlay */}
            <div className="absolute inset-0 bg-marble-texture opacity-30 pointer-events-none" />

            <div className="relative p-6 z-10">
                {/* Header: Confidence Pillars */}
                <div className="mb-6 flex items-end justify-between">
                    <div className="flex gap-1 h-8 items-end">
                        {pillars.map((filled, i) => (
                            <div
                                key={i}
                                className={`w-1.5 rounded-sm transition-all duration-500 ${filled ? 'bg-primary h-full shadow-[0_0_8px_rgba(212,175,55,0.4)]' : 'bg-border h-2'}`}
                            />
                        ))}
                    </div>
                    <span className="text-2xl font-mono font-bold text-primary">{narrative.confidenceScore}%</span>
                </div>

                {/* Title */}
                <h3 className="mb-2 text-xl font-bold leading-tight text-text-primary group-hover:text-primary-light transition-colors">
                    {narrative.metadataUrl}
                </h3>

                <div className="mb-6 text-xs text-text-muted flex gap-2">
                    <span className="uppercase tracking-wider">Oracle ID:</span>
                    <span className="font-mono text-secondary-light">{narrative.publicKey.toBase58().slice(0, 8)}</span>
                </div>

                {/* Prediction Market Bar */}
                <div className="mb-6">
                    <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest mb-2">
                        <span className="text-validates flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-validates" /> Validates
                        </span>
                        <span className="text-challenges flex items-center gap-1">
                            Challenges <span className="w-2 h-2 rounded-full bg-challenges" />
                        </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-surface-elevated overflow-hidden flex">
                        <div style={{ width: `${validateRatio * 100}%` }} className="bg-validates h-full" />
                        <div style={{ width: `${(1 - validateRatio) * 100}%` }} className="bg-challenges h-full" />
                    </div>
                    <div className="mt-2 text-right text-xs font-mono text-text-muted">
                        Total Market: {totalStaked.toFixed(2)} SOL
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 p-3 bg-surface-elevated/50 rounded-temple border border-border/50">
                    <div className="flex-1 flex items-center bg-surface rounded-lg px-3 border border-border focus-within:border-primary/50 transition-colors">
                        <span className="text-xs text-primary font-mono mr-2">SOL</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-transparent text-sm py-2 focus:outline-none font-mono"
                            step="0.1"
                        />
                    </div>
                    <button
                        onClick={handleStake}
                        disabled={isStaking}
                        className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg text-sm font-bold tracking-wide uppercase transition-all disabled:opacity-50 hover:shadow-oracle"
                    >
                        {isStaking ? '...' : 'Stake'}
                    </button>
                </div>
            </div>

            {/* Prophecy Flame Footer */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
};
