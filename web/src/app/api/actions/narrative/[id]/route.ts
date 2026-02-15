import { NextResponse } from 'next/server';
import {
    ActionGetResponse,
    ActionPostRequest,
    ActionPostResponse,
    createActionHeaders,
    createPostResponse,
} from "@solana/actions";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import idl from "@/lib/idl.json";
import { getAllNarratives } from "@/lib/solana";

const headers = createActionHeaders();

export const GET = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;

        // In a real app, fetch specific narrative by ID. For MVP, we scan all.
        // This is inefficient but functional for the hackathon demo.
        const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
        const connection = new Connection(rpcUrl, 'confirmed');
        const narratives = await getAllNarratives(connection);
        const narrative = narratives.find(n => n.publicKey.toBase58() === id);

        if (!narrative) {
            return new Response("Narrative not found", { status: 404, headers });
        }

        const payload: ActionGetResponse = {
            icon: new URL("/oracle-eye.png", new URL(req.url).origin).toString(), // Using a placeholder for now
            title: `Narrative Oracle: ${narrative.metadataUrl}`,
            description: `Confidence Score: ${narrative.confidenceScore}% | Total Market: ${(narrative.totalStaked / 1e9).toFixed(2)} SOL. Stake on the truth.`,
            label: "Stake",
            links: {
                actions: [
                    {
                        label: "Validate (0.1 SOL)",
                        href: `/api/actions/narrative/${id}?action=validate&amount=0.1`,
                        type: "transaction"
                    },
                    {
                        label: "Challenge (0.1 SOL)",
                        href: `/api/actions/narrative/${id}?action=challenge&amount=0.1`,
                        type: "transaction"
                    },
                ],
            },
        };

        return NextResponse.json(payload, { headers });
    } catch (err) {
        console.log(err);
        return new Response("Internal error", { status: 500, headers });
    }
};

export const OPTIONS = async (req: Request) => {
    return new Response(null, { headers });
};

export const POST = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;
        const url = new URL(req.url);
        const amount = parseFloat(url.searchParams.get("amount") || "0.1");
        // const action = url.searchParams.get("action") || "validate"; // Can use this to differentiate logic

        const body: ActionPostRequest = await req.json();

        // Validate account
        let account: PublicKey;
        try {
            account = new PublicKey(body.account);
        } catch (err) {
            return new Response('Invalid "account" provided', {
                status: 400,
                headers,
            });
        }

        const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
        const connection = new Connection(rpcUrl, 'confirmed');

        // Build Protocol Transaction
        const provider = new anchor.AnchorProvider(
            connection,
            { publicKey: account } as any,
            { commitment: 'confirmed' }
        );
        const program = new anchor.Program(idl as any, provider) as any;

        // We only have 'validateNarrative' in the contract for now, so we map both actions to it
        // In a full 10/10, we would have a separate 'challengeNarrative' instruction
        const ix = await program.methods
            .validateNarrative(new anchor.BN(amount * 1e9))
            .accounts({
                narrative: new PublicKey(id),
                signer: account,
                systemProgram: anchor.web3.SystemProgram.programId,
            } as any)
            .instruction();

        const tx = new Transaction();
        tx.add(ix);
        tx.feePayer = account;

        // Get latest blockhash
        const { blockhash } = await connection.getLatestBlockhash();
        tx.recentBlockhash = blockhash;

        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                transaction: tx,
                message: `Staked ${amount} SOL on Narrative Oracle.`,
                type: 'transaction',
            },
        });

        return NextResponse.json(payload, { headers });
    } catch (err) {
        console.log(err);
        return new Response("Internal error", { status: 500, headers });
    }
};
