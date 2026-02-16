"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, User, Moon, Sun, CheckCircle2 } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useUser } from "@/hooks/useUser";

export default function SettingsPage() {
    const { theme, toggleTheme } = useTheme();
    const { user, updateProfile } = useUser();
    const [displayName, setDisplayName] = useState("");
    const [twitterHandle, setTwitterHandle] = useState("");
    const [discordHandle, setDiscordHandle] = useState("");
    const [saved, setSaved] = useState(false);

    // Pre-populate from DB user data, fallback to localStorage
    useEffect(() => {
        if (user) {
            setDisplayName(user.username || localStorage.getItem("dm_display_name") || "");
            setTwitterHandle(user.twitter_handle || localStorage.getItem("dm_twitter_handle") || "");
            setDiscordHandle(user.discord_handle || localStorage.getItem("dm_discord_handle") || "");
        } else {
            setDisplayName(localStorage.getItem("dm_display_name") || "");
            setTwitterHandle(localStorage.getItem("dm_twitter_handle") || "");
            setDiscordHandle(localStorage.getItem("dm_discord_handle") || "");
        }
    }, [user]);

    const handleSave = async () => {
        // Save to Supabase
        await updateProfile(displayName, twitterHandle, discordHandle);

        // Also persist to localStorage as fallback
        localStorage.setItem("dm_display_name", displayName);
        localStorage.setItem("dm_twitter_handle", twitterHandle.replace("@", ""));
        localStorage.setItem("dm_discord_handle", discordHandle);
        window.dispatchEvent(new Event("dm_profile_updated"));

        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <>
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-[#AA00FF]/50 to-transparent" />
                    <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#AA00FF]/60">Configuration</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Settings</h1>
                <p className="text-sm text-gray-500 dark:text-white/35 max-w-xl">Manage your profile and appearance preferences.</p>
            </motion.div>

            <div className="max-w-2xl space-y-8">
                {/* Profile Section */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.06]">
                            <User className="h-5 w-5 text-gray-500 dark:text-white/50" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white/90">Profile</h2>
                            <p className="text-xs text-gray-400 dark:text-white/30">Your social identity across the platform</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Display Name */}
                        <div>
                            <label className="block text-xs font-mono text-gray-500 dark:text-white/40 mb-1.5 uppercase tracking-wider">Display Name</label>
                            <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your display name"
                                className="w-full rounded-xl border border-gray-200 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.02] py-3 px-4 text-sm text-gray-900 dark:text-white/80 placeholder:text-gray-400 dark:placeholder:text-white/20 outline-none transition-all focus:border-[#AA00FF]/30 focus:shadow-[0_0_15px_rgba(170,0,255,0.08)]" />
                        </div>

                        {/* Twitter Handle */}
                        <div>
                            <label className="block text-xs font-mono text-gray-500 dark:text-white/40 mb-1.5 uppercase tracking-wider">X (Twitter) Handle</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-white/20">@</span>
                                <input type="text" value={twitterHandle} onChange={(e) => setTwitterHandle(e.target.value.replace("@", ""))} placeholder="username"
                                    className="w-full rounded-xl border border-gray-200 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.02] py-3 pl-8 pr-4 text-sm font-mono text-gray-900 dark:text-white/80 placeholder:text-gray-400 dark:placeholder:text-white/20 outline-none transition-all focus:border-[#AA00FF]/30 focus:shadow-[0_0_15px_rgba(170,0,255,0.08)]" />
                            </div>
                            {twitterHandle && (
                                <div className="mt-2 flex items-center gap-2">
                                    <img src={`https://unavatar.io/twitter/${twitterHandle}`} alt={twitterHandle} className="h-6 w-6 rounded-full object-cover border border-gray-200 dark:border-white/10" />
                                    <span className="text-xs text-gray-500 dark:text-white/40">Avatar preview</span>
                                </div>
                            )}
                        </div>

                        {/* Discord Handle */}
                        <div>
                            <label className="block text-xs font-mono text-gray-500 dark:text-white/40 mb-1.5 uppercase tracking-wider">Discord Handle</label>
                            <input type="text" value={discordHandle} onChange={(e) => setDiscordHandle(e.target.value)} placeholder="user#0000"
                                className="w-full rounded-xl border border-gray-200 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.02] py-3 px-4 text-sm text-gray-900 dark:text-white/80 placeholder:text-gray-400 dark:placeholder:text-white/20 outline-none transition-all focus:border-[#AA00FF]/30 focus:shadow-[0_0_15px_rgba(170,0,255,0.08)]" />
                        </div>

                        {/* Save Button */}
                        <div className="pt-2">
                            <button onClick={handleSave}
                                className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all duration-300 cursor-pointer ${saved
                                    ? "bg-green-500/10 border border-green-500/25 text-green-500"
                                    : "bg-[#AA00FF]/10 border border-[#AA00FF]/25 text-[#AA00FF] hover:bg-[#AA00FF]/20 hover:shadow-[0_0_20px_rgba(170,0,255,0.15)]"
                                    }`}>
                                {saved ? <><CheckCircle2 className="h-4 w-4" />Saved!</> : <><Save className="h-4 w-4" />Save Profile</>}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Appearance Section */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.06]">
                            {theme === "dark" ? <Moon className="h-5 w-5 text-gray-500 dark:text-white/50" /> : <Sun className="h-5 w-5 text-gray-500 dark:text-white/50" />}
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white/90">Appearance</h2>
                            <p className="text-xs text-gray-400 dark:text-white/30">Toggle between dark and light themes</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white/80">
                                {theme === "dark" ? "Dark Mode" : "Light Mode"}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-white/30">
                                {theme === "dark" ? "Cyberpunk aesthetic with deep blacks" : "Clean and bright interface"}
                            </p>
                        </div>

                        <button onClick={toggleTheme}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 cursor-pointer ${theme === "dark" ? "bg-[#AA00FF]/30" : "bg-gray-300"
                                }`}>
                            <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${theme === "dark" ? "translate-x-6" : "translate-x-1"
                                }`} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
