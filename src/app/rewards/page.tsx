"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Sparkles, User } from "lucide-react";
import { useUser, getRankForXp } from "@/hooks/useUser";

interface RankVisual {
    gradient: string;
    borderColor: string;
    glowColor: string;
    bgAccent: string;
    textColor: string;
}

function getRankVisual(rank: string): RankVisual {
    switch (rank) {
        case "Adept":
            return {
                gradient: "from-purple-400 via-purple-200 to-purple-500",
                borderColor: "border-purple-400/40",
                glowColor: "shadow-[0_0_40px_rgba(170,0,255,0.3)]",
                bgAccent: "bg-purple-400/10",
                textColor: "text-purple-400",
            };
        case "Sorcerer":
            return {
                gradient: "from-gray-300 via-gray-100 to-gray-400",
                borderColor: "border-gray-300",
                glowColor: "shadow-[0_0_40px_rgba(192,192,192,0.3)]",
                bgAccent: "bg-gray-200/10",
                textColor: "text-gray-300",
            };
        case "Apprentice":
            return {
                gradient: "from-amber-700 via-amber-500 to-amber-700",
                borderColor: "border-amber-600/30",
                glowColor: "shadow-[0_0_40px_rgba(217,119,6,0.2)]",
                bgAccent: "bg-amber-500/10",
                textColor: "text-amber-500",
            };
        case "Magician":
            return {
                gradient: "from-cyan-600 via-cyan-400 to-cyan-600",
                borderColor: "border-cyan-500/30",
                glowColor: "shadow-[0_0_40px_rgba(6,182,212,0.2)]",
                bgAccent: "bg-cyan-500/10",
                textColor: "text-cyan-400",
            };
        case "Wizard":
            return {
                gradient: "from-green-600 via-green-400 to-green-600",
                borderColor: "border-green-500/30",
                glowColor: "shadow-[0_0_30px_rgba(34,197,94,0.15)]",
                bgAccent: "bg-green-500/10",
                textColor: "text-green-400",
            };
        default:
            return {
                gradient: "from-gray-600 via-gray-400 to-gray-600",
                borderColor: "border-gray-500/20",
                glowColor: "",
                bgAccent: "bg-gray-500/10",
                textColor: "text-gray-400",
            };
    }
}

export default function RewardsPage() {
    const { xp, rank, loading } = useUser();
    const rankInfo = getRankForXp(xp);
    const visual = getRankVisual(rank);

    const [displayName, setDisplayName] = useState("");
    const [twitterHandle, setTwitterHandle] = useState("");

    useEffect(() => {
        setDisplayName(localStorage.getItem("dm_display_name") || "");
        setTwitterHandle(localStorage.getItem("dm_twitter_handle") || "");

        const handler = () => {
            setDisplayName(localStorage.getItem("dm_display_name") || "");
            setTwitterHandle(localStorage.getItem("dm_twitter_handle") || "");
        };
        window.addEventListener("dm_profile_updated", handler);
        return () => window.removeEventListener("dm_profile_updated", handler);
    }, []);

    const userName = displayName || (twitterHandle ? `@${twitterHandle}` : "Mage");
    const nextRankXp = rankInfo.nextThreshold;
    const progress = nextRankXp
        ? (((xp - rankInfo.threshold) / (nextRankXp - rankInfo.threshold)) * 100).toFixed(0)
        : 100;

    return (
        <>
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-10"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-[#AA00FF]/50 to-transparent" />
                    <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#AA00FF]/60">
                        Progression
                    </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                    Rewards
                </h1>
                <p className="text-sm text-gray-500 dark:text-white/35 max-w-xl">
                    Track your XP, unlock ranks, and generate your Mage Certificate.
                </p>
            </motion.div>

            {/* XP Overview */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
            >
                <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-[#AA00FF]/60" />
                        <span className="text-xs font-mono text-gray-400 dark:text-white/40 uppercase tracking-wider">
                            Total XP
                        </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white font-mono">
                        {loading ? "..." : xp}
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Trophy className="h-4 w-4 text-[#AA00FF]/60" />
                        <span className="text-xs font-mono text-gray-400 dark:text-white/40 uppercase tracking-wider">
                            Mage Rank
                        </span>
                    </div>
                    <p className={`text-2xl font-bold ${visual.textColor}`}>
                        {loading ? "..." : rank}
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono text-gray-400 dark:text-white/40 uppercase tracking-wider">
                            Next Rank
                        </span>
                    </div>
                    {nextRankXp ? (
                        <>
                            <p className="text-sm font-mono text-gray-600 dark:text-white/60 mb-2">
                                {xp} / {nextRankXp} XP
                            </p>
                            <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-white/5 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-full rounded-full bg-gradient-to-r from-[#AA00FF] to-[#DD44FF]"
                                />
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-white/40">
                            Max rank achieved
                        </p>
                    )}
                </div>
            </motion.div>

            {/* Certificate Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-sm font-semibold text-gray-600 dark:text-white/60">
                        Mage Certificate
                    </h2>
                    <div className="h-px flex-1 bg-gray-200 dark:bg-white/5" />
                </div>

                {/* Certificate Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="flex justify-center"
                >
                    <div
                        className={`relative w-full max-w-lg rounded-3xl border-2 ${visual.borderColor} ${visual.glowColor} overflow-hidden`}
                    >
                        {/* Certificate Background */}
                        <div className="absolute inset-0 bg-gray-50 dark:bg-[#0a0a0a]" />
                        <div
                            className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-r ${visual.gradient} opacity-10`}
                        />
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                        {/* Certificate Content */}
                        <div className="relative p-8 md:p-10 text-center">
                            {/* Badge */}
                            <div className="flex justify-center mb-6">
                                <div
                                    className={`h-20 w-20 rounded-full ${visual.bgAccent} border-2 ${visual.borderColor} flex items-center justify-center overflow-hidden`}
                                >
                                    {twitterHandle ? (
                                        <img
                                            src={`https://unavatar.io/twitter/${twitterHandle}`}
                                            alt={userName}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <User className="h-8 w-8 text-gray-400 dark:text-white/30" />
                                    )}
                                </div>
                            </div>

                            {/* Title */}
                            <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-gray-400 dark:text-white/30 mb-2">
                                Certificate of Achievement
                            </p>

                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                {userName}
                            </h3>

                            <p className={`text-lg font-semibold ${visual.textColor} mb-4`}>
                                {rank} Mage
                            </p>

                            <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2 mb-6">
                                <Sparkles className="h-3.5 w-3.5 text-[#AA00FF]/60" />
                                <span className="font-mono text-sm text-gray-600 dark:text-white/60">
                                    {xp} XP Earned
                                </span>
                            </div>

                            <div className="border-t border-gray-200 dark:border-white/5 pt-4">
                                <p className="text-[10px] font-mono text-gray-400 dark:text-white/20 tracking-wider">
                                    DAILY MAGIC &mdash; MAGIC BLOCK L2 COMMUNITY
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
}
