'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const OracleHeader = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'py-2 bg-background/80 backdrop-blur-md border-b border-border' : 'py-6 bg-transparent'}`}>
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-full border border-primary/30 bg-surface-elevated shadow-oracle group cursor-pointer overflow-hidden">
                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="text-xl text-primary animate-pulse-slow">◉</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold tracking-widest text-text-primary leading-none">
                            NARRATIVE
                        </span>
                        <span className="text-xs font-mono text-primary tracking-[0.3em] uppercase leading-none mt-1">
                            ORACLE
                        </span>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <Link href="#" className="text-text-secondary hover:text-primary transition-colors uppercase tracking-wider text-xs">
                        Prophecies
                    </Link>
                    <Link href="#" className="text-text-secondary hover:text-primary transition-colors uppercase tracking-wider text-xs">
                        Council
                    </Link>
                    <Link href="#" className="text-text-secondary hover:text-primary transition-colors uppercase tracking-wider text-xs">
                        Proof
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {mounted && (
                        <div className="wallet-adapter-dropdown">
                            <WalletMultiButton className="!bg-surface-elevated !border !border-primary/30 !rounded-temple !h-10 !text-sm !font-mono !text-primary hover:!bg-primary/10 hover:!border-primary transition-all !px-6" />
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};
