"use client";

import { useState } from "react";
import { Zap, Check } from "lucide-react";
import { useSession } from "@/components/SessionContext";
import { useWallet } from "@solana/wallet-adapter-react";

export default function SessionToggle() {
    const { sessionActive, activateSession } = useSession();
    const { connected } = useWallet();
    const [activating, setActivating] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleActivate = async () => {
        if (!connected || sessionActive || activating) return;
        setActivating(true);
        // Simulate signing a session token (300ms)
        await new Promise((r) => setTimeout(r, 300));
        activateSession();
        setActivating(false);
        // Show toast
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    if (!connected) return null;

    return (
        <div className="relative">
            <button
                onClick={handleActivate}
                disabled={sessionActive || activating}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 font-mono text-[11px] font-medium transition-all duration-300 cursor-pointer border ${sessionActive
                        ? "bg-green-500/10 border-green-500/25 text-green-400"
                        : activating
                            ? "bg-[#AA00FF]/5 border-[#AA00FF]/20 text-[#AA00FF]/60"
                            : "bg-white/[0.02] border-white/[0.06] text-white/50 hover:bg-[#AA00FF]/10 hover:border-[#AA00FF]/30 hover:text-[#AA00FF]"
                    }`}
            >
                {sessionActive ? (
                    <>
                        <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="hidden sm:inline">SESSION ACTIVE</span>
                        <Check className="h-3 w-3 sm:hidden" />
                    </>
                ) : (
                    <>
                        <Zap className="h-3 w-3" />
                        <span className="hidden sm:inline">{activating ? "SIGNING..." : "ACTIVATE SESSION"}</span>
                        <span className="sm:hidden">{activating ? "..." : "SESSION"}</span>
                    </>
                )}
            </button>

            {/* Toast Notification */}
            {showToast && (
                <div className="absolute top-full right-0 mt-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="rounded-xl border border-green-500/20 bg-[#0a0a0a]/95 backdrop-blur-xl px-4 py-2.5 shadow-[0_0_20px_rgba(0,255,100,0.1)]">
                        <div className="flex items-center gap-2">
                            <Zap className="h-3.5 w-3.5 text-green-400" />
                            <span className="text-[11px] font-mono text-green-400 whitespace-nowrap">
                                State Compressed via Ephemeral Rollup (0ms)
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
