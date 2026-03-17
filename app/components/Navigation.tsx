"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const navItems = [
    { name: "Home", href: "/home" },
    { name: "Mint", href: "/mint" },
    { name: "Redeem", href: "/redeem" },
    { name: "Farms", href: "/farms" },
    { name: "Staking", href: "/staking" },
    { name: "Lock", href: "/lock" },
    { name: "Dashboard", href: "/dashboard" },
];

export const Navigation = () => {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        if (menuOpen) {
            document.addEventListener("mousedown", handleClick);
        }
        return () => document.removeEventListener("mousedown", handleClick);
    }, [menuOpen]);

    // Close menu if resized above breakpoint
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setMenuOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <nav ref={menuRef} className="w-full z-50 relative">
            <div className="flex items-center px-4 sm:px-6 md:px-10 lg:px-[80px] py-4 md:py-6">
                {/* LEFT — Logo */}
                <Link href="/" className="flex-shrink-0 z-50">
                    <div className="flex h-[88.03662109375px] w-[88.03662109375px] items-center justify-center rounded-full border border-[rgba(240,240,240,0.27)]">
                        <Image
                            src="/dashboard-assets/Group 913.svg"
                            alt="Warrior Finance Logo"
                            width={88}
                            height={88}
                            className="h-[88.03662109375px] w-[88.03662109375px]"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-6 lg:gap-10 ml-8 lg:ml-16">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`[font-family:var(--font-sigmar)] font-normal text-sm lg:text-base tracking-[-0.04em] transition-colors duration-200 whitespace-nowrap ${isActive ? "text-[#65ff00]" : "text-white hover:text-[#65ff00]/80"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                {/* RIGHT — Connect Wallet (desktop) */}
                <div className="ml-auto hidden md:block">
                    <ConnectButton.Custom>
                        {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                            const connected = mounted && account && chain;
                            return (
                                <div aria-hidden={!mounted} style={{ opacity: mounted ? 1 : 0, pointerEvents: mounted ? 'auto' : 'none' }}>
                                    {!connected ? (
                                        <button
                                            onClick={openConnectModal}
                                            className="flex items-center justify-center rounded-[17px] border-2 border-[#309C04] bg-[#62d732] text-white shadow-[0px_4px_0px_0px_#309C04] [font-family:var(--font-poppins)] font-bold text-[14px] leading-[1.02] tracking-[-0.04em] hover:bg-[#55c42b] transition-all active:translate-y-1 active:shadow-none"
                                            style={{ width: '150.86px', height: '45.98px' }}
                                        >
                                            Connect Wallet
                                        </button>
                                    ) : chain.unsupported ? (
                                        <button
                                            onClick={openChainModal}
                                            className="flex items-center justify-center rounded-[17px] border-2 border-[#c03304] bg-[#e84040] text-white shadow-[0px_4px_0px_0px_#c03304] [font-family:var(--font-poppins)] font-bold text-[14px] leading-[1.02] tracking-[-0.04em] hover:bg-[#d13333] transition-all active:translate-y-1 active:shadow-none"
                                            style={{ width: '150.86px', height: '45.98px' }}
                                        >
                                            Wrong Network
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={openChainModal}
                                                className="flex items-center gap-1 rounded-[17px] border-2 border-[#309C04] bg-[#62d732] text-white shadow-[0px_4px_0px_0px_#309C04] [font-family:var(--font-poppins)] font-bold text-[13px] tracking-[-0.04em] hover:bg-[#55c42b] transition-all active:translate-y-1 active:shadow-none px-3"
                                                style={{ height: '45.98px' }}
                                            >
                                                {chain.hasIcon && chain.iconUrl && (
                                                    <img src={chain.iconUrl} alt={chain.name} className="w-4 h-4 rounded-full" />
                                                )}
                                                <span className="hidden lg:inline">{chain.name}</span>
                                            </button>
                                            <button
                                                onClick={openAccountModal}
                                                className="flex items-center justify-center rounded-[17px] border-2 border-[#309C04] bg-[#62d732] text-white shadow-[0px_4px_0px_0px_#309C04] [font-family:var(--font-poppins)] font-bold text-[14px] leading-[1.02] tracking-[-0.04em] hover:bg-[#55c42b] transition-all active:translate-y-1 active:shadow-none px-4"
                                                style={{ height: '45.98px' }}
                                            >
                                                {account.displayName}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        }}
                    </ConnectButton.Custom>
                </div>

                {/* Hamburger Button (mobile/tablet) */}
                <button
                    className="ml-auto md:hidden z-50 w-10 h-10 flex flex-col items-center justify-center gap-[5px] group"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span
                        className={`block w-6 h-[3px] bg-white rounded-full transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[8px]" : ""
                            }`}
                    />
                    <span
                        className={`block w-6 h-[3px] bg-white rounded-full transition-all duration-300 ${menuOpen ? "opacity-0 scale-0" : ""
                            }`}
                    />
                    <span
                        className={`block w-6 h-[3px] bg-white rounded-full transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[8px]" : ""
                            }`}
                    />
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                style={{
                    background: 'rgba(15, 1, 20, 0.97)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: menuOpen ? '1px solid rgba(101, 255, 0, 0.15)' : 'none',
                }}
            >
                <div className="flex flex-col items-center gap-4 py-6 px-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setMenuOpen(false)}
                                className={`[font-family:var(--font-sigmar)] font-normal text-lg tracking-[-0.04em] transition-colors duration-200 py-2 ${isActive ? "text-[#65ff00]" : "text-white hover:text-[#65ff00]/80"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                    <ConnectButton.Custom>
                        {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                            const connected = mounted && account && chain;
                            return (
                                <div aria-hidden={!mounted} style={{ opacity: mounted ? 1 : 0, pointerEvents: mounted ? 'auto' : 'none' }}>
                                    {!connected ? (
                                        <button
                                            onClick={openConnectModal}
                                            className="mt-2 flex items-center justify-center rounded-[17px] border-2 border-[#309C04] bg-[#62d732] text-white shadow-[0px_4px_0px_0px_#309C04] [font-family:var(--font-poppins)] font-bold text-[14px] leading-[1.02] tracking-[-0.04em] hover:bg-[#55c42b] transition-all active:translate-y-1 active:shadow-none"
                                            style={{ width: '160px', height: '46px' }}
                                        >
                                            Connect Wallet
                                        </button>
                                    ) : chain.unsupported ? (
                                        <button
                                            onClick={openChainModal}
                                            className="mt-2 flex items-center justify-center rounded-[17px] border-2 border-[#c03304] bg-[#e84040] text-white shadow-[0px_4px_0px_0px_#c03304] [font-family:var(--font-poppins)] font-bold text-[14px] leading-[1.02] tracking-[-0.04em] hover:bg-[#d13333] transition-all active:translate-y-1 active:shadow-none"
                                            style={{ width: '160px', height: '46px' }}
                                        >
                                            Wrong Network
                                        </button>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 mt-2">
                                            <button
                                                onClick={openChainModal}
                                                className="flex items-center gap-2 rounded-[17px] border-2 border-[#309C04] bg-[#62d732] text-white shadow-[0px_4px_0px_0px_#309C04] [font-family:var(--font-poppins)] font-bold text-[13px] tracking-[-0.04em] hover:bg-[#55c42b] transition-all active:translate-y-1 active:shadow-none px-4"
                                                style={{ height: '46px', width: '160px' }}
                                            >
                                                {chain.hasIcon && chain.iconUrl && (
                                                    <img src={chain.iconUrl} alt={chain.name} className="w-4 h-4 rounded-full" />
                                                )}
                                                {chain.name}
                                            </button>
                                            <button
                                                onClick={openAccountModal}
                                                className="flex items-center justify-center rounded-[17px] border-2 border-[#309C04] bg-[#62d732] text-white shadow-[0px_4px_0px_0px_#309C04] [font-family:var(--font-poppins)] font-bold text-[14px] leading-[1.02] tracking-[-0.04em] hover:bg-[#55c42b] transition-all active:translate-y-1 active:shadow-none"
                                                style={{ width: '160px', height: '46px' }}
                                            >
                                                {account.displayName}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        }}
                    </ConnectButton.Custom>
                </div>
            </div>
        </nav>
    );
};

