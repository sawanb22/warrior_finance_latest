import React, { useState, useRef, useEffect } from 'react';

// Typography helpers per spec
// Bold values/numbers: Sigmar 22px, -4% tracking, 118% line-height
const sigmarVal = "[font-family:var(--font-sigmar)] font-normal text-black" as const;
const sigmarStyle = { fontSize: '22px', letterSpacing: '-0.04em', lineHeight: '1.18' } as const;
// Labels: Poppins SemiBold 16px, +2% tracking, 100% line-height
const poppinsLabel = "[font-family:var(--font-poppins)] font-semibold text-black/50" as const;
const poppinsStyle = { fontSize: '16px', letterSpacing: '0.02em', lineHeight: '1.0' } as const;
// Small sub-label (Price header, $USD secondary)
const poppinsSmall = "[font-family:var(--font-poppins)] font-semibold text-black/50" as const;
const poppinsSmallStyle = { fontSize: '13px', letterSpacing: '0.02em', lineHeight: '1.0' } as const;

export interface TokenOption {
    tokenName: string;
    price?: string;
    priceValue?: string;
    priceWeth?: string;
    circSupply: string;
    marketCap: string;
    logoSrc: string;
    buyLink?: string;
    contractLink?: string;
    address?: string;
    symbol?: string;
}

interface TokenCardProps {
    tokenName: string;
    price?: string;
    priceValue?: string;
    priceWeth?: string;
    circSupply: string;
    marketCap: string;
    isWror?: boolean;
    logoSrc?: string;
    priceLayout?: 'primary' | 'secondary';

    // New props for dropdown
    options?: TokenOption[];
}

