"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Mint", href: "/mint" },
    { name: "Redeem", href: "/redeem" },
    { name: "Farms", href: "/farms" },
    { name: "Staking", href: "/staking" },
];

export const Navigation = () => {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

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
                    <Image
                        src="/dashboard-assets/Group 913.svg"
                        alt="Warrior Finance Logo"
                        width={88}
                        height={88}
                        className="h-[60px] w-[60px] md:h-[88px] md:w-[88px]"
                        priority
                    />
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
                    <button
                        className="flex-shrink-0 flex items-center justify-center rounded-[17px] border-2 border-[#309C04] bg-[#62d732] text-white shadow-[0px_4px_0px_0px_#309C04] font-poppins font-bold text-[14px] leading-[1.02] tracking-[-0.04em] hover:bg-[#55c42b] transition-all active:translate-y-1 active:shadow-none"
                        style={{ width: '150.86px', height: '45.98px' }}
                    >
                        Connect Wallet
                    </button>
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
                    <button
                        className="mt-2 flex items-center justify-center rounded-[17px] border-2 border-[#309C04] bg-[#62d732] text-white shadow-[0px_4px_0px_0px_#309C04] font-poppins font-bold text-[14px] leading-[1.02] tracking-[-0.04em] hover:bg-[#55c42b] transition-all active:translate-y-1 active:shadow-none w-[160px] h-[46px]"
                    >
                        Connect Wallet
                    </button>
                </div>
            </div>
        </nav>
    );
};
