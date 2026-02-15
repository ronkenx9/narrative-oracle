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
        if (!publicKey) return alert('Please connect your wallet!');
        setIsStaking(true);

        try {
            const provider = new anchor.AnchorProvider(
                connection,
                { publicKey, signTransaction: (tx: any) => tx, signAllTransactions: (txs: any) => txs } as any,
                { commitment: 'confirmed' }
            );
            const program = new anchor.Program(idl as any, provider);

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

            alert('Staking successful!');
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Staking failed:', error);
            alert('Staking failed. See console for details.');
        } finally {
            setIsStaking(false);
        }
    };

    return (
        <div className="glass group p-6 transition-all hover:border-accent-primary/50 hover:bg-white/5">
            <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Confidence</span>
                <span className="text-sm font-mono text-accent-secondary">{narrative.confidenceScore}%</span>
            </div>
            <h3 className="mb-3 text-xl font-bold leading-tight group-hover:text-accent-primary transition-colors">
                {narrative.metadataUrl}
            </h3>
            <div className="mb-6">
                <div className="text-xs text-zinc-500 mb-1">Total Staked</div>
                <div className="text-lg font-mono">{(narrative.totalStaked / 1e9).toFixed(2)} SOL</div>
            </div>

            <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-primary"
                        step="0.05"
                        min="0.01"
                    />
                    <button
                        onClick={handleStake}
                        disabled={isStaking}
                        className="glass px-4 py-2 text-sm font-bold hover:bg-accent-primary hover:text-white transition-all disabled:opacity-50"
                    >
                        {isStaking ? 'STAKING...' : 'STAKE'}
                    </button>
                </div>
                <div className="text-[10px] text-zinc-600 uppercase tracking-tighter">
                    Author: {narrative.author.toBase58().slice(0, 4)}...{narrative.author.toBase58().slice(-4)}
                </div>
            </div>
        </div>
    );
};
