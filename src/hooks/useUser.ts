"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

interface UserData {
    wallet_address: string;
    xp: number;
    rank: string;
    referral_code: string;
    created_at: string;
}

interface UseUserReturn {
    user: UserData | null;
    xp: number;
    rank: string;
    completedQuests: Set<string>;
    loading: boolean;
    refreshUser: () => Promise<void>;
}

const RANKS = [
    { name: "Verified Human", threshold: 0 },
    { name: "Wizard", threshold: 100 },
    { name: "Magician", threshold: 400 },
    { name: "Apprentice", threshold: 800 },
    { name: "Sorcerer", threshold: 1200 },
    { name: "Adept", threshold: 2000 },
];

export function getRankForXp(xp: number): { name: string; threshold: number; nextThreshold: number | null } {
    let current = RANKS[0];
    for (const r of RANKS) {
        if (xp >= r.threshold) current = r;
    }
    const idx = RANKS.indexOf(current);
    const next = idx < RANKS.length - 1 ? RANKS[idx + 1].threshold : null;
    return { name: current.name, threshold: current.threshold, nextThreshold: next };
}

export function useUser(): UseUserReturn {
    const { publicKey, connected } = useWallet();
    const [user, setUser] = useState<UserData | null>(null);
    const [completedQuests, setCompletedQuests] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);

    const walletAddress = publicKey?.toBase58() || null;

    const fetchUser = useCallback(async () => {
        if (!walletAddress || !isSupabaseConfigured()) {
            setUser(null);
            setCompletedQuests(new Set());
            return;
        }

        setLoading(true);
        try {
            // Check if user exists
            const { data: existing, error: fetchError } = await supabase
                .from("users")
                .select("*")
                .eq("wallet_address", walletAddress)
                .single();

            if (fetchError && fetchError.code === "PGRST116") {
                // User does not exist — insert
                const refCode = Math.random().toString(36).substring(2, 10);
                const { data: newUser, error: insertError } = await supabase
                    .from("users")
                    .insert({ wallet_address: walletAddress, xp: 0, rank: "Verified Human", referral_code: refCode })
                    .select()
                    .single();

                if (insertError) {
                    console.error("Error creating user:", insertError);
                } else {
                    setUser(newUser);
                    // Handle referral
                    handleReferral(walletAddress);
                }
            } else if (existing) {
                // Update rank based on XP
                const rankInfo = getRankForXp(existing.xp);
                if (existing.rank !== rankInfo.name) {
                    await supabase.from("users").update({ rank: rankInfo.name }).eq("wallet_address", walletAddress);
                    existing.rank = rankInfo.name;
                }
                setUser(existing);
            }

            // Fetch completed quests
            const { data: quests } = await supabase
                .from("user_quests")
                .select("quest_id")
                .eq("wallet_address", walletAddress);

            if (quests) {
                setCompletedQuests(new Set(quests.map((q) => q.quest_id)));
            }
        } catch (err) {
            console.error("Error in useUser:", err);
        } finally {
            setLoading(false);
        }
    }, [walletAddress]);

    // Handle referral from URL param
    const handleReferral = async (newUserWallet: string) => {
        if (typeof window === "undefined") return;
        const params = new URLSearchParams(window.location.search);
        const refCode = params.get("ref");
        if (!refCode) return;

        try {
            // Find the referrer
            const { data: referrer } = await supabase
                .from("users")
                .select("wallet_address")
                .eq("referral_code", refCode)
                .single();

            if (referrer && referrer.wallet_address !== newUserWallet) {
                // Award referral XP to the referrer
                await supabase.rpc("add_xp", { user_wallet: referrer.wallet_address, xp_amount: 50 });
            }
        } catch (err) {
            console.error("Referral error:", err);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const xp = user?.xp || 0;
    const rankInfo = getRankForXp(xp);

    return {
        user,
        xp,
        rank: rankInfo.name,
        completedQuests,
        loading,
        refreshUser: fetchUser,
    };
}
