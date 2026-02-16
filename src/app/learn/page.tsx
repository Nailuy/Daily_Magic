"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CheckCircle2, XCircle, ArrowRight, RotateCcw, Sparkles, Trophy } from "lucide-react";

interface Question { question: string; options: string[]; correct: number; }
interface Topic { id: string; title: string; description: string; xpReward: number; questions: Question[]; }

const topics: Topic[] = [
    {
        id: "ephemeral-rollups", title: "Ephemeral Rollups", description: "App-specific, real-time execution environments on Solana.", xpReward: 50,
        questions: [
            { question: "What are Ephemeral Rollups?", options: ["Permanent L2 chains", "App-specific runtimes that spin up on demand", "Solana validator nodes", "A type of NFT"], correct: 1 },
            { question: "Where do Ephemeral Rollups settle?", options: ["Ethereum", "Solana mainnet", "Bitcoin", "Polygon"], correct: 1 },
            { question: "Primary use case for Ephemeral Rollups?", options: ["DeFi trading", "On-chain gaming and real-time apps", "Token launches", "NFT minting"], correct: 1 },
            { question: "Ephemeral Rollups are designed to be:", options: ["Slow but secure", "Fast and customizable", "Decentralized and immutable", "Expensive but reliable"], correct: 1 },
            { question: "How do Ephemeral Rollups handle state?", options: ["Stored permanently on L2", "Delegated from Solana and returned after execution", "Stored off-chain", "Discarded after each block"], correct: 1 },
        ],
    },
    {
        id: "bolt-ecs", title: "BOLT ECS", description: "Entity Component System framework for on-chain games.", xpReward: 50,
        questions: [
            { question: "What does ECS stand for?", options: ["Encrypted Chain System", "Entity Component System", "Execution Control Service", "External Code Standard"], correct: 1 },
            { question: "BOLT ECS is primarily used for building:", options: ["DeFi protocols", "Token bridges", "On-chain games", "Wallet apps"], correct: 2 },
            { question: "What is an 'Entity' in ECS?", options: ["A smart contract", "A unique identifier that groups components", "A blockchain transaction", "A type of account"], correct: 1 },
            { question: "What is a 'Component' in ECS?", options: ["A visual UI element", "A data container attached to entities", "A network protocol", "A blockchain node"], correct: 1 },
            { question: "What is a 'System' in ECS?", options: ["The blockchain network", "Logic that operates on entities with specific components", "A hardware requirement", "A deployment tool"], correct: 1 },
        ],
    },
    {
        id: "session-keys", title: "Session Keys", description: "Seamless UX with delegated transaction signing.", xpReward: 50,
        questions: [
            { question: "What problem do Session Keys solve?", options: ["High gas fees", "Repeated wallet popup approvals", "Slow block times", "Token inflation"], correct: 1 },
            { question: "Session Keys allow users to:", options: ["Mine tokens", "Sign once and interact without further approvals", "Create new wallets", "Transfer NFTs automatically"], correct: 1 },
            { question: "Session Keys are particularly useful for:", options: ["Long-term staking", "Real-time gaming interactions", "Token launches", "Governance voting"], correct: 1 },
            { question: "How are Session Keys scoped?", options: ["Unlimited permissions forever", "Time-bound and permission-limited", "Only work on testnet", "Require hardware wallets"], correct: 1 },
            { question: "Which SDK integrates Session Keys?", options: ["React SDK", "Unity SDK", "Python SDK", "Rust SDK"], correct: 1 },
        ],
    },
    {
        id: "tokenomics", title: "Tokenomics", description: "Understanding the MagicBlock token economy.", xpReward: 50,
        questions: [
            { question: "What blockchain does MagicBlock build on?", options: ["Ethereum", "Solana", "Avalanche", "Cardano"], correct: 1 },
            { question: "MagicBlock is classified as a:", options: ["Layer 1", "Layer 2 / execution layer", "Sidechain", "Bridge protocol"], correct: 1 },
            { question: "Primary target market for MagicBlock?", options: ["DeFi lending", "On-chain gaming and real-time apps", "Supply chain", "Social media"], correct: 1 },
            { question: "How does MagicBlock achieve high throughput?", options: ["Larger block sizes", "App-specific Ephemeral Rollups", "Proof of Work", "Centralized servers"], correct: 1 },
            { question: "MagicBlock benefits game developers by:", options: ["Providing free hosting", "Enabling fully on-chain game logic with low latency", "Removing need for code", "Fiat payment processing"], correct: 1 },
        ],
    },
    {
        id: "tee", title: "TEE (Trusted Execution)", description: "Hardware-backed security for private computation.", xpReward: 50,
        questions: [
            { question: "What does TEE stand for?", options: ["Token Exchange Engine", "Trusted Execution Environment", "Transaction Encryption Extension", "Total Energy Efficiency"], correct: 1 },
            { question: "TEEs provide security through:", options: ["Software encryption only", "Hardware-isolated execution", "Social verification", "Multi-signature wallets"], correct: 1 },
            { question: "In gaming, TEEs can be used for:", options: ["Rendering graphics", "Hiding game state (fog of war)", "Storing NFT artwork", "Managing discord servers"], correct: 1 },
            { question: "TEEs ensure that:", options: ["All data is public", "Computation is verifiable even when inputs are private", "Transactions are free", "Blocks are faster"], correct: 1 },
            { question: "Which is a real-world TEE technology?", options: ["Intel SGX", "SQLite", "React Native", "MongoDB"], correct: 0 },
        ],
    },
];

