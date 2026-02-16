
# Project: DAILY MAGIC (Reboot)
# Role: Senior Frontend Architect
# Style: Cyberpunk / High-Frequency Trading Terminal / Minimalist
# Stack: Next.js 14 (App Router), Tailwind CSS, Framer Motion, Lucide React, Solana Web3

## 1. THE VISION
We are building a community hub for "Magic Block" (a high-speed Solana L2).
The site must feel **expensive, engineered, and fast**.
-   **NO EMOJIS.** Use `lucide-react` icons only.
-   **NO DEFAULT STYLES.** Everything must be custom (black, glass, thin borders).

## 2. LAYOUT ARCHITECTURE (Strict Enforcement)
The app must use a **Fixed Sidebar Layout**.
-   **Wrapper:** `flex h-screen bg-[#050505] text-white overflow-hidden font-sans`
-   **Sidebar (Desktop):**
    -   Fixed width: `w-72` (18rem).
    -   Border: Right border `border-white/5`.
    -   Background: `bg-[#080808]/50 backdrop-blur-xl`.
    -   Content: Logo (Top), Nav Links (Middle), User Profile & Wallet (Bottom).
-   **Main Content Area:**
    -   Properties: `flex-1 overflow-y-auto relative`.
    -   **PADDING:** Crucial. Must use `p-6 md:p-12` to prevent content touching edges.
    -   **MaxWidth:** Content constraint `max-w-7xl mx-auto`.
-   **Mobile:** Sidebar is hidden. Use a top Navbar with a Hamburger Menu.

## 3. DESIGN SYSTEM & ASSETS
-   **Colors:**
    -   Background: Deep Black `#050505`.
    -   Primary Accent: Magic Purple `#AA00FF`.
    -   Surface: White with very low opacity (`bg-white/5`).
    -   Borders: Thin, subtle (`border-white/10`).
-   **Logo:** Use the file `/MagicBlock-Logomark-White.png`. Size: 32x32px.
-   **Glow Effects:** Use `shadow-[0_0_20px_rgba(170,0,255,0.3)]` for active states.
-   **Animations:** Use `framer-motion` for staggering list items and button hovers.

## 4. FEATURE: REAL WALLET CONNECTION
-   Use `@solana/wallet-adapter-react`.
-   **Styling Override:** You MUST override the default purple button.
    -   Class: `.wallet-adapter-button`
    -   Style: Transparent background, 1px border `rgba(255,255,255,0.1)`, Monospace font.
    -   Hover: Glow Purple.

## 5. FEATURE: USER PROFILE (The "Identity" Layer)
-   **Input:** A clean input field for "Twitter Handle" (e.g., @username).
-   **Avatar Logic:**
    -   Source: `https://unavatar.io/twitter/${username}`.
    -   Fallback: If empty, show a generic user icon.
    -   Behavior: Updates instantly as user types.
-   **Persistence:** Save the username in `localStorage`.

## 6. FEATURE: QUEST SYSTEM
-   **Grid:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`.
-   **Card Style:** Glassmorphism (`backdrop-blur-md`).
-   **Logic:**
    -   State: "Locked" (Greyed out) if Wallet NOT connected.
    -   Action: Click -> Open Link -> Show "Verifying..." (Spinner) -> Unlock "Claim".
    -   Reward: Trigger a confetti or glow animation on claim.

## 7. SECURITY MODAL
-   On first load, block the entire screen with a `z-50` backdrop.
-   Message: "SYSTEM WARNING: UNAUDITED PROTOCOL. USE BURNER WALLET ONLY."
-   Action: Button "I Acknowledge" unlocks the app.