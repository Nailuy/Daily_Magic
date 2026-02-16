import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WalletContextProvider from "@/components/WalletContextProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SessionProvider } from "@/components/SessionContext";
import AppShell from "@/components/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Daily Magic | Magic Block Community Hub",
  description:
    "The high-speed Solana L2 community hub. Complete quests, earn rewards, and engage with the Magic Block ecosystem.",
  keywords: ["Magic Block", "Solana", "L2", "Web3", "DeFi", "Quests"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <WalletContextProvider>
          <SessionProvider>
            <ThemeProvider>
              <AppShell>{children}</AppShell>
            </ThemeProvider>
          </SessionProvider>
        </WalletContextProvider>
      </body>
    </html>
  );
}
