"use client";

import { motion } from "framer-motion";
import {
    MessageSquare,
    Twitter,
    BookOpen,
    BarChart3,
    Users,
    Globe,
    Trophy,
    Star,
    Zap,
} from "lucide-react";
import QuestCard from "@/components/QuestCard";
import { useUser } from "@/hooks/useUser";

/** Returns today's date as YYYY-MM-DD */
function getTodayStr(): string {
    const d = new Date();
    return d.toISOString().slice(0, 10);
}

function getDailyQuests(today: string) {
    return [
        {
            questId: `daily_gm_${today}`,
            title: "Say GM in Discord",
            description:
                "Drop a GM in the #general channel to show you're active in the community today.",
            xp: 10,
            link: "https://discord.com/channels/943797222162726962/1021340411022819328",
            icon: <MessageSquare className="h-5 w-5" />,
            daily: true,
        },
        {
            questId: `daily_price_${today}`,
            title: "Check Magic Block X",
            description:
                "Visit the Magic Block X page and check the latest updates. Knowledge is power.",
            xp: 5,
            link: "https://x.com/magicblock",
            icon: <BarChart3 className="h-5 w-5" />,
            daily: true,
        },
        {
            questId: `share_post_${today}`,
            title: "Share a Post on X",
            description:
                "Post about Solana or MagicBlock on X and paste your link below. Must contain your X username.",
            xp: 15,
            link: "https://x.com/magicblock",
            icon: <Zap className="h-5 w-5" />,
            daily: true,
            validationType: "twitter_url" as const,
        },
        {
            questId: `daily_visit_${today}`,
            title: "Visit the Dashboard",
            description:
                "Check in on your Daily Magic dashboard. Consistency is the key to mastery.",
            xp: 5,
            link: "https://dailymagic.vercel.app/",
            icon: <Star className="h-5 w-5" />,
            daily: true,
        },
    ];
}

const milestoneQuests = [
    {
        questId: "follow_twitter",
        title: "Follow Magic Block on X",
        description:
            "Stay in the loop with the latest updates, announcements, and alpha from the team.",
        xp: 50,
        link: "https://x.com/magicblock",
        icon: <Twitter className="h-5 w-5" />,
    },
    {
        questId: "join_discord",
        title: "Join the Discord",
        description:
            "Connect with the community, ask questions, and participate in exclusive events.",
        xp: 75,
        link: "https://discord.com/invite/MBkdC3gxcv",
        icon: <MessageSquare className="h-5 w-5" />,
    },
    {
        questId: "read_docs",
        title: "Read the Documentation",
        description:
            "Dive deep into Ephemeral Rollups, BOLT ECS, and the full MagicBlock architecture.",
        xp: 100,
        link: "https://docs.magicblock.gg",
        icon: <BookOpen className="h-5 w-5" />,
    },
    {
        questId: "invite_friends",
        title: "Invite 3 Friends",
        description:
            "Spread the word. Invite three friends to the Daily Magic platform and earn bonus XP.",
        xp: 150,
        link: "#",
        icon: <Users className="h-5 w-5" />,
    },
    {
        questId: "visit_site",
        title: "Visit Magic Block site",
        description:
            "Explore the official website and learn about the high-speed Solana L2.",
        xp: 30,
        link: "https://www.magicblock.xyz/",
        icon: <Globe className="h-5 w-5" />,
    },
    {
        questId: "reach_wizard",
        title: "Reach Wizard Rank",
        description:
            "Accumulate 100 XP across all quests to reach Wizard rank. Prove your dedication.",
        xp: 200,
        link: "#",
        icon: <Trophy className="h-5 w-5" />,
        validationType: "xp_gate" as const,
    },
];

export default function QuestsPage() {
    const { user, xp, completedQuests, refreshUser } = useUser();

    const today = getTodayStr();
    const dailyQuests = getDailyQuests(today);

    const userTwitterHandle = user?.twitter_handle?.replace("@", "") || "";

    return (
        <>
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className="mb-10"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-[#AA00FF]/50 to-transparent" />
                    <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#AA00FF]/60">
                        Quest Board
                    </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                    Quests
                </h1>
                <p className="text-sm text-gray-500 dark:text-white/35 max-w-xl">
                    Complete daily rituals and milestone quests to earn XP and climb the leaderboard.
                </p>
            </motion.div>

            {/* Section 1: Daily Rituals */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-10"
            >
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex items-center gap-2 rounded-full bg-[#AA00FF]/10 border border-[#AA00FF]/20 px-3 py-1">
                        <Zap className="h-3 w-3 text-[#AA00FF]" />
                        <span className="text-[11px] font-mono font-medium text-[#AA00FF]">
                            DAILY
                        </span>
                    </div>
                    <h2 className="text-sm font-semibold text-gray-600 dark:text-white/60">
                        Daily Rituals
                    </h2>
                    <span className="text-[10px] text-gray-400 dark:text-white/20 font-mono">
                        Resets every 24h
                    </span>
                    <div className="h-px flex-1 bg-gray-200 dark:bg-white/5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dailyQuests.map((quest, i) => (
                        <QuestCard
                            key={quest.questId}
                            questId={quest.questId}
                            title={quest.title}
                            description={quest.description}
                            xp={quest.xp}
                            link={quest.link}
                            icon={quest.icon}
                            index={i}
                            daily
                            validationType={quest.validationType}
                            alreadyCompleted={completedQuests.has(quest.questId)}
                            onClaimed={refreshUser}
                            userTwitterHandle={userTwitterHandle}
                            userXp={xp}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Section 2: Path of the Mage */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1">
                        <Trophy className="h-3 w-3 text-amber-500" />
                        <span className="text-[11px] font-mono font-medium text-amber-500">
                            MILESTONE
                        </span>
                    </div>
                    <h2 className="text-sm font-semibold text-gray-600 dark:text-white/60">
                        The Path of the Mage
                    </h2>
                    <div className="h-px flex-1 bg-gray-200 dark:bg-white/5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {milestoneQuests.map((quest, i) => (
                        <QuestCard
                            key={quest.questId}
                            questId={quest.questId}
                            title={quest.title}
                            description={quest.description}
                            xp={quest.xp}
                            link={quest.link}
                            icon={quest.icon}
                            index={i}
                            validationType={quest.validationType}
                            alreadyCompleted={completedQuests.has(quest.questId)}
                            onClaimed={refreshUser}
                            userTwitterHandle={userTwitterHandle}
                            userXp={xp}
                        />
                    ))}
                </div>
            </motion.div>
        </>
    );
}
