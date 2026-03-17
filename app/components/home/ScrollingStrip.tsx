"use client";

import React from 'react';

/* One repeating unit of content in the marquee */
const MarqueeItems = () => (
    <>
        {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-6 px-6">
                <span
                    className="[font-family:var(--font-sigmar)] font-normal text-[#7A2424] whitespace-nowrap"
                    style={{ fontSize: '20px', letterSpacing: '-0.04em', lineHeight: '0.84' }}
                >
                    The Real Warrior of Finance
                </span>
                <img
                    src="/dashboard-assets/Group 913.svg"
                    alt=""
                    aria-hidden="true"
                    className="h-8 w-auto flex-shrink-0"
                />
            </div>
        ))}
    </>
);

interface ScrollingStripProps {
    className?: string;
    style?: React.CSSProperties;
}

export const ScrollingStrip: React.FC<ScrollingStripProps> = ({ className = '', style = {} }) => (
    <div
        className={`absolute z-10 pointer-events-none overflow-hidden ${className}`}
        style={{
            ...style, // Allow overriding styles from parent
        }}
    >
        {/*
         * Render the SVG at its natural 1440x176 size, filling the container width.
         * The container is 176px tall so the ENTIRE plank is visible with no cropping.
         */}
        <img
            src="/dashboard-assets/Group (1).svg"
            alt=""
            aria-hidden="true"
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'fill',  // stretch width-wise; height matches container so no vertical cropping
                zIndex: 0,
            }}
        />

        {/* Text track — absolutely fills the container, text vertically centered */}
        <div className="absolute inset-0 z-10 flex items-center overflow-hidden">
            <div
                className="animate-marquee-strip flex items-center whitespace-nowrap"
                style={{ width: 'max-content', gap: '0', height: '100%' }}
            >
                {/* first copy */}
                <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <MarqueeItems />
                </div>
                {/* duplicate — makes the loop seamless */}
                <div style={{ display: 'flex', alignItems: 'center', height: '100%' }} aria-hidden="true">
                    <MarqueeItems />
                </div>
            </div>
        </div>
    </div>
);
