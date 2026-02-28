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

/** Generate a random 8-character uppercase alphanumeric string */
function generateRandomCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

/** Save a referral code with retry on unique constraint collision */
async function saveReferralCodeWithRetry(walletAddress: string, maxRetries = 5): Promise<string | null> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        const code = generateRandomCode();
        const { error } = await supabase
            .from("users")
            .update({ referral_code: code })
            .eq("wallet_address", walletAddress);

        if (!error) {
            return code;
        }

        // 23505 = unique constraint violation -> retry with new code
        if (error.code === "23505") {
            console.warn(`Referral code collision (${code}), retrying... (${attempt + 1}/${maxRetries})`);
            continue;
        }

        // Other error -> abort
        console.error("Error saving referral code:", error);
        return null;
    }

    console.error("Failed to generate unique referral code after max retries");
    return null;
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
        const USER_COLS = "wallet_address, username, twitter_handle, discord_handle, xp, rank, referral_code, referred_by";

        try {
            let { data: existing, error: fetchError } = await supabase
                .from("users")
                .select(USER_COLS)
                .eq("wallet_address", walletAddress)
                .single();

            if (fetchError && fetchError.code === "PGRST116") {
                // User does not exist — insert with wallet_address ONLY
                const { data: newUser, error: insertError } = await supabase
                    .from("users")
                    .insert({ wallet_address: walletAddress })
                    .select(USER_COLS)
                    .single();

                if (insertError) {
                    console.error("Error creating user:", insertError);
                } else if (newUser) {
                    // Auto-assign referral code to new user
                    if (!newUser.referral_code) {
                        await saveReferralCodeWithRetry(walletAddress);
                        // Re-fetch to get the fresh row with the saved code
                        const { data: refreshed } = await supabase
                            .from("users")
                            .select(USER_COLS)
                            .eq("wallet_address", walletAddress)
                            .single();
                        setUser(refreshed ?? newUser);
                    } else {
                        setUser(newUser);
                    }
                }
            } else if (existing) {
                // Auto-patch existing user who has NULL referral_code
                if (!existing.referral_code) {
                    await saveReferralCodeWithRetry(walletAddress);
                    // Re-fetch to get the fresh row with the saved code
                    const { data: refreshed } = await supabase
                        .from("users")
                        .select(USER_COLS)
                        .eq("wallet_address", walletAddress)
                        .single();
                    setUser(refreshed ?? existing);
                } else {
                    setUser(existing);
                }
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

    const updateProfile = useCallback(async (username: string, twitter: string, discord: string, referredBy?: string) => {
        if (!walletAddress || !isSupabaseConfigured()) return;

        try {
            const updatePayload: Record<string, string | null> = {
                username: username || null,
                twitter_handle: twitter || null,
                discord_handle: discord || null,
            };

            // Only set referred_by if provided and user doesn't already have one
            if (referredBy && referredBy.trim() && (!user || !user.referred_by)) {
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
    }, [walletAddress, fetchUser, user]);

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
