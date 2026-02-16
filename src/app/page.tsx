"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Twitter, Sparkles, TrendingUp, Award } from "lucide-react";
import SecurityModal from "@/components/SecurityModal";
import { useUser, getRankForXp } from "@/hooks/useUser";

export default function DashboardPage() {
  const { xp, rank, loading } = useUser();
  const rankInfo = getRankForXp(xp);
  const progress = rankInfo.nextThreshold
    ? ((xp - rankInfo.threshold) / (rankInfo.nextThreshold - rankInfo.threshold)) * 100
    : 100;

  const timelineRef = useRef<HTMLDivElement>(null);

  // Load Twitter embed widget
  useEffect(() => {
    const container = timelineRef.current;
    if (!container) return;

    // Create the timeline link anchor
    const anchor = document.createElement("a");
    anchor.className = "twitter-timeline";
    anchor.setAttribute("data-theme", "dark");
    anchor.setAttribute("data-chrome", "noheader nofooter noborders transparent");
    anchor.setAttribute("data-height", "600");
    anchor.href = "https://twitter.com/MagicBlock";
    anchor.textContent = "Tweets by MagicBlock";
    container.innerHTML = "";
    container.appendChild(anchor);

    // Load Twitter widgets.js
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <>
      <SecurityModal />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="mb-10 md:mb-14"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-[#AA00FF]/50 to-transparent" />
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#AA00FF]/60">
            Magic Block L2
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
          Daily{" "}
          <span className="text-gradient-light dark:text-gradient">Magic</span>
        </h1>

        <p className="text-sm md:text-base text-gray-500 dark:text-white/35 max-w-2xl leading-relaxed">
          Magic Block is building the fastest Solana L2 with{" "}
          <span className="text-[#AA00FF] font-medium">Ephemeral Rollups</span>{" "}
          — app-specific, real-time execution environments that spin up on
          demand. Complete quests, learn about the tech, and earn your Mage rank.
        </p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center gap-6 mt-6"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#AA00FF]/60" />
            <span className="text-xs text-gray-400 dark:text-white/30">
              Real-time on-chain gaming
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-400/60" />
            <span className="text-xs text-gray-400 dark:text-white/30">
              Mainnet Live
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Rank Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Award className="h-4 w-4 text-[#AA00FF]/60" />
          <h2 className="text-sm font-semibold text-white/60">Your Progress</h2>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-white/30 mb-1">Total XP</p>
            <p className="text-2xl font-bold text-white/90">
              {loading ? "..." : xp.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-white/30 mb-1">Current Rank</p>
            <p className="text-2xl font-bold text-[#AA00FF]">
              {loading ? "..." : rank}
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-white/30 mb-1">Next Rank</p>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-white/30" />
              <p className="text-sm font-mono text-white/50">
                {rankInfo.nextThreshold
                  ? `${xp} / ${rankInfo.nextThreshold} XP`
                  : "MAX RANK"}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {rankInfo.nextThreshold && (
          <div className="relative h-2 rounded-full bg-white/[0.04] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#AA00FF] to-[#DD44FF]"
            />
          </div>
        )}
      </motion.div>

      {/* Section Label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3 mb-6"
      >
        <Twitter className="h-4 w-4 text-[#AA00FF]/50" />
        <h2 className="text-sm font-semibold text-gray-600 dark:text-white/60">
          MagicBlock Feed
        </h2>
        <div className="h-px flex-1 bg-gray-200 dark:bg-white/5" />
      </motion.div>

      {/* Twitter Timeline Embed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
      >
        <div ref={timelineRef} className="min-h-[200px]" />
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 py-8 border-t border-gray-200 dark:border-white/5"
      >
        <p className="text-center text-[11px] font-mono text-gray-300 dark:text-white/15 tracking-wider">
          DAILY MAGIC v3.0 &mdash; Built on Magic Block L2
        </p>
      </motion.div>
    </>
  );
}