export default function LearnPage() {
    const [activeTopic, setActiveTopic] = useState<string | null>(null);
    const [currentQ, setCurrentQ] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [quizComplete, setQuizComplete] = useState(false);
    const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());

    useEffect(() => {
        const saved = localStorage.getItem("dm_completed_quizzes");
        if (saved) setCompletedTopics(new Set(JSON.parse(saved)));
    }, []);

    const topic = topics.find((t) => t.id === activeTopic);

    const handleAnswer = (index: number) => {
        if (showResult) return;
        setSelected(index);
        setShowResult(true);
        if (topic && index === topic.questions[currentQ].correct) setScore((s) => s + 1);
    };

    const handleNext = () => {
        if (!topic) return;
        if (currentQ < topic.questions.length - 1) {
            setCurrentQ((q) => q + 1); setSelected(null); setShowResult(false);
        } else {
            setQuizComplete(true);
            if (score >= 3) {
                const currentXp = parseInt(localStorage.getItem("dm_total_xp") || "0", 10);
                localStorage.setItem("dm_total_xp", (currentXp + topic.xpReward).toString());
                const nc = new Set(completedTopics); nc.add(topic.id); setCompletedTopics(nc);
                localStorage.setItem("dm_completed_quizzes", JSON.stringify([...nc]));
                window.dispatchEvent(new Event("dm_profile_updated"));
            }
        }
    };

    const resetQuiz = () => { setActiveTopic(null); setCurrentQ(0); setSelected(null); setShowResult(false); setScore(0); setQuizComplete(false); };

    return (
        <>
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-[#AA00FF]/50 to-transparent" />
                    <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#AA00FF]/60">Knowledge Base</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Learn</h1>
                <p className="text-sm text-gray-500 dark:text-white/35 max-w-xl">Test your knowledge of MagicBlock technology. Score 3/5 or higher to earn XP.</p>
            </motion.div>

            <AnimatePresence mode="wait">
                {!activeTopic ? (
                    <motion.div key="topics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {topics.map((t, i) => {
                            const completed = completedTopics.has(t.id);
                            return (
                                <motion.button key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                                    onClick={() => !completed && setActiveTopic(t.id)}
                                    className={`group text-left rounded-2xl border p-6 transition-all duration-300 cursor-pointer ${completed ? "border-green-500/20 bg-green-500/[0.03]" : "border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:border-[#AA00FF]/20 hover:shadow-[0_0_30px_rgba(170,0,255,0.05)]"}`}>
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.06]">
                                            <BookOpen className="h-5 w-5 text-gray-500 dark:text-white/50 group-hover:text-[#AA00FF]/70 transition-colors" />
                                        </div>
                                        {completed ? <CheckCircle2 className="h-5 w-5 text-green-500/60" /> : (
                                            <div className="flex items-center gap-1 rounded-full bg-gray-100 dark:bg-white/[0.04] px-2.5 py-0.5 border border-gray-200 dark:border-white/[0.06]">
                                                <Sparkles className="h-3 w-3 text-[#AA00FF]/60" />
                                                <span className="text-[10px] font-mono text-gray-500 dark:text-white/40">{t.xpReward} XP</span>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white/90 mb-1">{t.title}</h3>
                                    <p className="text-xs text-gray-500 dark:text-white/35">{t.description}</p>
                                    {completed && <p className="text-[10px] text-green-500/60 mt-2 font-mono">Completed</p>}
                                </motion.button>
                            );
                        })}
                    </motion.div>
                ) : quizComplete ? (
                    <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-lg mx-auto text-center">
                        <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-8 md:p-10">
                            <div className="flex justify-center mb-4">
                                <div className={`h-16 w-16 rounded-2xl ${score >= 3 ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"} flex items-center justify-center`}>
                                    {score >= 3 ? <Trophy className="h-8 w-8 text-green-500" /> : <XCircle className="h-8 w-8 text-red-400" />}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{score >= 3 ? "Quiz Passed!" : "Not Quite"}</h3>
                            <p className="text-sm text-gray-500 dark:text-white/40">You scored <span className="font-mono font-bold text-gray-900 dark:text-white">{score}/5</span></p>
                            {score >= 3 && topic && <p className="text-sm text-green-500/80 mt-2">+{topic.xpReward} XP earned!</p>}
                            {score < 3 && <p className="text-xs text-gray-400 dark:text-white/30 mt-2">Score 3/5 or higher to earn XP.</p>}
                            <button onClick={resetQuiz} className="mt-6 flex items-center gap-2 mx-auto rounded-xl bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.06] px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/[0.08] transition-all cursor-pointer">
                                <RotateCcw className="h-4 w-4" />Back to Topics
                            </button>
                        </div>
                    </motion.div>
                ) : topic ? (
                    <motion.div key={`q-${currentQ}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl mx-auto">
                        <div className="flex items-center gap-3 mb-6">
                            <button onClick={resetQuiz} className="text-xs text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60 transition-colors cursor-pointer">← Back</button>
                            <span className="text-xs font-mono text-gray-400 dark:text-white/30">{topic.title}</span>
                            <div className="flex-1" />
                            <span className="text-xs font-mono text-gray-400 dark:text-white/30">{currentQ + 1} / {topic.questions.length}</span>
                        </div>
                        <div className="w-full h-1 rounded-full bg-gray-200 dark:bg-white/5 mb-8 overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-[#AA00FF] to-[#DD44FF] transition-all duration-300" style={{ width: `${((currentQ + (showResult ? 1 : 0)) / topic.questions.length) * 100}%` }} />
                        </div>
                        <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-6 md:p-8 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white/90 mb-6">{topic.questions[currentQ].question}</h3>
                            <div className="space-y-3">
                                {topic.questions[currentQ].options.map((opt, idx) => {
                                    let style = "border-gray-200 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.02] text-gray-700 dark:text-white/60 hover:border-gray-300 dark:hover:border-white/[0.12]";
                                    if (showResult) {
                                        if (idx === topic.questions[currentQ].correct) style = "border-green-500/30 bg-green-500/5 text-green-600 dark:text-green-400";
                                        else if (idx === selected) style = "border-red-500/30 bg-red-500/5 text-red-500 dark:text-red-400";
                                        else style = "border-gray-200 dark:border-white/[0.04] bg-gray-50/50 dark:bg-white/[0.01] text-gray-400 dark:text-white/20";
                                    }
                                    return (
                                        <button key={idx} onClick={() => handleAnswer(idx)} disabled={showResult}
                                            className={`w-full text-left rounded-xl border p-4 text-sm transition-all duration-200 cursor-pointer ${style}`}>
                                            <span className="font-mono text-xs mr-3 opacity-50">{String.fromCharCode(65 + idx)}.</span>{opt}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        {showResult && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
                                <button onClick={handleNext} className="flex items-center gap-2 rounded-xl bg-[#AA00FF]/10 border border-[#AA00FF]/25 px-5 py-2.5 text-sm font-medium text-[#AA00FF] hover:bg-[#AA00FF]/20 transition-all cursor-pointer">
                                    {currentQ < topic.questions.length - 1 ? "Next Question" : "See Results"}<ArrowRight className="h-4 w-4" />
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </>
    );
}
