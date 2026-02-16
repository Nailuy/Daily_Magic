# Project: DAILY MAGIC (v3 - production)
# Tech Stack: Next.js 14, Supabase (Database), Solana Web3, Tailwind CSS.

## 1. BACKEND ARCHITECTURE (Supabase)
-   **Client:** Use `@supabase/supabase-js`.
-   **Auth Flow:**
    -   User Connects Wallet -> App checks `users` table.
    -   **If New User:** Insert row `{ wallet_address, referral_code: random() }`.
    -   **If Returning:** Fetch `xp`, `rank`, `completed_quests`.
    -   **Referral Logic:** If user came via `?ref=CODE`, find the owner of that code and increment their `referral_count` (if tracking column exists) or simply add XP to them via RPC.

## 2. MAGIC BLOCK TECH: "EPHEMERAL SESSION"
-   **The Hook:** A feature demonstrating "Session Keys" UX.
-   **UI:** Header contains a toggle/button: "⚡ ACTIVATE SESSION".
-   **Logic:**
    1.  User clicks -> Simulate signing a "Session Token".
    2.  App state updates to `{ sessionActive: true }`.
    3.  **UX Improvement:** When Session is ACTIVE, all Quest Claims become INSTANT (bypassing the 3-second "Verifying" spinner).
    4.  **Feedback:** Show a toast: "State Compressed via Ephemeral Rollup (0ms)".

## 3. QUEST SYSTEM & VALIDATION
-   **Database Check:** Before rendering a quest, check if `quest_id` exists in `user_quests` table. If yes -> Mark as COMPLETED (Disabled).
-   **Validation Types:**
    -   **Twitter Like:** Optimistic UI (Click -> Wait 10s -> Claim).
    -   **Twitter Reply/Post:** Input Field Validation. User MUST paste a link.
        -   *Regex:* Must match `(twitter.com|x.com)`.
    -   **Referral Quest:** "Invite 2 Friends". Checks if user has >= 2 referrals in DB.
-   **Claiming:**
    -   Call Supabase RPC: `add_xp(wallet, amount)`.
    -   Insert into `user_quests` table to prevent double-claiming.

## 4. RANKS & REWARDS
-   **Ranks:** Verified Human (0) -> Wizard (100) -> Magician (400) -> Apprentice (800) -> Sorcerer (1200) -> Adept (2000).
-   **Visuals:**
    -   Sidebar: Show current Rank Badge.
    -   **Dashboard:** Show a "Real-Time Feed" using `react-twitter-embed` (Timeline of @MagicBlock).

## 5. UI POLISH
-   **Theme:** Default Dark Mode.
-   **Components:** Glassmorphism cards, Lucide Icons, Mobile Responsive (Hamburger menu).