export const TokenCard: React.FC<TokenCardProps> = ({
    tokenName: initialTokenName,
    price: initialPrice,
    priceValue: initialPriceValue,
    priceWeth: initialPriceWeth,
    circSupply: initialCircSupply,
    marketCap: initialMarketCap,
    isWror,
    logoSrc: initialLogoSrc,
    priceLayout,
    options
}) => {
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const hasOptions = options && options.length > 0;

    const activeData = hasOptions ? options[selectedOptionIndex] : {
        tokenName: initialTokenName,
        price: initialPrice,
        priceValue: initialPriceValue,
        priceWeth: initialPriceWeth,
        circSupply: initialCircSupply,
        marketCap: initialMarketCap,
        logoSrc: initialLogoSrc ?? (isWror ? "/dashboard-assets/Group 814.svg" : "/dashboard-assets/Group 908.svg"),
        contractLink: '#',
        buyLink: '#',
        address: '',
        symbol: ''
    };

    // Split "0.00 WETH" into number + unit for mixed sizing
    const splitVal = (val?: string) => {
        if (!val) return { num: '', unit: '' };
        const parts = val.trim().split(' ');
        return parts.length > 1
            ? { num: parts[0], unit: parts.slice(1).join(' ') }
            : { num: val, unit: '' };
    };
    const priceWethSplit = splitVal(activeData.priceWeth);

    const addTokenToMetaMask = async () => {
        if (!window.ethereum || !activeData.address || !activeData.symbol) return;
        try {
            await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: activeData.address,
                        symbol: activeData.symbol,
                        decimals: 18,
                        image: window.location.origin + activeData.logoSrc,
                    },
                },
            });
        } catch (error) {
            console.error("Failed to add token to MetaMask", error);
        }
    };

    return (
        <div className="rounded-[24px] bg-[#65ff00] pb-[8px]">
            <div className="rounded-[24px] border-2 border-[#d9c9a8] px-5 pt-5 pb-5 flex flex-col gap-5 bg-[linear-gradient(to_bottom,#FFEED6_115px,#F1DDC1_115px)] min-h-[276px] w-full">

                {/* ── Row 1: Icon / Name + Price Box ── */}
                <div className="flex items-center justify-between gap-4">

                    {/* Left: token icon + name */}
                    <div
                        className={`flex items-center gap-3 flex-shrink-0 relative ${hasOptions ? 'cursor-pointer' : ''}`}
                        onClick={() => hasOptions && setIsDropdownOpen(!isDropdownOpen)}
                        ref={dropdownRef}
                    >
                        <img
                            src={activeData.logoSrc}
                            alt={activeData.tokenName}
                            className={`w-[72px] h-[72px] object-contain flex-shrink-0 ${hasOptions ? 'bg-black rounded-full p-2' : ''}`}
                        />
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className={sigmarVal} style={{ ...sigmarStyle, fontSize: '24px', lineHeight: '1.1' }}>
                                    {activeData.tokenName}
                                </span>
                                {hasOptions && (
                                    <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                                        <path d="M1.93359 2.44482L8.74201 9.75756L14.9092 2.44482" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>
                            <a href={(hasOptions ? activeData.contractLink : "#")} target="_blank" rel="noreferrer" className="[font-family:var(--font-poppins)] font-bold text-[#226d29] text-[14px] tracking-[0.01em] hover:underline" onClick={(e) => hasOptions && e.stopPropagation()}>
                                View Contract
                            </a>
                        </div>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && hasOptions && (
                            <div className="absolute top-full left-[2px] mt-2 w-[220px] bg-[#FFEED6] border border-black rounded-[16px] overflow-hidden z-30">
                                {options.map((opt, idx) => (
                                    <div
                                        key={opt.tokenName}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#F1DDC1] cursor-pointer"
                                        onClick={() => setSelectedOptionIndex(idx)}
                                    >
                                        <img src={opt.logoSrc} alt={opt.tokenName} className="w-[42px] h-[42px] object-contain bg-black rounded-full p-1" />
                                        <span className={sigmarVal} style={{ fontSize: '18px' }}>{opt.tokenName}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Price box — fixed 243×80 per design */}
                    <div className="bg-[#FFEED6] rounded-[20px] overflow-hidden border-2 border-[#381200] shadow-[0px_4px_0px_#381200] px-4 py-2.5 w-[243px] h-[80px] flex-shrink-0 flex flex-col justify-start">
                        {(priceLayout === 'primary' || (priceLayout === undefined && isWror)) ? (
                            /* Primary: "Price" left (grey) + "~ $0.00" right (bold black), then 0.00 (Sigmar) WETH (small grey) */
                            <>
                                <div className="flex justify-between items-start">
                                    <span className={poppinsSmall} style={poppinsSmallStyle}>Price</span>
                                    <span className="[font-family:var(--font-poppins)] font-bold text-black text-[13px] leading-[1.0] tracking-[0.02em]">{activeData.price}</span>
                                </div>
                                <div className="flex items-baseline gap-1 mt-[10px]">
                                    <span className={sigmarVal} style={sigmarStyle}>{priceWethSplit.num}</span>
                                    <span className={poppinsSmall} style={{ ...poppinsSmallStyle, fontSize: '12px' }}>{priceWethSplit.unit}</span>
                                </div>
                            </>
                        ) : (
                            /* Secondary: "Price" left (centered vertical) + big WETH (Sigmar) right, $USD (small grey) below */
                            <div className="flex justify-between items-start w-full">
                                <span className={poppinsSmall} style={poppinsSmallStyle}>Price</span>
                                <div className="flex flex-col items-end justify-start">
                                    <span className={sigmarVal} style={{ ...sigmarStyle, lineHeight: '1.0' }}>{activeData.priceWeth}</span>
                                    {activeData.priceValue && (
                                        <span className={poppinsSmall} style={{ ...poppinsSmallStyle, marginTop: '10px' }}>{activeData.priceValue}</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Row 2: Circulating Supply + Market Cap ── */}
                <div className="flex gap-3">
                    <div className="flex-1 bg-transparent rounded-[14px] border border-[#c4ae95] px-4 py-3 flex items-center justify-between">
                        <span className={poppinsLabel} style={poppinsStyle}>Circulating supply</span>
                        <span className={sigmarVal} style={sigmarStyle}>{activeData.circSupply}</span>
                    </div>
                    <div className="flex-1 bg-transparent rounded-[14px] border border-[#c4ae95] px-4 py-3 flex items-center justify-between">
                        <span className={poppinsLabel} style={poppinsStyle}>Market Cap</span>
                        <span className={sigmarVal} style={sigmarStyle}>{activeData.marketCap}</span>
                    </div>
                </div>

                {/* ── Row 3: MetaMask button + Mint + Buy WETH now ── */}
                <div className="flex items-center gap-2 lg:gap-3">
                    {/* + MetaMask — fixed width */}
                    <button onClick={addTokenToMetaMask} className="h-[46px] w-[72px] flex items-center justify-center gap-1.5 rounded-[17px] border-2 border-[#309c04] bg-transparent hover:bg-[#62d732]/10 transition-all flex-shrink-0">
                        <span className="[font-family:var(--font-poppins)] font-bold text-[#309c04] text-[16px] leading-none">+</span>
                        <img src="/dashboard-assets/3855a550d66343e77f4059d956c760a88c5913fb.png" alt="MetaMask" className="object-contain" style={{ width: '29px', height: '24px' }} />
                    </button>

                    {/* spacer pushes Mint + Buy to the right */}
                    <div className="flex-1" />

                    {/* Mint — disabled if hasOptions since options usually mean user swaps them via PCS */}
                    <button
                        className="bg-[#62d732] rounded-[17px] border-2 border-[#309c03] shadow-[0px_4px_0px_#309c04] text-white hover:brightness-110 active:translate-y-[2px] active:shadow-none transition-all flex-shrink-0"
                        style={{ width: '69px', height: '46px', fontFamily: 'var(--font-poppins)', fontWeight: 700, fontSize: '14px', lineHeight: '102%', letterSpacing: '-0.04em' }}
                        onClick={() => window.location.href = '/mint'}
                    >
                        Mint
                    </button>

                    {/* Buy now — adjusted width for dynamic name */}
                    <a
                        href={hasOptions ? activeData.buyLink : '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#62d732] rounded-[17px] border-2 border-[#309c03] shadow-[0px_4px_0px_#309c04] text-white hover:brightness-110 active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center flex-shrink-0 px-4 whitespace-nowrap"
                        style={{ height: '46px', fontFamily: 'var(--font-poppins)', fontWeight: 700, fontSize: '14px', lineHeight: '102%', letterSpacing: '-0.04em' }}
                    >
                        {hasOptions ? `Buy ${activeData.tokenName} now` : 'Buy WETH now'}
                    </a>
                </div>
            </div>
        </div>
    );
};
