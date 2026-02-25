"use client";

export const Box = ({ onClose }: { onClose?: () => void }) => {
    return (
        /* Overlay backdrop — clicking outside closes the modal */
        <div
            className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-[80px]"
            onClick={onClose}
        >
            {/* Card — stop clicks propagating to backdrop */}
            <div
                className="relative w-[472px] bg-[#ffeed6] rounded-[20px] shadow-2xl flex flex-col gap-4 p-6 my-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Title ── */}
                <h2 className="text-center [font-family:'Sigmar',Helvetica] font-normal text-black text-[28px] leading-tight tracking-[-0.3px]">
                    Zap into Farms
                </h2>

                {/* ── Top input box ── */}
                <div className="bg-white rounded-[17px] border-2 border-[#381200] shadow-[0px_4px_0px_#381200] px-4 pt-3 pb-3 flex flex-col gap-1">
                    {/* Amount row */}
                    <div className="flex items-center justify-between">
                        <span className="[font-family:'Sigmar',Helvetica] font-normal text-black text-3xl tracking-[-1.2px]">
                            0.00
                        </span>
                        {/* Token selector */}
                        <button className="flex items-center gap-2 bg-[#ffeed6] border-2 border-[#381200] rounded-[13px] px-3 py-1.5">
                            {/* ETH icon */}
                            <div className="w-[22px] h-[22px] rounded-full bg-[#627eea] flex items-center justify-center shrink-0">
                                <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 0L4.91602 0.295898V10.9521L5 11.0361L9.6875 8.28906L5 0Z" fill="white" fillOpacity="0.602" />
                                    <path d="M5 0L0.3125 8.28906L5 11.0361V5.90918V0Z" fill="white" />
                                    <path d="M5 11.9258L4.94385 11.9951V15.5029L5 15.6738L9.69043 9.18066L5 11.9258Z" fill="white" fillOpacity="0.602" />
                                    <path d="M5 15.6738V11.9258L0.3125 9.18066L5 15.6738Z" fill="white" />
                                    <path d="M5 11.0361L9.6875 8.28906L5 5.90918V11.0361Z" fill="white" fillOpacity="0.2" />
                                    <path d="M0.3125 8.28906L5 11.0361V5.90918L0.3125 8.28906Z" fill="white" fillOpacity="0.602" />
                                </svg>
                            </div>
                            <span className="[font-family:'Sigmar',Helvetica] font-normal text-black text-sm tracking-[-0.56px]">
                                WETHX
                            </span>
                            <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L9 1" stroke="#381200" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                    {/* Max / Balance row */}
                    <div className="flex items-center justify-between">
                        <button className="bg-[#62d732] border-2 border-[#309c03] rounded-[17px] px-4 py-0.5 [font-family:var(--font-poppins)] font-bold text-white text-[14px] leading-[1.02] tracking-[-0.04em]">
                            Max
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="[font-family:'Poppins',Helvetica] font-semibold text-black text-sm opacity-60">
                                Balance
                            </span>
                            <span className="[font-family:'Sigmar',Helvetica] font-normal text-black text-sm tracking-[-0.56px]">
                                0.004852
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Down-arrow button ── */}
                <div className="flex justify-center">
                    <button className="w-[46px] h-[46px] bg-[#62d732] border-2 border-[#309c03] shadow-[0px_4px_0px_#309c03] rounded-[17px] flex items-center justify-center active:translate-y-0.5 active:shadow-none transition-all">
                        <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 3L11 13L20 3" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {/* ── Inner info container ── */}
                <div className="bg-[#f1ddc1] rounded-[20px] border border-[#0000001a] p-5 flex flex-col gap-3">
                    {/* Slippage row */}
                    <div className="flex items-center justify-between">
                        <span className="[font-family:'Poppins',Helvetica] font-semibold text-black text-sm opacity-50 tracking-[0.28px]">
                            Slippage
                        </span>
                        {/* Token selector (inner) */}
                        <button className="flex items-center gap-2 bg-[#ffeed6] border-2 border-[#381200] rounded-[13px] px-3 py-1.5">
                            <div className="w-[22px] h-[22px] rounded-full bg-[#627eea] flex items-center justify-center shrink-0">
                                <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 0L4.91602 0.295898V10.9521L5 11.0361L9.6875 8.28906L5 0Z" fill="white" fillOpacity="0.602" />
                                    <path d="M5 0L0.3125 8.28906L5 11.0361V5.90918V0Z" fill="white" />
                                    <path d="M5 11.9258L4.94385 11.9951V15.5029L5 15.6738L9.69043 9.18066L5 11.9258Z" fill="white" fillOpacity="0.602" />
                                    <path d="M5 15.6738V11.9258L0.3125 9.18066L5 15.6738Z" fill="white" />
                                    <path d="M5 11.0361L9.6875 8.28906L5 5.90918V11.0361Z" fill="white" fillOpacity="0.2" />
                                    <path d="M0.3125 8.28906L5 11.0361V5.90918L0.3125 8.28906Z" fill="white" fillOpacity="0.602" />
                                </svg>
                            </div>
                            <span className="[font-family:'Sigmar',Helvetica] font-normal text-black text-sm tracking-[-0.56px]">
                                WETHX
                            </span>
                            <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L9 1" stroke="#381200" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    {/* WETHX / WETH pairs */}
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center justify-between">
                            <span className="[font-family:'Poppins',Helvetica] font-semibold text-black text-sm opacity-60 tracking-[0.28px]">
                                WETHX / WETH
                            </span>
                            <span className="[font-family:'Sigmar',Helvetica] font-normal text-black text-sm tracking-[0.28px] opacity-60">
                                0.000
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="[font-family:'Poppins',Helvetica] font-semibold text-black text-sm opacity-60 tracking-[0.28px]">
                                WETHX / WETH
                            </span>
                            <span className="[font-family:'Sigmar',Helvetica] font-normal text-black text-sm tracking-[0.28px] opacity-60">
                                0.000
                            </span>
                        </div>
                    </div>

                    {/* APR / Est. Daily / Price Impact headers */}
                    <div className="flex items-center justify-between">
                        <span className="[font-family:'Poppins',Helvetica] font-semibold text-black text-sm opacity-60 tracking-[0.28px]">
                            APR
                        </span>
                        <span className="[font-family:'Poppins',Helvetica] font-semibold text-black text-sm opacity-60 tracking-[0.28px]">
                            Est.Daily Income
                        </span>
                        <span className="[font-family:'Poppins',Helvetica] font-semibold text-black text-sm opacity-60 tracking-[0.28px]">
                            Price Impact
                        </span>
                    </div>

                    {/* APR / Est. Daily / Price Impact values */}
                    <div className="flex items-center justify-between">
                        <span className="[font-family:'Sigmar',Helvetica] font-normal text-black text-base tracking-[0.32px] opacity-60">
                            0.00%
                        </span>
                        <span className="[font-family:'Sigmar',Helvetica] font-normal text-black text-base tracking-[0.32px] opacity-60">
                            $0.00
                        </span>
                        <span className="[font-family:'Sigmar',Helvetica] font-normal text-black text-base tracking-[0.32px] opacity-60">
                            $0.00
                        </span>
                    </div>
                </div>

                {/* ── Minimum Received ── */}
                <div className="flex items-center justify-between px-1">
                    <span className="[font-family:'Poppins',Helvetica] font-semibold text-black text-sm opacity-50 tracking-[0.28px]">
                        Minimum Received
                    </span>
                    <span className="[font-family:'Sigmar',Helvetica] font-normal text-black text-sm tracking-[0.28px] opacity-80">
                        0.0 WETH
                    </span>
                </div>

                {/* ── Slippage buttons ── */}
                <div className="flex items-center justify-between px-1">
                    <span className="[font-family:'Poppins',Helvetica] font-semibold text-black text-sm opacity-50 tracking-[0.28px]">
                        Slippage
                    </span>
                    <div className="flex items-center gap-2">
                        <button className="bg-[#62d732] border-2 border-[#309c03] rounded-[17px] px-4 py-1 [font-family:var(--font-poppins)] font-bold text-white text-[14px] leading-[1.02] tracking-[-0.04em]">
                            0.5%
                        </button>
                        <button className="border-2 border-[#309c03] rounded-[17px] px-4 py-1 [font-family:var(--font-poppins)] font-bold text-[#626262] text-[14px] leading-[1.02] tracking-[-0.04em]">
                            0.5%
                        </button>
                        <button className="border-2 border-[#309c03] rounded-[17px] px-4 py-1 [font-family:var(--font-poppins)] font-bold text-[#626262] text-[14px] leading-[1.02] tracking-[-0.04em]">
                            0.5%
                        </button>
                    </div>
                </div>

                {/* ── Approve button ── */}
                <button className="w-full bg-[#62d732] border-2 border-[#309c03] shadow-[0px_4px_0px_#309c04] rounded-[17px] py-3 [font-family:var(--font-poppins)] font-bold text-white text-[14px] leading-[1.02] tracking-[-0.04em] active:translate-y-0.5 active:shadow-none transition-all">
                    Approve
                </button>
            </div>
        </div>
    );
};
