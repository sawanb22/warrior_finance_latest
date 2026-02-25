"use client";

import Image from "next/image";

// Assets — icons taken from Mint page card
const group927 = "/dashboard-assets/Group 927.svg";

export const Redeem = () => {
    return (
        <div className="relative w-full min-h-screen bg-[#0f0114] overflow-x-hidden flex justify-center items-start pt-[130px] pb-20">
            {/* Background Image */}
            <div className="absolute top-0 left-0 w-full h-[875px] z-0 pointer-events-none">
                <Image
                    src="/dashboard-assets/50ec418b-ce96-451b-9b57-2fddcdbc51bf%201.png"
                    alt="Background"
                    fill
                    sizes="100vw"
                    className="object-cover object-top opacity-100"
                    priority
                />
            </div>

            {/* Main Redeem Card */}
            <div className="relative w-full max-w-[472px] z-10 px-4">
                <div className="absolute inset-0 bg-[#ffeed6] rounded-[20px] border border-[#ffeed6] shadow-[0px_9px_0px_#65ff00]" />

                <div className="relative flex flex-col px-5 sm:px-6 py-6 sm:py-8">
                    {/* Title */}
                    <h1 className="text-[30px] text-center mb-7 [font-family:var(--font-sigmar)] text-black select-none tracking-[-1%] leading-[118%]">
                        Redeem
                    </h1>

                    {/* ── Input Box (top) ── */}
                    <div className="relative bg-white border-2 border-[#381200] rounded-[17px] p-4 shadow-[0px_4px_0px_#381200] mb-5 h-[108px] flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <span className="text-[28px] [font-family:var(--font-sigmar)] font-bold text-black leading-[118%] tracking-[-4%]">0.00</span>
                            {/* Token dropdown – Mint page style */}
                            <div className="flex items-center gap-2 bg-[#ffeed6] border-2 border-[#381200] rounded-[13px] px-3 py-2 cursor-pointer hover:translate-y-0.5 active:translate-y-1 transition-all">
                                <div className="w-[25px] h-[25px] rounded-full overflow-hidden bg-[#200c15] flex items-center justify-center">
                                    <Image src={group927} alt="token" width={25} height={25} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-[14px] [font-family:var(--font-sigmar)] font-bold text-black leading-[99%] tracking-[-4%]">WROR</span>
                                <svg width="13" height="9" viewBox="0 0 13 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L6.5 7.5L12 1" stroke="black" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <button className="h-[32px] bg-[#62d732] border-2 border-[#309c04] rounded-[11px] px-3 text-white text-[12px] font-bold [font-family:var(--font-sigmar)] transition-all uppercase tracking-wider flex items-center justify-center">
                                Max
                            </button>
                            <div className="text-right flex items-center gap-2">
                                <span className="text-black/50 text-[13px] font-bold [font-family:var(--font-poppins)] tracking-[2%]">Balance</span>
                                <span className="text-black text-[15px] [font-family:var(--font-sigmar)] font-bold tracking-[-4%]">0.004852</span>
                            </div>
                        </div>
                    </div>

                    {/* ── Green Chevron Divider ── */}
                    <div className="relative flex justify-center mb-4 z-20">
                        <div className="w-[44px] h-[40px] bg-[#62d732] border-2 border-[#309c04] rounded-[15px] shadow-[0px_4px_0px_#309c04] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                            <svg width="23" height="14" viewBox="0 0 23 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 2L11.5 12L21 2" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    {/* ── Output Rows (two tokens, no dropdown) ── */}
                    {/* Output Row 1 */}
                    <div className="relative bg-white border-2 border-[#381200] rounded-[17px] px-4 py-3 flex justify-between items-center h-[68px] mb-[21px]">
                        <span className="text-[28px] [font-family:var(--font-sigmar)] font-bold text-black leading-[118%] tracking-[-4%]">0.00</span>
                        {/* Token badge – no dropdown – Mint icon style */}
                        <div className="flex items-center gap-2 bg-[#ffeed6] border-2 border-[#381200] rounded-[13px] px-3 py-2">
                            <div className="w-[25px] h-[25px] rounded-full overflow-hidden bg-[#200c15] flex items-center justify-center">
                                <Image src={group927} alt="token" width={25} height={25} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-[14px] [font-family:var(--font-sigmar)] font-bold text-black leading-[99%] tracking-[-4%]">WROR</span>
                        </div>
                    </div>

                    {/* Group 967 – "+" separator overlapping both output rows */}
                    <div className="relative flex justify-center z-20 -my-[23px]">
                        <Image
                            src="/dashboard-assets/Group 967.svg"
                            alt="plus"
                            width={50}
                            height={46}
                            className="cursor-pointer hover:scale-105 transition-transform -translate-y-[10px]"
                        />
                    </div>

                    {/* Output Row 2 */}
                    <div className="relative bg-white border-2 border-[#381200] rounded-[17px] px-4 py-3 flex justify-between items-center h-[68px] mb-5">
                        <span className="text-[28px] [font-family:var(--font-sigmar)] font-bold text-black leading-[118%] tracking-[-4%]">0.00</span>
                        <div className="flex items-center gap-2 bg-[#ffeed6] border-2 border-[#381200] rounded-[13px] px-3 py-2">
                            <div className="w-[25px] h-[25px] rounded-full overflow-hidden bg-[#200c15] flex items-center justify-center">
                                <Image src={group927} alt="token" width={25} height={25} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-[14px] [font-family:var(--font-sigmar)] font-bold text-black leading-[99%] tracking-[-4%]">WROR</span>
                        </div>
                    </div>

                    {/* ── Stats Section ── */}
                    <div className="mt-1 space-y-2 px-1">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col text-[14px] font-semibold [font-family:var(--font-poppins)] tracking-[2%] leading-[26px]">
                                <span className="text-black/60">Redeem Fee</span>
                                <span className="text-black/60">Pool Balance</span>
                                <span className="text-black/60">Minimum Received</span>
                            </div>
                            <div className="flex flex-col text-[14px] [font-family:var(--font-sigmar)] font-normal text-right leading-[23px] tracking-[2%]">
                                <span className="text-black">0.3 %</span>
                                <span className="text-black">0.02074854 WETH</span>
                                <span className="text-black">0.0 WETH</span>
                            </div>
                        </div>
                    </div>

                    {/* ── Slippage Section ── */}
                    <div className="mt-4 flex items-center justify-between px-1">
                        <span className="text-[14px] font-semibold [font-family:var(--font-poppins)] tracking-[2%] leading-[26px] text-black/60">Slippage</span>
                        <div className="flex gap-2.5">
                            <button className="w-[62px] h-[34px] bg-[#62d732] border-2 border-[#309c04] rounded-[11px] text-white text-[14px] font-semibold [font-family:var(--font-poppins)] tracking-[2%] leading-[100%] flex items-center justify-center transition-all hover:scale-105">
                                0.5%
                            </button>
                            <button className="w-[62px] h-[34px] bg-transparent border-2 border-[#309c04] rounded-[11px] text-[#309c04] text-[14px] font-semibold [font-family:var(--font-poppins)] tracking-[2%] leading-[100%] flex items-center justify-center transition-all hover:scale-105 active:translate-y-1">
                                0.5%
                            </button>
                            <button className="w-[62px] h-[34px] bg-transparent border-2 border-[#309c04] rounded-[11px] text-[#309c04] text-[14px] font-semibold [font-family:var(--font-poppins)] tracking-[2%] leading-[100%] flex items-center justify-center transition-all hover:scale-105 active:translate-y-1">
                                0.5%
                            </button>
                        </div>
                    </div>

                    {/* ── Approve Button ── */}
                    <button className="mt-6 mb-1 w-full h-[58px] bg-[#62d732] border-2 border-[#309c04] rounded-[17px] text-white text-[20px] font-bold [font-family:var(--font-poppins)] transition-all hover:translate-y-0.5">
                        Approve
                    </button>
                </div>
            </div>
        </div>
    );
};
