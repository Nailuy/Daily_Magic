"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export interface UserData {
    wallet_address: string;
    username: string | null;
    twitter_handle: string | null;
    discord_handle: string | null;
    xp: number;
    rank: string;
}

export interface UseUserReturn {
    user: UserData | null;
    xp: number;
    rank: string;
    completedQuests: Set<string>;
    loading: boolean;
    needsProfile: boolean;
    refreshUser: () => Promise<void>;
    updateProfile: (username: string, twitter: string, discord: string) => Promise<void>;
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
                // User does not exist — insert with wallet_address ONLY
                const { data: newUser, error: insertError } = await supabase
                    .from("users")
                    .insert({ wallet_address: walletAddress })
                    .select()
                    .single();

                if (insertError) {
                    console.error("Error creating user:", insertError);
                } else {
                    setUser(newUser);
                }
            } else if (existing) {
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

    const updateProfile = useCallback(async (username: string, twitter: string, discord: string) => {
        if (!walletAddress || !isSupabaseConfigured()) return;

        try {
            const { error } = await supabase
                .from("users")
                .update({
                    username: username || null,
                    twitter_handle: twitter || null,
                    discord_handle: discord || null,
                })
                .eq("wallet_address", walletAddress);

            if (error) {
                console.error("Error updating profile:", error);
                return;
            }

            // Sync to localStorage for sidebar avatar
            localStorage.setItem("dm_display_name", username);
            localStorage.setItem("dm_twitter_handle", twitter.replace("@", ""));
            localStorage.setItem("dm_discord_handle", discord);
            window.dispatchEvent(new Event("dm_profile_updated"));

            // Refresh user data
            await fetchUser();
        } catch (err) {
            console.error("Profile update error:", err);
        }
    }, [walletAddress, fetchUser]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const xp = user?.xp || 0;
    const rankInfo = getRankForXp(xp);
    const needsProfile = connected && !!user && !user.username;

    return {
        user,
        xp,
        rank: rankInfo.name,
        completedQuests,
        loading,
        needsProfile,
        refreshUser: fetchUser,
        updateProfile,
    };
}
