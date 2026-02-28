"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { ExternalLink, Lock, Loader2, CheckCircle2, Gift, Sparkles, Link2, Zap, AlertTriangle } from "lucide-react";
import confetti from "canvas-confetti";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { useSession } from "@/components/SessionContext";

interface QuestCardProps {
    questId: string;
    title: string;
    description: string;
    xp: number;
    link: string;
    icon: React.ReactNode;
    index: number;
    daily?: boolean;
    validationType?: "twitter_url" | "xp_gate";
    alreadyCompleted?: boolean;
    onClaimed?: () => void;
    userTwitterHandle?: string;
    userXp?: number;
}

export default function QuestCard({
    questId,
    title,
    description,
    xp,
    link,
    icon,
    index,
    daily,
    validationType,
    alreadyCompleted,
    onClaimed,
    userTwitterHandle,
    userXp,
}: QuestCardProps) {
    const { connected, publicKey } = useWallet();
    const { sessionActive } = useSession();
    const [status, setStatus] = useState<"idle" | "verifying" | "verified" | "claimed">(
        alreadyCompleted ? "claimed" : "idle"
    );
    const [twitterUrl, setTwitterUrl] = useState("");
    const [urlError, setUrlError] = useState("");
    const [claiming, setClaiming] = useState(false);
    const [toastError, setToastError] = useState("");

    // CRITICAL: Sync status when alreadyCompleted changes (async DB load)
    useEffect(() => {
        if (alreadyCompleted) {
            setStatus("claimed");
        }
    }, [alreadyCompleted]);

    // Auto-dismiss toast after 4 seconds
    useEffect(() => {
        if (toastError) {
            const t = setTimeout(() => setToastError(""), 4000);
            return () => clearTimeout(t);
        }
    }, [toastError]);

    const handleStart = useCallback(() => {
        if (!connected) return;

        // For twitter_url validation, show input field
        if (validationType === "twitter_url") {
            setStatus("verifying");
            return;
        }

        // For XP gate, validate before proceeding
        if (validationType === "xp_gate") {
            if ((userXp ?? 0) < 100) {
                setToastError("You need at least 100 XP (Wizard Rank) to claim this!");
                return;
            }
            // XP requirement met — go straight to verified
            setStatus("verified");
            return;
        }

        if (link !== "#" && !link.startsWith("/")) {
            window.open(link, "_blank");
        } else if (link.startsWith("/")) {
            /* internal link — no new tab needed */
        }

        setStatus("verifying");

        if (sessionActive) {
            setStatus("verified");
        } else {
            setTimeout(() => setStatus("verified"), 3000);
        }
    }, [connected, link, sessionActive, validationType, userXp]);

    const handleUrlSubmit = useCallback(() => {
        if (!twitterUrl.trim()) {
            setUrlError("Please paste a link");
            return;
        }
        const urlRegex = /(twitter\.com|x\.com)/i;
        if (!urlRegex.test(twitterUrl)) {
            setUrlError("Must be a twitter.com or x.com link");
            return;
        }

        // Validate that the URL contains the user's twitter handle
        if (userTwitterHandle) {
            const handle = userTwitterHandle.replace("@", "").toLowerCase();
            if (handle && !twitterUrl.toLowerCase().includes(handle)) {
                setUrlError("The link must contain your X username.");
                return;
            }
        }

        setUrlError("");

        if (sessionActive) {
            setStatus("verified");
        } else {
            setStatus("verifying");
            setTimeout(() => setStatus("verified"), 3000);
        }
    }, [twitterUrl, sessionActive, userTwitterHandle]);

    const handleClaim = useCallback(async () => {
        if (!publicKey || !isSupabaseConfigured()) return;

        // Double-check XP gate at claim time
        if (validationType === "xp_gate" && (userXp ?? 0) < 100) {
            setToastError("You need at least 100 XP (Wizard Rank) to claim this!");
            setStatus("idle");
            return;
        }

        setClaiming(true);
        const walletAddress = publicKey.toBase58();

        try {
            // Build insert payload — include submission_data for URL-based quests
            const insertPayload: Record<string, string> = {
                wallet_address: walletAddress,
                quest_id: questId,
            };
            if (validationType === "twitter_url" && twitterUrl.trim()) {
                insertPayload.submission_data = twitterUrl.trim();
            }

            // 1. Insert into user_quests
            const { error: questError } = await supabase
                .from("user_quests")
                .insert(insertPayload);

            if (questError) {
                console.error("Quest record error:", questError);
                if (questError.code === "23505") {
                    setStatus("claimed");
                    return;
                }
            }

            // 2. Call RPC to add XP
            const { error: rpcError } = await supabase
                .rpc("add_xp", { user_wallet: walletAddress, xp_amount: xp });

            if (rpcError) {
                console.error("RPC error:", rpcError);
            }

            // 3. Update UI
            setStatus("claimed");
            onClaimed?.();

            confetti({
                particleCount: 80,
                spread: 60,
                origin: { y: 0.7 },
                colors: ["#AA00FF", "#7700CC", "#DD44FF", "#FFFFFF"],
            });
        } catch (err) {
            console.error("Claim error:", err);
        } finally {
            setClaiming(false);
        }
    }, [publicKey, questId, xp, twitterUrl, validationType, userXp, onClaimed]);

    const isLocked = !connected;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className={`group relative rounded-2xl border transition-all duration-300 ${isLocked
                ? "border-gray-200 dark:border-white/[0.03] bg-gray-50 dark:bg-white/[0.01] opacity-50"
                : status === "claimed"
                    ? "border-[#AA00FF]/20 bg-[#AA00FF]/[0.03]"
                    : "border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:border-[#AA00FF]/20 dark:hover:bg-white/[0.04] hover:shadow-[0_0_40px_rgba(170,0,255,0.08)]"
                }`}
        >
            {/* Daily badge */}
            {daily && (
                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-[#AA00FF]/10 px-2 py-0.5 border border-[#AA00FF]/20">
                    <Zap className="h-2.5 w-2.5 text-[#AA00FF]/60" />
                    <span className="text-[9px] font-mono text-[#AA00FF]/60">DAILY</span>
                </div>
            )}

            {/* Toast error */}
            {toastError && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-3 left-3 right-3 z-10 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-2"
                >
                    <AlertTriangle className="h-3.5 w-3.5 text-red-400 flex-shrink-0" />
                    <span className="text-[10px] font-mono text-red-400">{toastError}</span>
                </motion.div>
            )}

            {!isLocked && status !== "claimed" && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#AA00FF]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            )}

            <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.06] text-gray-500 dark:text-white/50 group-hover:text-[#AA00FF]/70 transition-colors duration-300">
                        {icon}
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.06] px-3 py-1">
                        <Sparkles className="h-3 w-3 text-[#AA00FF]/60" />
                        <span className="font-mono text-[11px] font-medium text-gray-500 dark:text-white/50">{xp} XP</span>
                    </div>
                </div>

                <h3 className="text-sm font-semibold text-gray-900 dark:text-white/90 mb-1.5">{title}</h3>
                <p className="text-xs text-gray-500 dark:text-white/35 leading-relaxed mb-6">{description}</p>

                {isLocked ? (
                    <div className="flex items-center gap-2 text-gray-400 dark:text-white/20">
                        <Lock className="h-3.5 w-3.5" /><span className="font-mono text-[11px]">Connect Wallet</span>
                    </div>
                ) : status === "idle" ? (
                    <button onClick={handleStart} className="flex items-center gap-2 rounded-xl bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.06] px-4 py-2.5 font-mono text-[11px] font-medium text-gray-600 dark:text-white/60 transition-all duration-200 hover:bg-[#AA00FF]/10 hover:border-[#AA00FF]/30 hover:text-[#AA00FF] cursor-pointer">
                        <ExternalLink className="h-3.5 w-3.5" />Start Quest
                    </button>
                ) : status === "verifying" ? (
                    validationType === "twitter_url" ? (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                                    <input
                                        type="url"
                                        value={twitterUrl}
                                        onChange={(e) => { setTwitterUrl(e.target.value); setUrlError(""); }}
                                        placeholder="Paste your x.com / twitter.com link"
                                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-white/80 placeholder:text-white/25 focus:outline-none focus:border-[#AA00FF]/40"
                                    />
                                </div>
                                <button
                                    onClick={handleUrlSubmit}
                                    className="rounded-xl bg-[#AA00FF]/10 border border-[#AA00FF]/25 px-3 py-2 font-mono text-[11px] font-medium text-[#AA00FF] hover:bg-[#AA00FF]/20 cursor-pointer transition-all"
                                >
                                    Verify
                                </button>
                            </div>
                            {urlError && <p className="text-[10px] font-mono text-red-400">{urlError}</p>}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-[#AA00FF]/70">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" /><span className="font-mono text-[11px]">Verifying...</span>
                        </div>
                    )
                ) : status === "verified" ? (
                    <button
                        onClick={handleClaim}
                        disabled={claiming}
                        className="flex items-center gap-2 rounded-xl bg-[#AA00FF]/10 border border-[#AA00FF]/25 px-4 py-2.5 font-mono text-[11px] font-medium text-[#AA00FF] transition-all duration-200 hover:bg-[#AA00FF]/20 hover:shadow-[0_0_20px_rgba(170,0,255,0.2)] cursor-pointer disabled:opacity-50"
                    >
                        {claiming ? (
                            <><Loader2 className="h-3.5 w-3.5 animate-spin" />Claiming...</>
                        ) : (
                            <><Gift className="h-3.5 w-3.5" />Claim {xp} XP</>
                        )}
                    </button>
                ) : (
                    <div className="flex items-center gap-2 text-green-500/80">
                        <CheckCircle2 className="h-3.5 w-3.5" /><span className="font-mono text-[11px]">Claimed</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
