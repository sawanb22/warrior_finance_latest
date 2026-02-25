"use client";

import Image from "next/image";
import { useState } from "react";
import { Box as ZapModal } from "./zapintofarms";

// Assets
const group814 = "/dashboard-assets/Group 814.svg";

// Farm card data - icon1 = primary token icon, icon2 = secondary token icon
const farmData = [
  {
    icon1: group814,
    icon2: group814,
    name1: "SHLD",
    name2: "LORE",
  },
  {
    icon1: group814,
    icon2: group814,
    name1: "SHLD",
    name2: "LORE",
  },
  {
    icon1: group814,
    icon2: group814,
    name1: "SHLD",
    name2: "LORE",
  },
];

function FarmCard({
  icon1,
  icon2,
  name1,
  name2,
  defaultOpen = false,
}: {
  icon1: string;
  icon2: string;
  name1: string;
  name2: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [isZapModalOpen, setIsZapModalOpen] = useState(false);

  return (
    <div className="w-full bg-[#ffeed6] rounded-[20px] overflow-hidden shadow-[0px_6px_0px_#c49854]">
      {/* HEADER ROW */}
      <div className="flex flex-col lg:flex-row items-center gap-3 px-5 py-6 lg:py-4">
        {/* Token icon pair */}
        <div className="flex items-center shrink-0">
          <div className="w-[49px] h-[49px] rounded-full bg-[#200c15] border-2 border-[#381200] overflow-hidden flex items-center justify-center z-10 relative">
            <Image
              src={icon1}
              alt="token 1"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="w-[49px] h-[49px] rounded-full bg-[#200c15] border-2 border-[#381200] overflow-hidden flex items-center justify-center -ml-3">
            <Image
              src={icon2}
              alt="token 2"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
        </div>

        {/* Pool name */}
        <div className="[font-family:'Sigmar',Helvetica] font-normal text-black text-lg leading-[1.2] lg:w-[58px] shrink-0 text-center lg:text-left">
          {name1}
          <br />
          {name2}
        </div>

        {/* Zap button */}
        <button
          onClick={() => setIsZapModalOpen(true)}
          className="flex items-center gap-1.5 bg-[#62d732] border-2 border-[#309c03] shadow-[0px_3px_0px_#309c03] rounded-full px-4 py-1.5 shrink-0 active:translate-y-0.5 active:shadow-none transition-all"
        >
          <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 1L1 9.5H6.5L5 16L12 7.5H6.5L7.5 1Z" fill="white" stroke="white" strokeWidth="0.5" strokeLinejoin="round" />
          </svg>
          <span className="[font-family:'Poppins',Helvetica] font-bold text-white text-[13px] tracking-tight">
            Zap
          </span>
        </button>

        {/* Stats bar */}
        <div className="w-full lg:flex-1 flex flex-wrap lg:flex-nowrap items-center justify-around bg-[#ffeed6] border-2 border-[#381200] shadow-[0px_4px_0px_#381200] rounded-[17px] py-4 lg:py-2 px-4 gap-4 lg:gap-0">
          <div className="flex items-center gap-1.5 min-w-[100px] justify-center lg:justify-start">
            <span className="[font-family:'Poppins',Helvetica] font-semibold text-black text-xs opacity-50 tracking-wide">TVL</span>
            <span className="[font-family:'Sigmar',Helvetica] font-normal text-black text-xl leading-none tracking-wide">0.0</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-[100px] justify-center lg:justify-start">
            <span className="[font-family:'Poppins',Helvetica] font-semibold text-black text-xs opacity-50 tracking-wide">Deposited</span>
            <span className="[font-family:'Sigmar',Helvetica] font-normal text-black text-xl leading-none tracking-wide">0.0</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-[100px] justify-center lg:justify-start">
            <span className="[font-family:'Poppins',Helvetica] font-semibold text-black text-xs opacity-50 tracking-wide">Earn</span>
            <span className="[font-family:'Sigmar',Helvetica] font-normal text-black text-xl leading-none tracking-wide">0.0</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-[100px] justify-center lg:justify-start">
            <span className="[font-family:'Poppins',Helvetica] font-semibold text-black text-xs opacity-50 tracking-wide">APR</span>
            <span className="[font-family:'Sigmar',Helvetica] font-bold text-black text-xl leading-none tracking-wide">175%</span>
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-[46px] h-[46px] shrink-0 bg-[#62d732] border-[2.5px] border-[#309c03] shadow-[0px_4px_0px_#309c03] rounded-[17px] flex items-center justify-center active:translate-y-0.5 active:shadow-none transition-all ml-auto lg:ml-0"
        >
          {open ? (
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 13L11 3L20 13" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 3L11 13L20 3" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>

      {/* EXPANDED DETAIL PANEL */}
      {open && (
        <div className="mx-4 mb-4 bg-[#f1ddc1] rounded-[20px] p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* DEPOSIT */}
            <div className="bg-[#ffeed6] rounded-[20px] p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="[font-family:'Sigmar',Helvetica] font-normal text-black text-base">Deposit</span>
                <div className="flex items-center gap-1">
                  <span
                    className="[font-family:'Poppins',Helvetica] font-semibold text-black text-xs opacity-50"
                  >
                    Balance
                  </span>
                  <span className="[font-family:'Sigmar',Helvetica] font-normal text-black text-xs">79.61 WROR</span>
                </div>
              </div>
              <div className="bg-white border-2 border-[#381200] shadow-[0px_4px_0px_#381200] rounded-[17px] px-3 py-2.5">
                <input
                  type="text"
                  placeholder="Enter Amount"
                  className="w-full bg-transparent [font-family:'Sigmar',Helvetica] font-normal text-black text-sm placeholder:text-black placeholder:opacity-50 outline-none"
                />
              </div>
              <button className="w-full bg-[#62d732] border-2 border-[#309c03] shadow-[0px_4px_0px_#309c03] rounded-[17px] py-2.5 [font-family:var(--font-poppins)] font-bold text-white text-[14px] leading-[1.02] tracking-[-0.04em] active:translate-y-0.5 active:shadow-none transition-all">
                Connect Wallet
              </button>
            </div>

            {/* WITHDRAW */}
            <div className="bg-[#ffeed6] rounded-[20px] p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="[font-family:'Sigmar',Helvetica] font-normal text-black text-base">Withdraw</span>
                <div className="flex items-center gap-1">
                  <span
                    className="[font-family:'Poppins',Helvetica] font-semibold text-black text-xs opacity-50"
                  >
                    Balance
                  </span>
                  <span className="[font-family:'Sigmar',Helvetica] font-normal text-black text-xs">79.61 WROR</span>
                </div>
              </div>
              <div className="bg-white border-2 border-[#381200] shadow-[0px_4px_0px_#381200] rounded-[17px] px-3 py-2.5">
                <input
                  type="text"
                  placeholder="Enter Amount"
                  className="w-full bg-transparent [font-family:'Sigmar',Helvetica] font-normal text-black text-sm placeholder:text-black placeholder:opacity-50 outline-none"
                />
              </div>
              <button className="w-full bg-[#62d732] border-2 border-[#309c03] shadow-[0px_4px_0px_#309c03] rounded-[17px] py-2.5 [font-family:var(--font-poppins)] font-bold text-white text-[14px] leading-[1.02] tracking-[-0.04em] active:translate-y-0.5 active:shadow-none transition-all">
                Connect Wallet
              </button>
            </div>

            {/* REWARD */}
            <div className="bg-[#ffeed6] rounded-[20px] p-4 flex flex-col gap-3 md:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <span className="[font-family:'Sigmar',Helvetica] font-normal text-black text-base">Reward</span>
                <div className="flex items-center gap-1">
                  <span
                    className="[font-family:'Poppins',Helvetica] font-semibold text-black text-xs opacity-50"
                  >
                    Balance
                  </span>
                  <span className="[font-family:'Sigmar',Helvetica] font-normal text-black text-xs">79.61 WROR</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-[45px] h-[45px] rounded-full bg-[#200c15] border-2 border-[#381200] overflow-hidden flex items-center justify-center shrink-0">
                  <Image
                    src={icon1}
                    alt="reward token"
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="[font-family:'Sigmar',Helvetica] font-normal text-black text-xl leading-none">79.61</span>
                  <span className="[font-family:'Sigmar',Helvetica] font-normal text-black text-xs opacity-50 mt-0.5">WROR</span>
                </div>
                <button className="ml-auto bg-[#62d732] border-2 border-[#309c03] shadow-[0px_4px_0px_#309c03] rounded-[17px] px-5 py-2.5 [font-family:var(--font-poppins)] font-bold text-white text-[14px] leading-[1.02] tracking-[-0.04em] active:translate-y-0.5 active:shadow-none transition-all">
                  Claim
                </button>
              </div>

              <div className="flex items-center justify-between mt-1">
                <button className="[font-family:'Sigmar',Helvetica] font-normal text-[#40d304] text-sm hover:underline">
                  Add LP
                </button>
                <button className="[font-family:'Sigmar',Helvetica] font-normal text-[#40d304] text-sm hover:underline">
                  Remove LP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isZapModalOpen && <ZapModal onClose={() => setIsZapModalOpen(false)} />}
    </div>
  );
}

export const Farms = () => {
  return (
    <div className="relative w-full min-h-screen bg-transparent overflow-x-hidden flex justify-center items-start pt-[130px] pb-20">

      {/* PAGE CONTENT */}
      <div className="relative z-10 w-full max-w-[1085px] px-6">
        <div className="flex flex-col gap-4">
          {farmData.map((farm, i) => (
            <FarmCard
              key={i}
              icon1={farm.icon1}
              icon2={farm.icon2}
              name1={farm.name1}
              name2={farm.name2}
              defaultOpen={i === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

