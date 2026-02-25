import React from 'react';

export const HeroSection = () => {
    return (
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left z-20">
            {/* Main Title */}
            <h1 className="[font-family:var(--font-sigmar)] font-normal text-white text-[50px] sm:text-[60px] md:text-[80px] tracking-[-0.04em] leading-[0.99] mb-8 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                Warriors
                <br />
                Never Die
            </h1>


            {/* Buttons Row */}
            <div className="flex gap-4 ml-[24px]">
                <button className="w-[151px] h-[46px] bg-[#62d732] rounded-[17px] border-2 border-[#309c03] shadow-[0px_4px_0px_#309c04] text-[#000000] [font-family:var(--font-poppins)] font-bold text-[14px] leading-[1.02] tracking-[-0.04em] hover:brightness-110 active:translate-y-[2px] active:shadow-[0px_2px_0px_#309c04] transition-all">
                    Connect Wallet
                </button>
                <button className="w-[151px] h-[46px] bg-[#ffeed6] rounded-[17px] border-2 border-[#1a1b1e] shadow-[0px_4px_0px_#1a1b1e] text-[#000000] [font-family:var(--font-poppins)] font-bold text-[14px] leading-[1.02] tracking-[-0.04em] hover:brightness-110 active:translate-y-[2px] active:shadow-[0px_2px_0px_#1a1b1e] transition-all">
                    Learn More
                </button>
            </div>
        </div>
    );
};
