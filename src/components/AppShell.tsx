"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Trophy,
    Zap,
    BookOpen,
    Settings,
    User,
} from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";

const mobileNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Trophy, label: "Quests", href: "/quests" },
    { icon: Zap, label: "Rewards", href: "/rewards" },
    { icon: BookOpen, label: "Learn", href: "/learn" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { connected } = useWallet();
    const [twitterHandle, setTwitterHandle] = useState("");

    useEffect(() => {
        setTwitterHandle(localStorage.getItem("dm_twitter_handle") || "");
        const handler = () =>
            setTwitterHandle(localStorage.getItem("dm_twitter_handle") || "");
        window.addEventListener("dm_profile_updated", handler);
        return () => window.removeEventListener("dm_profile_updated", handler);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white overflow-hidden">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Right Side: Header + Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
                    mobileMenuOpen={mobileMenuOpen}
                />

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden fixed inset-0 top-[57px] z-30 bg-white/95 dark:bg-[#050505]/95 backdrop-blur-xl"
                        >
                            <div className="flex flex-col h-full p-4 space-y-4 overflow-y-auto">
                                <nav className="space-y-1">
                                    {mobileNavItems.map((item, i) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <motion.div
                                                key={item.label}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                            >
                                                <Link
                                                    href={item.href}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${isActive
                                                            ? "bg-gray-200/60 dark:bg-white/5 text-gray-900 dark:text-white font-medium"
                                                            : "text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/80 hover:bg-gray-100 dark:hover:bg-white/5"
                                                        }`}
                                                >
                                                    <item.icon className="h-4 w-4" />
                                                    {item.label}
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </nav>

                                {/* Mobile Profile */}
                                <div className="border-t border-gray-200 dark:border-white/5 pt-4">
                                    <div className="flex items-center gap-3 px-4">
                                        <div className="h-9 w-9 rounded-full overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center">
                                            {twitterHandle ? (
                                                <img
                                                    src={`https://unavatar.io/twitter/${twitterHandle}`}
                                                    alt={twitterHandle}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <User className="h-4 w-4 text-gray-400 dark:text-white/30" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-900 dark:text-white/80">
                                                {connected
                                                    ? twitterHandle
                                                        ? `@${twitterHandle}`
                                                        : "Connected"
                                                    : "Guest"}
                                            </p>
                                            <p className="text-[10px] text-gray-400 dark:text-white/30">
                                                {connected ? "Wallet active" : "Not connected"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto relative">
                    {/* Ambient background effects */}
                    <div className="pointer-events-none fixed inset-0 dark:block hidden">
                        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#AA00FF]/[0.03] rounded-full blur-[120px]" />
                        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#AA00FF]/[0.02] rounded-full blur-[100px]" />
                    </div>

                    {/* Content */}
                    <div className="relative p-6 md:p-12 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
