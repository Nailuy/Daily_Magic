"use client";

import { useEffect } from "react";

export default function MagicBlockFeed() {
    useEffect(() => {
        // Dynamically inject the Twitter script to ensure it loads on the client
        const script = document.createElement("script");
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        script.charset = "utf-8";
        document.body.appendChild(script);

        // Force re-evaluation if script is already present
        if ((window as unknown as Record<string, unknown>).twttr) {
            const twttr = (window as unknown as Record<string, unknown>).twttr as { widgets?: { load: () => void } };
            twttr.widgets?.load();
        }

        return () => {
            // Cleanup script on unmount to prevent duplicates
            try {
                document.body.removeChild(script);
            } catch {
                // Script already removed
            }
        };
    }, []);

    return (
        <div className="w-full h-[600px] overflow-hidden rounded-xl border border-gray-800 bg-[#000000]">
            <a
                className="twitter-timeline"
                data-theme="dark"
                data-height="600"
                href="https://twitter.com/magicblock"
            >
                Tweets by MagicBlock
            </a>
        </div>
    );
}
