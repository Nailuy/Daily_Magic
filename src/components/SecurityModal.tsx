"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, AlertTriangle } from "lucide-react";

export default function SecurityModal() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const acknowledged = localStorage.getItem("dm_security_ack");
        if (!acknowledged) {
            setVisible(true);
        }
    }, []);

    const handleAcknowledge = () => {
        localStorage.setItem("dm_security_ack", "true");
        setVisible(false);
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        className="relative mx-4 max-w-lg w-full rounded-2xl border border-red-500/20 bg-[#0a0a0a] p-8 md:p-10"
                    >
                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-red-500/5 to-transparent pointer-events-none" />

                        {/* Icon */}
                        <div className="relative flex justify-center mb-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
                                <ShieldAlert className="h-8 w-8 text-red-400" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="relative text-center">
                            <h2 className="mb-2 font-mono text-xs font-bold tracking-[0.3em] uppercase text-red-400">
                                System Warning
                            </h2>
                            <p className="mb-6 text-lg font-semibold text-white/90">
                                Unaudited Protocol
                            </p>

                            <div className="mb-8 rounded-xl bg-red-500/5 border border-red-500/10 p-4">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="h-5 w-5 text-red-400/70 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-white/50 leading-relaxed text-left">
                                        This protocol has not been formally audited. Interact at your
                                        own risk. We strongly recommend using a{" "}
                                        <span className="text-red-400 font-medium">
                                            burner wallet
                                        </span>{" "}
                                        with minimal funds.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleAcknowledge}
                                className="w-full cursor-pointer rounded-xl border border-red-500/20 bg-red-500/10 px-6 py-3.5 font-mono text-sm font-medium text-red-300 transition-all duration-300 hover:bg-red-500/20 hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] active:scale-[0.98]"
                            >
                                I Acknowledge the Risks
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
