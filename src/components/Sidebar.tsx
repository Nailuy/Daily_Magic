"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Trophy,
    Zap,
    BookOpen,
    Settings,
    User,
    Sparkles,
    Shield,
} from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, getRankForXp } from "@/hooks/useUser";

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Trophy, label: "Quests", href: "/quests" },
    { icon: Zap, label: "Rewards", href: "/rewards" },
    { icon: BookOpen, label: "Learn", href: "/learn" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { connected } = useWallet();
    const { xp, rank, loading } = useUser();
    const [displayName, setDisplayName] = useState("");
    const [twitterHandle, setTwitterHandle] = useState("");

    // Read profile display data from localStorage (names only)
    useEffect(() => {
        const loadProfile = () => {
            setDisplayName(localStorage.getItem("dm_display_name") || "");
            setTwitterHandle(localStorage.getItem("dm_twitter_handle") || "");
        };

        loadProfile();

        const handleStorage = (e: StorageEvent) => {
            if (e.key === "dm_display_name" || e.key === "dm_twitter_handle") {
                loadProfile();
            }
        };
        const handleCustom = () => loadProfile();
        window.addEventListener("storage", handleStorage);
        window.addEventListener("dm_profile_updated", handleCustom);
        return () => {
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("dm_profile_updated", handleCustom);
        };
    }, []);

    const userName = displayName || (twitterHandle ? `@${twitterHandle}` : "");

    return (
        <aside className="hidden md:flex w-72 flex-col border-r border-gray-200 dark:border-white/5 bg-gray-50/80 dark:bg-[#080808]/50 backdrop-blur-xl">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200 dark:border-white/5">
                <Image
                    src="/MagicBlock-Logomark-White.png"
                    alt="Magic Block"
                    width={32}
                    height={32}
                    className="rounded-lg dark:invert-0 invert"
                />
                <div>
                    <h1 className="text-sm font-bold tracking-wide text-gray-900 dark:text-white">
                        DAILY MAGIC
                    </h1>
                    <p className="text-[10px] font-mono tracking-[0.2em] text-gray-400 dark:text-white/30 uppercase">
                        by Magic Block
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item, i) => {
                    const isActive = pathname === item.href;
                    return (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.3 }}
                        >
                            <Link
                                href={item.href}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? "bg-gray-200/60 dark:bg-white/5 text-gray-900 dark:text-white border border-gray-200 dark:border-white/5"
                                    : "text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/70 hover:bg-gray-100 dark:hover:bg-white/[0.02] border border-transparent"
                                    }`}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                                {isActive && (
                                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[#AA00FF]" />
                                )}
                            </Link>
                        </motion.div>
                    );
                })}
            </nav>

            {/* Bottom: User Profile Widget */}
            <div className="mt-auto border-t border-gray-200 dark:border-white/5 p-4">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center flex-shrink-0">
                        {twitterHandle ? (
                            <img
                                src={`https://unavatar.io/twitter/${twitterHandle}`}
                                alt={twitterHandle}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                }}
                            />
                        ) : (
                            <User className="h-5 w-5 text-gray-400 dark:text-white/30" />
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white/90 truncate">
                            {connected
                                ? userName || "Connected"
                                : "Guest"}
                        </p>
                        <div className="flex items-center gap-1.5">
                            {connected ? (
                                <>
                                    <Shield className="h-3 w-3 text-[#AA00FF]/70" />
                                    <span className="text-[11px] font-mono text-gray-500 dark:text-white/40">
                                        {loading ? "..." : `${rank} · ${xp} XP`}
                                    </span>
                                </>
                            ) : (
                                <span className="text-[11px] text-gray-400 dark:text-white/30">
                                    Connect wallet to begin
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
