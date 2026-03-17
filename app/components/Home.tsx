"use client";

import React, { useEffect, useState } from 'react';
import { HeroSection } from './home/HeroSection';
import { MascotPlaceholder, StatsBoard } from './home/StatsBus';
import { TokenCard } from './home/TokenCard';
import { StakingInfo } from './home/StakingInfo';
import { CollateralCard } from './home/CollateralCard';
import { useProtocolData } from '../hooks/useProtocolData';

export const Home = () => {
    const {
        bnbPrice,
        shieldPrice,
        bnbxPrice,
        guardxPrice,
        shieldCircSupply,
        bnbxCircSupply,
        guardxCircSupply,
        shieldMarketCap,
        bnbxMarketCap,
        guardxMarketCap,
        collRatio,
        twap,
        isError,
        isLoading
    } = useProtocolData();

    // Format helper for large numbers
    const formatSupply = (n: number) => {
        if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
        if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
        if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K';
        return n.toFixed(2);
    };

    const formatMarketCap = (n: number) => {
        if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
        if (n >= 1e3) return '$' + (n / 1e3).toFixed(2) + 'K';
        return '$' + n.toFixed(2);
    };

    return (
        <div className="min-h-screen bg-transparent text-white overflow-x-hidden font-sans relative">

            {/* ── SCROLLING STRIP ── */}
            <div
                className="absolute z-10 pointer-events-none"
                style={{
                    width: '1760.98px',
                    height: '45.13px',
                    background: '#F0DDC0',
                    top: '146px',
                    left: 'calc(50% - 880.49px)',
                    transform: 'rotate(-3.26deg)',
                    transformOrigin: 'center center',
                    overflow: 'hidden',
                    boxShadow: '0px -4px 0px 0px #FFEE60 inset, 0px 4px 0px 0px #00000040 inset',
                }}
            >
                <div className="absolute inset-0 flex items-center overflow-hidden">
                    <div className="animate-marquee-strip flex items-center shrink-0 whitespace-nowrap">
                        {[...Array(12)].map((_, i) => (
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
                    </div>
                </div>
            </div>

            {/* ── HERO SECTION ── */}
            <section className="relative w-full overflow-hidden min-h-[600px] lg:h-[875px]">
                <div className="relative z-20 w-full max-w-[1440px] mx-auto h-full flex flex-col lg:block items-center justify-between gap-12 py-10 lg:py-0">
                    <div className="w-full lg:absolute lg:left-[112px] lg:top-[329px] lg:w-[487px] lg:z-20 flex justify-center lg:block order-2 lg:order-none px-4 lg:px-0 pt-10 lg:pt-0">
                        <HeroSection />
                    </div>
                    <div className="w-full lg:absolute lg:left-[504px] lg:top-[184px] lg:w-[437px] lg:h-[611px] lg:z-10 flex justify-center lg:block order-1 lg:order-none relative -mt-10 lg:mt-0">
                        <MascotPlaceholder />
                    </div>
                    <div className="w-full lg:absolute lg:left-[910px] lg:top-[342px] lg:w-[389px] lg:h-[243px] lg:z-20 flex justify-center lg:block order-3 lg:order-none pt-8 lg:pt-0">
                        <StatsBoard />
                    </div>
                </div>
            </section>

            {/* ── BELOW-HERO CONTENT ── */}
            <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-[31px]">

                {/* Token Cards Row: SHIELD (left) + BNBX (right) — matches shield layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    {/* SHIELD Card */}
                    <TokenCard
                        tokenName="SHiELD"
                        price={`$${shieldPrice.toFixed(3)}`}
                        priceWeth={`${bnbPrice > 0 ? (shieldPrice / bnbPrice).toFixed(6) : '0.000000'} WBNB`}
                        circSupply={formatSupply(shieldCircSupply)}
                        marketCap={formatMarketCap(shieldMarketCap)}
                        isWror={true}
                        priceLayout="primary"
                    />
                    {/* Dropdown Card: BNBX and GUARDX */}
                    <TokenCard
                        tokenName="BNBX"
                        circSupply=""
                        marketCap=""
                        isWror={false}
                        priceLayout="primary"
                        options={[
                            {
                                tokenName: "BNBX",
                                price: `$${bnbxPrice.toFixed(2)}`,
                                priceWeth: `${bnbPrice > 0 ? (bnbxPrice / bnbPrice).toFixed(6) : '0.000000'} WBNB`,
                                circSupply: formatSupply(bnbxCircSupply),
                                marketCap: formatMarketCap(bnbxMarketCap),
                                logoSrc: "/icons/bnb.png",
                                buyLink: "https://pancakeswap.finance/swap?outputCurrency=0xcF4a682545FaBE24551101820022fF66A016207d&chain=bsc",
                                contractLink: "https://bscscan.com/address/0xcF4a682545FaBE24551101820022fF66A016207d#code",
                                symbol: "BNBX",
                                address: "0xcF4a682545FaBE24551101820022fF66A016207d"
                            },
                            {
                                tokenName: "GUARDX",
                                price: `$${guardxPrice.toFixed(4)}`, // typically needs more decimals
                                priceWeth: `${bnbPrice > 0 ? (guardxPrice / bnbPrice).toFixed(6) : '0.000000'} WBNB`,
                                circSupply: formatSupply(guardxCircSupply),
                                marketCap: formatMarketCap(guardxMarketCap),
                                logoSrc: "/icons/guard.png",
                                buyLink: "https://pancakeswap.finance/swap?outputCurrency=0xFAFeA5aC4D58c39540c188e7DEc59C4a9fA8b8Cf&chain=bsc",
                                contractLink: "https://bscscan.com/address/0xFAFeA5aC4D58c39540c188e7DEc59C4a9fA8b8Cf#code",
                                symbol: "GUARDX",
                                address: "0xFAFeA5aC4D58c39540c188e7DEc59C4a9fA8b8Cf"
                            }
                        ]}
                    />
                </div>

                {/* Staking Info Row */}
                <div className="w-full">
                    <StakingInfo />
                </div>

                {/* Collateral + TWAP */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <CollateralCard
                        value={`${(collRatio * 100).toFixed(0)} %`}
                        label="Collateral Ratio"
                        lastUpdate="Last Update: Real-time"
                    />
                    <CollateralCard
                        value={`${twap.toFixed(2)} BNB`}
                        label="60-MIN TWAP"
                        lastUpdate="Last Update: Real-time"
                    />
                </div>
            </div>
        </div>
    );
};
