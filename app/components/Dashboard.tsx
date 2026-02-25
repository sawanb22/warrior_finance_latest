"use client";

import React from 'react';
import { HeroSection } from './dashboard/HeroSection';
import { MascotPlaceholder, StatsBoard } from './dashboard/StatsBus';
import { TokenCard } from './dashboard/TokenCard';

import { StakingInfo } from './dashboard/StakingInfo';
import { CollateralCard } from './dashboard/CollateralCard';


export const Dashboard = () => {
    return (
        <div className="min-h-screen bg-transparent text-white overflow-x-hidden font-sans relative">

            {/* ── SCROLLING STRIP ── plain #F0DDC0 bar, 1760.98×45.13px, rotated corner-to-corner ── */}
            <div
                className="absolute z-10 pointer-events-none"
                style={{
                    /* Exact design dimensions - narrowed by another 3px (1.5px from both sides) */
                    width: '1760.98px',
                    height: '45.13px',
                    background: '#F0DDC0',
                    /* Position: centered horizontally so it overhangs both sides equally */
                    top: '146px',                /* vertical midpoint so it straddles the navbar bottom */
                    left: 'calc(50% - 880.49px)',/* center of 1760.98 = 880.49 */
                    /* Rotate so it cuts diagonally: right side higher, left side lower */
                    transform: 'rotate(-3.26deg)',
                    transformOrigin: 'center center',
                    overflow: 'hidden',
                    /* Inset shadows for beveled look */
                    boxShadow: '0px -4px 0px 0px #FFEE60 inset, 0px 4px 0px 0px #00000040 inset',
                }}
            >
                {/* Scrolling text — vertically centered inside the bar */}
                <div className="absolute inset-0 flex items-center overflow-hidden">
                    <div className="animate-marquee-strip flex items-center shrink-0 whitespace-nowrap">
                        {/* Copy 1 */}
                        {[...Array(6)].map((_, i) => (
                            <div key={`a-${i}`} className="flex items-center gap-5 px-6">
                                <img
                                    src="/dashboard-assets/Group 913.svg"
                                    alt="Warrior Finance"
                                    className="h-8 w-auto shrink-0"
                                />
                                <span
                                    style={{
                                        fontFamily: 'Sigmar, cursive',
                                        fontWeight: 400,
                                        fontSize: '20px',
                                        lineHeight: '84%',
                                        letterSpacing: '-0.04em',
                                        color: '#5D1D2D',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    The Real Warrior of Finance
                                </span>
                            </div>
                        ))}
                        {/* Copy 2 — seamless loop */}
                        {[...Array(6)].map((_, i) => (
                            <div key={`b-${i}`} aria-hidden className="flex items-center gap-5 px-6">
                                <img
                                    src="/dashboard-assets/Group 913.svg"
                                    alt=""
                                    className="h-8 w-auto shrink-0"
                                />
                                <span
                                    style={{
                                        fontFamily: 'Sigmar, cursive',
                                        fontWeight: 400,
                                        fontSize: '20px',
                                        lineHeight: '84%',
                                        letterSpacing: '-0.04em',
                                        color: '#5D1D2D',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    The Real Warrior of Finance
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── HERO SECTION ── full viewport width, background only here ── */}
            <section className="relative w-full overflow-hidden min-h-[600px] lg:h-[875px]">

                {/* Content wrapper – centred, matches 1440px grid */}
                <div className="relative z-20 w-full max-w-[1440px] mx-auto h-full flex flex-col lg:block items-center justify-between gap-12 py-10 lg:py-0">

                    {/* Left: Warriors Never Die */}
                    <div className="w-full lg:absolute lg:left-[112px] lg:top-[329px] lg:w-[487px] lg:z-20 flex justify-center lg:block order-2 lg:order-none px-4 lg:px-0 pt-10 lg:pt-0">
                        <HeroSection />
                    </div>

                    {/* Center: Hero Mascot */}
                    <div className="w-full lg:absolute lg:left-[504px] lg:top-[184px] lg:w-[437px] lg:h-[611px] lg:z-10 flex justify-center lg:block order-1 lg:order-none relative -mt-10 lg:mt-0">
                        <MascotPlaceholder />
                    </div>

                    {/* Right: Total Locked Board */}
                    <div className="w-full lg:absolute lg:left-[910px] lg:top-[342px] lg:w-[389px] lg:h-[243px] lg:z-20 flex justify-center lg:block order-3 lg:order-none pt-8 lg:pt-0">
                        <StatsBoard />
                    </div>
                </div>
            </section>

            {/* ── BELOW-HERO CONTENT ── black bg, padded ── */}
            <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-[31px]">

                {/* Token Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    <TokenCard
                        tokenName="WROR"
                        price="~ $0.00"
                        priceWeth="0.00 WETH"
                        circSupply="0.00"
                        marketCap="0.00"
                        isWror={true}
                        priceLayout="primary"
                    />
                    <TokenCard
                        tokenName="WROR"
                        priceWeth="0.00 WETH"
                        priceValue="$0.00"
                        circSupply="0.00"
                        marketCap="0.00"
                        isWror={true}
                        priceLayout="secondary"
                    />
                </div>

                {/* Staking Info Row */}
                <div className="w-full">
                    <StakingInfo />
                </div>

                {/* Footer / Collateral Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <CollateralCard
                        value="0.00 %"
                        label="Collateral Ratio"
                        lastUpdate="Last Update: 23/06/2022 10:52:02 GMT+3"
                    />
                    <CollateralCard
                        value="0.00 WETH"
                        label="Collateral Ratio"
                        lastUpdate="Last Update: 23/06/2022 10:52:02 GMT+3"
                    />
                </div>
            </div>
        </div>
    );
};
