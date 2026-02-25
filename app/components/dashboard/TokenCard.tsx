import React from 'react';

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
}

export const TokenCard: React.FC<TokenCardProps> = ({
    tokenName,
    price,
    priceValue,
    priceWeth,
    circSupply,
    marketCap,
    isWror,
    logoSrc,
    priceLayout,
}) => {
    // Split "0.00 WETH" into number + unit for mixed sizing
    const splitVal = (val?: string) => {
        if (!val) return { num: '', unit: '' };
        const parts = val.trim().split(' ');
        return parts.length > 1
            ? { num: parts[0], unit: parts.slice(1).join(' ') }
            : { num: val, unit: '' };
    };
    const priceWethSplit = splitVal(priceWeth);

    return (
        <div className="rounded-[24px] bg-[#65ff00] pb-[8px]">
            <div className="rounded-[24px] border-2 border-[#d9c9a8] px-5 pt-5 pb-5 flex flex-col gap-5 bg-[linear-gradient(to_bottom,#FFEED6_115px,#F1DDC1_115px)] min-h-[276px] w-full">

                {/* ── Row 1: Icon / Name + Price Box ── */}
                <div className="flex items-center justify-between gap-4">

                    {/* Left: token icon + name */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <img
                            src={logoSrc ?? (isWror ? "/dashboard-assets/Group 814.svg" : "/dashboard-assets/Group 908.svg")}
                            alt={tokenName}
                            className="w-[72px] h-[72px] object-contain flex-shrink-0"
                        />
                        <div className="flex flex-col">
                            <span className={sigmarVal} style={{ ...sigmarStyle, fontSize: '24px', lineHeight: '1.1' }}>
                                {tokenName}
                            </span>
                            <a href="#" className="[font-family:var(--font-poppins)] font-bold text-[#226d29] text-[14px] tracking-[0.01em] hover:underline">
                                View Contract
                            </a>
                        </div>
                    </div>

                    {/* Right: Price box — fixed 243×80 per design */}
                    <div className="bg-[#FFEED6] rounded-[20px] overflow-hidden border-2 border-[#381200] shadow-[0px_4px_0px_#381200] px-4 py-2.5 w-[243px] h-[80px] flex-shrink-0 flex flex-col justify-start">
                        {(priceLayout === 'primary' || (priceLayout === undefined && isWror)) ? (
                            /* Primary: "Price" left (grey) + "~ $0.00" right (bold black), then 0.00 (Sigmar) WETH (small grey) */
                            <>
                                <div className="flex justify-between items-start">
                                    <span className={poppinsSmall} style={poppinsSmallStyle}>Price</span>
                                    <span className="[font-family:var(--font-poppins)] font-bold text-black text-[13px] leading-[1.0] tracking-[0.02em]">{price}</span>
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
                                    <span className={sigmarVal} style={{ ...sigmarStyle, lineHeight: '1.0' }}>{priceWeth}</span>
                                    {priceValue && (
                                        <span className={poppinsSmall} style={{ ...poppinsSmallStyle, marginTop: '10px' }}>{priceValue}</span>
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
                        <span className={sigmarVal} style={sigmarStyle}>{circSupply}</span>
                    </div>
                    <div className="flex-1 bg-transparent rounded-[14px] border border-[#c4ae95] px-4 py-3 flex items-center justify-between">
                        <span className={poppinsLabel} style={poppinsStyle}>Market Cap</span>
                        <span className={sigmarVal} style={sigmarStyle}>{marketCap}</span>
                    </div>
                </div>

                {/* ── Row 3: MetaMask button + Mint + Buy WETH now ── */}
                <div className="flex items-center gap-3">
                    {/* + MetaMask — fixed width */}
                    <button className="h-[46px] w-[72px] flex items-center justify-center gap-1.5 rounded-[17px] border-2 border-[#309c04] bg-transparent hover:bg-[#62d732]/10 transition-all flex-shrink-0">
                        <span className="[font-family:var(--font-poppins)] font-bold text-[#309c04] text-[16px] leading-none">+</span>
                        <img src="/dashboard-assets/3855a550d66343e77f4059d956c760a88c5913fb.png" alt="MetaMask" className="object-contain" style={{ width: '29px', height: '24px' }} />
                    </button>

                    {/* spacer pushes Mint + Buy to the right */}
                    <div className="flex-1" />

                    {/* Mint — fixed 69×46 per design */}
                    <button
                        className="bg-[#62d732] rounded-[17px] border-2 border-[#309c03] shadow-[0px_4px_0px_#309c04] text-white hover:brightness-110 active:translate-y-[2px] active:shadow-none transition-all flex-shrink-0"
                        style={{ width: '69px', height: '46px', fontFamily: 'var(--font-poppins)', fontWeight: 700, fontSize: '14px', lineHeight: '102%', letterSpacing: '-0.04em' }}
                    >
                        Mint
                    </button>

                    {/* Buy WETH now — fixed 150×46 per design */}
                    <button
                        className="bg-[#62d732] rounded-[17px] border-2 border-[#309c03] shadow-[0px_4px_0px_#309c04] text-white hover:brightness-110 active:translate-y-[2px] active:shadow-none transition-all flex-shrink-0"
                        style={{ width: '150px', height: '46px', fontFamily: 'var(--font-poppins)', fontWeight: 700, fontSize: '14px', lineHeight: '102%', letterSpacing: '-0.04em' }}
                    >
                        Buy WETH now
                    </button>
                </div>
            </div>
        </div>
    );
};
