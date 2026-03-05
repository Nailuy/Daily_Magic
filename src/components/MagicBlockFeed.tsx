"use client";

import { Tweet } from 'react-tweet';

export default function MagicBlockFeed() {
    // Hardcoded recent tweet IDs from @magicblock for the MVP.
    // We can easily update these strings or move them to Supabase later.
    const recentTweetIds = [
        "2029227612929966365",
        "2029195158525251951",
        "2028832784341410073"
    ];

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {recentTweetIds.map((id) => (
                    <div
                        key={id}
                        className="w-full h-fit flex justify-center dark transition-transform duration-300 hover:-translate-y-1"
                    >
                        <div className="w-full">
                            <Tweet id={id} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
