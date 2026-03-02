"use client";

import { Tweet } from 'react-tweet';

export default function MagicBlockFeed() {
    // Hardcoded recent tweet IDs from @magicblock for the MVP.
    // We can easily update these strings or move them to Supabase later.
    const recentTweetIds = [
        "1888258327178351093", // Example MagicBlock tweet
        "1888258330558918933", // Example MagicBlock tweet
        "1885695843477197176"  // Example MagicBlock tweet
    ];

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentTweetIds.map((id) => (
                    <div key={id} className="w-full flex justify-center dark">
                        <Tweet id={id} />
                    </div>
                ))}
            </div>
        </div>
    );
}
