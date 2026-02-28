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
    referral_code: string | null;
    referred_by: string | null;
}

export interface UseUserReturn {
    user: UserData | null;
    xp: number;
    rank: string;
    completedQuests: Set<string>;
    loading: boolean;
    needsProfile: boolean;
    refreshUser: () => Promise<void>;
    updateProfile: (username: string, twitter: string, discord: string, referredBy?: string) => Promise<void>;
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

/** Generate a unique referral code from username */
function generateReferralCode(username: string): string {
    const base = username.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8);
    const rand = Math.random().toString(36).substring(2, 6);
    return `${base}_${rand}`;
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
            const { data: existing, error: fetchError } = await supabase
                .from("users")
                .select("*")
                .eq("wallet_address", walletAddress)
                .single();

            if (fetchError && fetchError.code === "PGRST116") {
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

    const updateProfile = useCallback(async (username: string, twitter: string, discord: string, referredBy?: string) => {
        if (!walletAddress || !isSupabaseConfigured()) return;

        try {
            // Generate referral code for the user
            const refCode = generateReferralCode(username);

            const updatePayload: Record<string, string | null> = {
                username: username || null,
                twitter_handle: twitter || null,
                discord_handle: discord || null,
                referral_code: refCode,
            };

            // Only set referred_by if provided and user doesn't already have one
            if (referredBy && referredBy.trim()) {
                updatePayload.referred_by = referredBy.trim();
            }

            const { error } = await supabase
                .from("users")
                .update(updatePayload)
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
