"use client";

import React from 'react';
import { Tweet } from 'react-tweet';

class TweetErrorBoundary extends React.Component<
    { id: string; children: React.ReactNode },
    { hasError: boolean }
> {
    constructor(props: { id: string; children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 text-center">
                    <p className="text-sm text-white/40 mb-2">Tweet unavailable</p>
                    <a
                        href={`https://x.com/i/status/${this.props.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#AA00FF]/70 hover:text-[#AA00FF] transition-colors"
                    >
                        View on X →
                    </a>
                </div>
            );
        }
        return this.props.children;
    }
}

export default function MagicBlockFeed() {

    const recentTweetIds = [
        "2028487669215289595",
        "2028168418332152093",
        "2027410538549190942"
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
                            <TweetErrorBoundary id={id}>
                                <Tweet id={id} />
                            </TweetErrorBoundary>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
