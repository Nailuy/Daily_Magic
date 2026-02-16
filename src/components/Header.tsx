"use client";

import { Menu, X } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import SessionToggle from "@/components/SessionToggle";

interface HeaderProps {
    onToggleMobileMenu: () => void;
    mobileMenuOpen: boolean;
}

export default function Header({
    onToggleMobileMenu,
    mobileMenuOpen,
}: HeaderProps) {
    return (
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/5 dark:border-white/5 bg-white/60 dark:bg-[#050505]/80 backdrop-blur-xl px-4 md:px-8 py-3">
            {/* Left: Mobile hamburger + Logo (mobile only) */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onToggleMobileMenu}
                    className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/70 cursor-pointer transition-colors"
                >
                    {mobileMenuOpen ? (
                        <X className="h-4 w-4" />
                    ) : (
                        <Menu className="h-4 w-4" />
                    )}
                </button>

                {/* Logo - mobile only */}
                <div className="md:hidden flex items-center gap-2">
                    <Image
                        src="/MagicBlock-Logomark-White.png"
                        alt="Magic Block"
                        width={28}
                        height={28}
                        className="rounded-lg dark:invert-0 invert"
                    />
                    <span className="text-sm font-bold tracking-wide text-gray-900 dark:text-white">
                        DAILY MAGIC
                    </span>
                </div>
            </div>

            {/* Right: Session Toggle + Wallet Button */}
            <div className="ml-auto flex items-center gap-3">
                <SessionToggle />
                <WalletMultiButton />
            </div>
        </header>
    );
}
