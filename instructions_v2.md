# Project: DAILY MAGIC (Version 2.0 - Feature Expansion)
# Base logic: Inherits from v1, but overrides Layout and Page Content.

## 1. NEW LAYOUT ARCHITECTURE (Critical Changes)
-   **Header (Top Bar):**
    -   Must be fixed at the top.
    -   **Right Side:** Place the `WalletMultiButton` here. It is NO LONGER in the Sidebar.
    -   **Style:** Transparent/Blur background, sticky.
-   **Sidebar (Left):**
    -   **Top:** Logo + "DAILY MAGIC".
    -   **Middle:** Navigation Links (Dashboard, Quests, Rewards, Learn, Settings).
    -   **Bottom (Fixed):** User Profile Widget.
        -   *State:* If Wallet connected -> Show Avatar (Unavatar) + Handle + XP Badge.
        -   *State:* If Locked -> Show "Guest".
-   **Theme Engine:**
    -   Implement "Dark Mode" by default, but allow "Light Mode" toggle in Settings.
    -   Use Tailwind `dark:` prefix logic.

## 2. PAGE-BY-PAGE SPECIFICATIONS

### A. Dashboard (`/`)
-   **Hero Section:** Short, punchy intro paragraph about MagicBlock (Real-time, Ephemeral Rollups).
-   **Twitter Feed Widget:**
    -   Since we cannot use the live API, create a **Mock Tweet Component**.
    -   Display 3 latest "static" updates looking exactly like X/Twitter embeds (Icon, Handle, Text, Date).
    -   *Content:* Use real news from the uploaded MagicBlock report (e.g., "Ephemeral Rollups are live", "Hackathon Winners announced").

### B. Quests (`/quests`)
-   **Section 1: Daily Rituals (Recurring)**
    -   List 3-4 tasks that reset every 24h (mock logic).
    -   *Example:* "Say GM in Discord", "Check Price".
-   **Section 2: The Path of the Mage (One-Time)**
    -   List "Milestone" quests.
    -   *Example:* "Follow on X", "Join Discord", "Reach Lvl 5".

### C. Rewards (`/rewards`)
-   **Progression System:**
    -   Calculate Total XP.
    -   **The Certificate Generator:**
        -   Visual Component: A Golden/Silver/Bronze card.
        -   Dynamic Data: Overlays the User's Avatar, Handle, and "Mage Rank" onto the card.
        -   *Logic:* < 500 XP = Novice (Grey), > 500 XP = Apprentice (Bronze), > 1000 XP = Sorcerer (Silver).

### D. Learn (`/learn`)
-   **Quiz Engine:**
    -   5 Topics (Ephemeral Rollups, Bolt ECS, Session Keys, Tokenomics, TEE).
    -   Each topic has 5 questions.
    -   *UI:* Simple multiple-choice interface. Correct answer = +XP.

### E. Settings (`/settings`)
-   **Profile Management:**
    -   Input fields for: "Display Name", "X Handle", "Discord Handle".
    -   **Save Button:** Saves to `localStorage`.
    -   *Effect:* Updating here immediately updates the Avatar in the Sidebar (Bottom Left).
-   **Appearance:**
    -   Toggle Switch: "Dark Mode" / "Light Mode".

## 3. GLOBAL STYLE REFINEMENTS
-   **Avatar Logic:** Continue using `https://unavatar.io/twitter/[HANDLE]` based on the settings input.
-   **Glassmorphism:** Maintain the high-end feel. Deep blacks for Dark Mode, clean whites/greys for Light Mode.