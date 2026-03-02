"use client";

import { Tweet } from 'react-tweet';

export default function MagicBlockFeed() {
    // Hardcoded recent tweet IDs from @magicblock for the MVP.
    // We can easily update these strings or move them to Supabase later.
    const recentTweetIds = [
        "2028487669215289595", // Example MagicBlock tweet
        "2028168418332152093", // Example MagicBlock tweet
        "2027410538549190942"  // Example MagicBlock tweet
    ];

    return (
        <div className="w-full flex flex-col gap-4">
            <h3 className="text-xl font-bold text-white mb-2">Latest from MagicBlock</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentTweetIds.map((id) => (
                    <div
                        key={id}
                        className="w-full h-[450px] overflow-y-auto rounded-xl border border-gray-800 bg-[#0A0A0A] custom-scrollbar"
                    >
                        <div className="dark flex justify-center w-full px-2">
                            <Tweet id={id} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
