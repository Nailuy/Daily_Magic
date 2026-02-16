"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Crown, Medal, Award, User } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { useWallet } from "@solana/wallet-adapter-react";

interface LeaderboardEntry {
    wallet_address: string;
    username: string | null;
    twitter_handle: string | null;
    xp: number;
    rank: string;
}

function truncateWallet(addr: string): string {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

function getRankIcon(position: number) {
    if (position === 0) return <Crown className="h-3.5 w-3.5 text-amber-400" />;
    if (position === 1) return <Medal className="h-3.5 w-3.5 text-gray-300" />;
    if (position === 2) return <Medal className="h-3.5 w-3.5 text-amber-600" />;
    return <span className="text-[10px] font-mono text-white/25 w-3.5 text-center">{position + 1}</span>;
}

export default function Leaderboard() {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const { publicKey } = useWallet();

    const currentWallet = publicKey?.toBase58() || null;

    useEffect(() => {
        async function fetchLeaderboard() {
            if (!isSupabaseConfigured()) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("users")
                .select("wallet_address, username, twitter_handle, xp, rank")
                .order("xp", { ascending: false })
                .limit(50);

            if (!error && data) {
                setEntries(data);
            }
            setLoading(false);
        }

        fetchLeaderboard();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
        >
            <div className="flex items-center gap-3 p-5 border-b border-white/[0.04]">
                <Trophy className="h-4 w-4 text-[#AA00FF]/60" />
                <h2 className="text-sm font-semibold text-white/60">Leaderboard</h2>
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-[10px] font-mono text-white/20">TOP 50</span>
            </div>

            {loading ? (
                <div className="p-8 text-center">
                    <span className="text-xs font-mono text-white/25">Loading...</span>
                </div>
            ) : entries.length === 0 ? (
                <div className="p-8 text-center">
                    <span className="text-xs font-mono text-white/25">No users yet</span>
                </div>
            ) : (
                <div className="divide-y divide-white/[0.03]">
                    {entries.map((entry, i) => {
                        const isCurrentUser = entry.wallet_address === currentWallet;
                        return (
                            <motion.div
                                key={entry.wallet_address}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.03, duration: 0.3 }}
                                className={`flex items-center gap-3 px-5 py-3 transition-colors ${isCurrentUser
                                        ? "bg-[#AA00FF]/[0.04] border-l-2 border-[#AA00FF]/30"
                                        : "hover:bg-white/[0.01]"
                                    }`}
                            >
                                {/* Position */}
                                <div className="w-6 flex justify-center flex-shrink-0">
                                    {getRankIcon(i)}
                                </div>

                                {/* Avatar */}
                                <div className="h-7 w-7 rounded-full overflow-hidden bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                                    {entry.twitter_handle ? (
                                        <img
                                            src={`https://unavatar.io/twitter/${entry.twitter_handle}`}
                                            alt=""
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = "none";
                                            }}
                                        />
                                    ) : (
                                        <User className="h-3.5 w-3.5 text-white/20" />
                                    )}
                                </div>

                                {/* Name */}
                                <div className="flex-1 min-w-0">
                                    <p className={`text-xs font-medium truncate ${isCurrentUser ? "text-[#AA00FF]" : "text-white/70"
                                        }`}>
                                        {entry.username || truncateWallet(entry.wallet_address)}
                                        {isCurrentUser && (
                                            <span className="ml-1.5 text-[9px] font-mono text-[#AA00FF]/50">(you)</span>
                                        )}
                                    </p>
                                </div>

                                {/* Rank */}
                                <span className="text-[9px] font-mono text-white/25 hidden sm:block">
                                    {entry.rank || "—"}
                                </span>

                                {/* XP */}
                                <span className="text-[11px] font-mono font-medium text-white/40 tabular-nums">
                                    {entry.xp.toLocaleString()} XP
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
}
