<div align="center">
  <br />
    <a href="https://magicblock.gg" target="_blank">
      <img src="public/logo.png" alt="Daily Magic Logo" width="100">
    </a>
  <br />

  <h1>✨ Daily Magic | Magic Block Quest Platform</h1>

  <p>
    <strong>Gamified Web3 Experience on Solana</strong>
  </p>

  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
    <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase" alt="Supabase" /></a>
    <a href="https://solana.com/"><img src="https://img.shields.io/badge/Solana-Web3-blueviolet?style=for-the-badge&logo=solana" alt="Solana" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" /></a>
  </p>
</div>

<br />

## 🔮 Про Проект

**Daily Magic** — це інтерактивна платформа квестів для екосистеми Magic Block (Solana L2). Користувачі підключають гаманці, виконують соціальні та on-chain завдання, заробляють XP та підвищують свій ранг від "Verified Human" до "Wizard".

Проект використовує **Next.js** для швидкодії, **Supabase** для надійної бази даних та Real-time оновлень, та інтегрований з **Twitter/X API** для перевірки завдань.

---

## 🚀 Основні Функції

### 🛡️ Web3 Authentication
- Вхід через Solana Wallet (Phantom, Solflare).
- Автоматична реєстрація профілю при першому підключенні.
- Прив'язка соціальних мереж (Twitter, Discord).

### ⚔️ Quest System (Anti-Cheat)
- **Daily Quests:** Динамічні ID (наприклад, `daily_gm_2024-02-16`), що оновлюються кожні 24 години.
- **One-Time Quests:** Завдання, які можна виконати лише раз.
- **Link Validation:** Перевірка посилань на пости в X (Twitter) перед нарахуванням нагород.
- **Server-Side Verification:** Вся логіка нарахування XP захищена через Supabase RPC функції.

### 🏆 Gamification & Ranks
- **XP System:** За кожну дію нараховується досвід.
- **Auto-Ranking:** База даних автоматично підвищує ранг користувача при досягненні порогу XP:
  - 🧙‍♂️ *Wizard*
  - 🎩 *Magician*
  - 🎓 *Apprentice*
- **Leaderboard:** Глобальний рейтинг топ-50 користувачів у реальному часі.

---

## 🛠️ Технічний Стек

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Framer Motion.
- **Backend / DB:** Supabase (PostgreSQL).
- **Security:** Row Level Security (RLS) policies.
- **Integration:** `@solana/web3.js`, `react-twitter-embed`.
- **Testing:** Playwright (E2E testing).

---

## 🏗️ Структура Бази Даних (Supabase)

Проект використовує дві основні таблиці та SQL функції для логіки:

```sql
users (
  wallet_address PK,
  username,
  xp (int),
  rank (text) -- Auto-calculated
)

user_quests (
  id PK,
  wallet_address FK,
  quest_id (text), -- Supports dynamic IDs like 'daily_gm_2026-02-16'
  submission_data (text) -- Stores proof links
)
