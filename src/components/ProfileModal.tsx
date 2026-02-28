"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, X, Save, CheckCircle2, Gift, Copy, Check } from "lucide-react";
import { useUser } from "@/hooks/useUser";

export default function ProfileModal() {
    const { needsProfile, updateProfile, user } = useUser();
    const [username, setUsername] = useState("");
    const [twitter, setTwitter] = useState("");
    const [discord, setDiscord] = useState("");
    const [saving, setSaving] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    if (!needsProfile || dismissed) return null;

    const allFieldsFilled = username.trim() && twitter.trim() && discord.trim();

    const handleSave = async () => {
        if (!allFieldsFilled) return;
        setSaving(true);
        await updateProfile(username.trim(), twitter.trim(), discord.trim());
        setSaving(false);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0a0a0a] p-6 md:p-8 shadow-2xl"
                >
                    {/* Dismiss button */}
                    <button
                        onClick={() => setDismissed(true)}
                        className="absolute top-4 right-4 text-white/20 hover:text-white/60 transition-colors cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                    </button>

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#AA00FF]/10 border border-[#AA00FF]/20">
                            <User className="h-5 w-5 text-[#AA00FF]" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-white/90">Complete Your Profile</h2>
                            <p className="text-xs text-white/30">All fields are required to start earning XP</p>
                        </div>
                    </div>

                    {/* Fields */}
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-[10px] font-mono text-white/40 mb-1.5 uppercase tracking-wider">
                                Username <span className="text-[#AA00FF]">*</span>
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Your username"
                                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-3 px-4 text-sm text-white/80 placeholder:text-white/20 outline-none transition-all focus:border-[#AA00FF]/40"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-mono text-white/40 mb-1.5 uppercase tracking-wider">
                                X (Twitter) Handle <span className="text-[#AA00FF]">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/20">@</span>
                                <input
                                    type="text"
                                    value={twitter}
                                    onChange={(e) => setTwitter(e.target.value.replace("@", ""))}
                                    placeholder="username"
                                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-3 pl-8 pr-4 text-sm font-mono text-white/80 placeholder:text-white/20 outline-none transition-all focus:border-[#AA00FF]/40"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-mono text-white/40 mb-1.5 uppercase tracking-wider">
                                Discord Handle <span className="text-[#AA00FF]">*</span>
                            </label>
                            <input
                                type="text"
                                value={discord}
                                onChange={(e) => setDiscord(e.target.value)}
                                placeholder="user#0000"
                                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-3 px-4 text-sm text-white/80 placeholder:text-white/20 outline-none transition-all focus:border-[#AA00FF]/40"
                            />
                        </div>
                    </div>

                    {/* Validation hint */}
                    {!allFieldsFilled && (
                        <p className="text-[10px] font-mono text-amber-400/60 mb-4">
                            Please fill in all required fields (*)
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setDismissed(true)}
                            className="flex-1 rounded-xl border border-white/[0.06] px-4 py-3 text-sm font-medium text-white/40 hover:text-white/60 hover:bg-white/[0.02] transition-all cursor-pointer"
                        >
                            Skip for now
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!allFieldsFilled || saving}
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#AA00FF]/10 border border-[#AA00FF]/25 px-4 py-3 text-sm font-medium text-[#AA00FF] hover:bg-[#AA00FF]/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <><CheckCircle2 className="h-4 w-4 animate-pulse" />Saving...</>
                            ) : (
                                <><Save className="h-4 w-4" />Save Profile</>
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
