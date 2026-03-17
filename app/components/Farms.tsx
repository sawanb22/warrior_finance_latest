"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { formatUnits, parseUnits } from "viem";
import { useProtocolData } from "../hooks/useProtocolData";
import { useFarmData } from "../hooks/useFarmData";
import { useFarmActions } from "../hooks/useFarmActions";
import { Box } from "./zapintofarms";

const logoIcon = "/dashboard-assets/Group 927.svg";

const fmt = (n: number, d = 2) =>
  isNaN(n) || !isFinite(n)
    ? "0"
    : n.toLocaleString("en-US", { maximumFractionDigits: d });

/* ─── Pool configuration (mirrors old shield Data.js) ─── */
const POOLS = [
  { title: "BNBX / BNB", img1: "/dashboard-assets/Group 927.svg", img2: "/icons/bnb.png", hasZap: true, chefIndex: 0 },
  { title: "BNB / SHiELD", img1: "/dashboard-assets/Group 927.svg", img2: "/icons/bnb.png", hasZap: true, chefIndex: 1 },
  { title: "BNBX / SHiELD", img1: "/dashboard-assets/Group 927.svg", img2: "/icons/bnb.png", hasZap: true, chefIndex: 2 },
  { title: "GUARD / GUARDX", img1: "/icons/guard.png", img2: "/icons/guard.png", hasZap: true, chefIndex: 3 },
  { title: "BNBX / GUARDX", img1: "/icons/bnb.png", img2: "/icons/guard.png", hasZap: true, chefIndex: 4 },
  { title: "ANDY / ANDYX", img1: "/icons/andy.png", img2: "/icons/andy.png", hasZap: true, chefIndex: 5 },
];

/* ─── Shared styles ─── */
const sigmar = "[font-family:'Sigmar',Helvetica] font-normal";
const poppins = "[font-family:'Poppins',Helvetica]";
const greenBtn =
  "bg-[#62d732] border-2 border-[#309c03] shadow-[0px_4px_0px_#309c03] rounded-[17px] [font-family:var(--font-poppins)] font-bold text-white text-[14px] leading-[1.02] tracking-[-0.04em] active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50";
const cardBg = "bg-[#f1ddc1] rounded-[20px] border border-[#4100001a] p-7";
const innerBox = "flex-1 bg-[#ffeed6] rounded-[24px] p-6 border border-[#4100000a]";
const innerInputArea =
  "bg-white rounded-[15px] border-2 border-[#381200] p-4 my-4 flex justify-between items-center";
const pctBtn =
  "bg-[#f0f0f0] rounded-[8px] px-2 py-1 text-[11px] font-bold text-black/70 hover:bg-[#e0e0e0] transition-all";
const maxBtn =
  "bg-[#f0f0f0] rounded-[8px] px-2 py-1 text-[11px] font-bold text-black hover:bg-[#e0e0e0] transition-all ml-1";
const imgCircle =
  "w-[40px] h-[40px] rounded-full bg-[#ffeed6] border border-[#0000001a] overflow-hidden flex items-center justify-center shrink-0";
const imgCircleDark =
  "w-[40px] h-[40px] rounded-full bg-[#200c15] border border-[#381200] overflow-hidden flex items-center justify-center shrink-0";

/* ─── Per-pool FarmCard ─── */
const FarmCard = ({
  poolIndex,
  pool,
  shieldPrice,
  rewardPerSecond,
  totalAllocPoint,
}: {
  poolIndex: number;
  pool: (typeof POOLS)[number];
  shieldPrice: number;
  rewardPerSecond: number;
  totalAllocPoint: number;
}) => {
  const [expanded, setExpanded] = useState(poolIndex === 0);
  const [depositValue, setDepositValue] = useState("");
  const [withdrawValue, setWithdrawValue] = useState("");
  const [isZapOpen, setIsZapOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const {
    lpTokenAddr,
    deposited,
    pending,
    walletLpBalance,
    walletLpFormatted,
    allowance,
    refetch,
    refetchAllowance,
  } = useFarmData(poolIndex);

  const {
    approveLp, isApproveLoading, isApproveSuccess,
    deposit, isDepositLoading, isDepositSuccess,
    withdraw, isWithdrawLoading, isWithdrawSuccess,
    harvest, isHarvestLoading, isHarvestSuccess,
  } = useFarmActions();

  // Refetch on success
  useEffect(() => {
    if (isDepositSuccess || isWithdrawSuccess || isHarvestSuccess || isApproveSuccess) {
      refetch();
      refetchAllowance();
      if (isDepositSuccess) setDepositValue("");
      if (isWithdrawSuccess) setWithdrawValue("");
    }
  }, [isDepositSuccess, isWithdrawSuccess, isHarvestSuccess, isApproveSuccess]);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: string) => void
  ) => {
    const val = e.target.value;
    if (/^[0-9]*\.?[0-9]*$/.test(val)) setter(val);
  };

  const handlePct = (
    pct: number,
    balance: number,
    setter: (v: string) => void
  ) => {
    setter(((balance * pct) / 100).toFixed(18));
  };

  const isApproved = allowance >= parseFloat(depositValue || "0");
  const insufficientDeposit = parseFloat(depositValue || "0") > walletLpBalance;
  const insufficientWithdraw =
    parseFloat(withdrawValue || "0") > deposited;

  // Very rough per-day SHiELD per pool (for display)
  const perDayShield =
    totalAllocPoint > 0
      ? (rewardPerSecond * 86400 * 1) // very rough, we don't have allocPoint per pool here yet
      : 0;

  return (
    <div className={`${cardBg} !p-0`}>
      {/* ─── Accordion Header ─── */}
      <div
        className="w-full flex items-center justify-between p-7 gap-5 cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 flex-grow">
          {/* Pool token icons */}
          <div className="flex -space-x-2">
            <div className="z-10 rounded-full w-[40px] h-[40px]">
              <Image src={pool.img1} alt="" width={40} height={40} className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="z-0 rounded-full w-[40px] h-[40px]">
              <Image src={pool.img2} alt="" width={40} height={40} className="w-full h-full object-cover rounded-full" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3
                className={`${poppins} text-black text-[18px] font-semibold leading-[27px] tracking-[0.02em]`}
              >
                {pool.title}
              </h3>
              {pool.hasZap && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZapOpen(true);
                  }}
                  className="flex items-center gap-1.5 bg-[#62d732] border-2 border-[#309c03] shadow-[0px_4px_0px_#309c03] text-white text-[14px] font-bold px-4 py-1.5 rounded-full hover:brightness-110 active:translate-y-0.5 active:shadow-none transition-all [font-family:var(--font-poppins)] leading-tight"
                >
                  <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 1L1 9H6.5L5.5 15L12 7H6.5L7.5 1Z" fill="white" stroke="white" strokeWidth="1.2" strokeLinejoin="round" />
                  </svg>
                  Zap
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats row (hidden on mobile) */}
        <div className="hidden lg:flex items-center justify-between border-2 border-[#381200] shadow-[0px_4px_0px_#381200] rounded-[20px] px-8 py-3 w-full max-w-[650px] gap-6">
          <div className="flex items-center gap-2">
            <span className={`${poppins} text-black/50 text-[13px] font-bold uppercase`}>TVL</span>
            <p className={`${sigmar} text-black text-[18px] leading-none mb-0`}>
              0.0
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`${poppins} text-black/50 text-[13px] font-bold uppercase`}>Deposited</span>
            <p className={`${sigmar} text-black text-[18px] leading-none mb-0`}>
              {fmt(deposited, 3)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`${poppins} text-black/50 text-[13px] font-bold uppercase`}>Earn</span>
            <p className={`${sigmar} text-black text-[18px] leading-none mb-0`}>
              {fmt(pending, 4)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`${poppins} text-black/50 text-[13px] font-bold uppercase`}>APR</span>
            <p className={`${sigmar} text-black text-[18px] leading-none mb-0`}>
              175%
            </p>
          </div>
        </div>

        {/* Collapse arrow */}
        <div
          className={`w-[44px] h-[40px] rounded-[15px] bg-[#62d732] border-2 border-[#309c04] shadow-[0px_4px_0px_#309c04] flex items-center justify-center shrink-0 transition-transform active:translate-y-[3px] active:shadow-none ${expanded ? "rotate-180" : ""}`}
        >
          <svg
            width="20"
            height="12"
            viewBox="0 0 20 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 2L10 10L18 2"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Stats on mobile (always visible) */}
      <div className="flex lg:hidden px-5 pb-3 gap-4 flex-wrap">
        <div>
          <span className={`${poppins} text-black/50 text-xs font-semibold`}>Deposited</span>
          <p className={`${poppins} text-black text-sm font-semibold mb-0`}>{fmt(deposited, 3)}</p>
        </div>
        <div>
          <span className={`${poppins} text-black/50 text-xs font-semibold`}>Earned</span>
          <p className={`${poppins} text-black text-sm font-semibold mb-0`}>{fmt(pending, 4)}</p>
        </div>
      </div>

      {/* ─── Expanded Panel ─── */}
      {expanded && (
        <div className="bg-[#f1ddc1] rounded-b-[20px] p-7 pt-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* ─── Deposit ─── */}
            <div className={innerBox}>
              <div className="flex justify-between items-end mb-2">
                <p className={`${sigmar} text-black text-[22px] mb-0 leading-none`}>
                  Deposit
                </p>
                <span className={`${poppins} text-black/50 font-semibold text-[13px] leading-none`}>
                  Balance <span className="font-bold text-black">{fmt(walletLpBalance, 4)}</span>
                </span>
              </div>
              <div className={innerInputArea}>
                <input
                  type="text"
                  placeholder="Enter Amount"
                  value={depositValue}
                  onChange={(e) => handleInput(e, setDepositValue)}
                  className="text-black font-extrabold text-[16px] bg-transparent outline-none flex-grow min-w-0"
                />
              </div>
              <div className="flex gap-1 justify-center mb-4">
                {[10, 25, 50, 75].map((p) => (
                  <button
                    key={p}
                    className={pctBtn}
                    onClick={() => handlePct(p, walletLpBalance, setDepositValue)}
                  >
                    {p}%
                  </button>
                ))}
                <button
                  className={maxBtn}
                  onClick={() =>
                    setDepositValue(
                      walletLpBalance > 0 ? walletLpBalance.toFixed(18) : "0"
                    )
                  }
                >
                  Max
                </button>
              </div>
              {!isConnected ? (
                <button
                  className={`${greenBtn} py-3 w-full mt-2`}
                  onClick={openConnectModal}
                >
                  Connect Wallet
                </button>
              ) : !isApproved ? (
                <button
                  className={`${greenBtn} py-3 w-full mt-2 flex items-center justify-center gap-2`}
                  disabled={isApproveLoading || !lpTokenAddr}
                  onClick={() => lpTokenAddr && approveLp(lpTokenAddr)}
                >
                  {isApproveLoading && (
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  )}
                  Approve
                </button>
              ) : insufficientDeposit ? (
                <button className={`${greenBtn} py-3 w-full mt-2 opacity-50`} disabled>
                  Insufficient Balance
                </button>
              ) : (
                <button
                  className={`${greenBtn} py-3 w-full mt-2 flex items-center justify-center gap-2`}
                  disabled={
                    !parseFloat(depositValue) || isDepositLoading
                  }
                  onClick={() => deposit(poolIndex, depositValue)}
                >
                  {isDepositLoading && (
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  )}
                  Deposit
                </button>
              )}
            </div>

            {/* ─── Withdraw ─── */}
            <div className={innerBox}>
              <div className="flex justify-between items-end mb-2">
                <p className={`${sigmar} text-black text-[22px] mb-0 leading-none`}>
                  Withdraw
                </p>
                <span className={`${poppins} text-black/50 font-semibold text-[13px] leading-none`}>
                  Balance <span className="font-bold text-black">{fmt(deposited, 4)}</span>
                </span>
              </div>
              <div className={innerInputArea}>
                <input
                  type="text"
                  placeholder="Enter Amount"
                  value={withdrawValue}
                  onChange={(e) => handleInput(e, setWithdrawValue)}
                  className="text-black font-extrabold text-[16px] bg-transparent outline-none flex-grow min-w-0"
                />
              </div>
              <div className="flex gap-1 justify-center mb-4">
                {[10, 25, 50, 75].map((p) => (
                  <button
                    key={p}
                    className={pctBtn}
                    onClick={() => handlePct(p, deposited, setWithdrawValue)}
                  >
                    {p}%
                  </button>
                ))}
                <button
                  className={maxBtn}
                  onClick={() =>
                    setWithdrawValue(deposited > 0 ? deposited.toFixed(18) : "0")
                  }
                >
                  Max
                </button>
              </div>
              {!isConnected ? (
                <button
                  className={`${greenBtn} py-3 w-full mt-2`}
                  onClick={openConnectModal}
                >
                  Connect Wallet
                </button>
              ) : insufficientWithdraw ? (
                <button className={`${greenBtn} py-3 w-full mt-2 opacity-50`} disabled>
                  Insufficient Deposited
                </button>
              ) : (
                <button
                  className={`${greenBtn} py-3 w-full mt-2 flex items-center justify-center gap-2`}
                  disabled={
                    !parseFloat(withdrawValue) || isWithdrawLoading
                  }
                  onClick={() => withdraw(poolIndex, withdrawValue)}
                >
                  {isWithdrawLoading && (
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  )}
                  Withdraw
                </button>
              )}
            </div>

            {/* ─── Rewards ─── */}
            <div className={innerBox}>
              <div className="flex justify-between items-end mb-2">
                <p className={`${sigmar} text-black text-[22px] mb-0 leading-none`}>
                  Reward
                </p>
                <span className={`${poppins} text-black/50 font-semibold text-[13px] leading-none`}>
                  Balance <span className="font-bold text-black">{fmt(deposited, 4)}</span>
                </span>
              </div>

              <div className="mt-8 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-[45px] h-[45px] rounded-full drop-shadow-md flex items-center justify-center">
                    <Image src={pool.img1} alt="" width={45} height={45} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`${sigmar} text-black text-[22px] leading-none mb-0`}>{fmt(pending, 4)}</p>
                      <p className={`${poppins} text-black/90 font-bold text-[12px] leading-none mt-1`}>WROR</p>
                    </div>
                  </div>
                </div>

                <button
                  className={`${greenBtn} py-2 px-8 ml-4`}
                  disabled={!pending || isHarvestLoading || !isConnected}
                  onClick={() => harvest(poolIndex)}
                >
                  {isHarvestLoading && (
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  )}
                  Claim
                </button>
              </div>

              <div className="flex justify-between items-center mt-12 w-full px-2">
                <a href={`https://pancakeswap.finance/v2/add/`} target="_blank" className={`${sigmar} text-[#62d732] text-[14px] hover:underline`}>Add LP</a>
                <a href={`https://pancakeswap.finance/v2/remove/`} target="_blank" className={`${sigmar} text-[#62d732] text-[14px] hover:underline`}>Remove LP</a>
              </div>
            </div>
          </div>
        </div>
      )}
      {isZapOpen && <Box onClose={() => setIsZapOpen(false)} pool={pool} poolIndex={poolIndex} lpTokenAddr={lpTokenAddr} />}
    </div>
  );
};

/* ─── Main Farms Component ─── */
export const Farms = () => {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const {
    shieldPrice,
    rewardPerSecond: _rewardPerSecond,
  } = useProtocolData();

  const rewardPerSecond = _rewardPerSecond || 0;
  const totalAllocPoint = 0; // will be calculated per pool

  // Aggregate pending rewards across specific active pools (0, 1, 3, 4, 5)
  const pool0 = useFarmData(0);
  const pool1 = useFarmData(1);
  const pool3 = useFarmData(3);
  const pool4 = useFarmData(4);
  const pool5 = useFarmData(5);
  const totalPending =
    pool0.pending + pool1.pending + pool3.pending + pool4.pending + pool5.pending;

  const {
    harvestAll, isHarvestAllLoading, isHarvestAllSuccess,
  } = useFarmActions();

  useEffect(() => {
    if (isHarvestAllSuccess) {
      pool0.refetch();
      pool1.refetch();
      pool3.refetch();
      pool4.refetch();
      pool5.refetch();
    }
  }, [isHarvestAllSuccess]);

  return (
    <div className="relative w-full min-h-screen bg-transparent overflow-x-hidden flex justify-center items-start pt-[160px] pb-24 px-4 text-black">
      <div className="relative z-10 w-full max-w-[1450px]">
        {/* ─── Total Rewards Bar ─── */}
        <div
          className={`${cardBg} mb-8 flex flex-col sm:flex-row items-center justify-between gap-5 max-w-[1015px] mx-auto`}
        >
          <div className="flex items-center gap-4">
            <span className={`${sigmar} text-black text-[22px] leading-none tracking-tight`}>
              Total Rewards
            </span>
            <div className="w-[45px] h-[45px] rounded-full bg-[#ffeed6] border border-[#0000001a] flex items-center justify-center shadow-sm">
              <Image src={logoIcon} alt="" width={30} height={30} />
            </div>
            <span className={`${sigmar} text-black text-[24px] leading-none tracking-[-0.04em]`}>
              {fmt(totalPending, 4)} SHiELD
            </span>
          </div>
          <button
            className={`${greenBtn} py-3 px-6`}
            disabled={totalPending <= 0 || isHarvestAllLoading || !isConnected}
            onClick={async () => {
              if (!isConnected) {
                openConnectModal?.();
                return;
              }
              try {
                await harvestAll();
              } catch (e) { }
            }}
          >
            {isHarvestAllLoading && (
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block mr-1" />
            )}
            Claim All
          </button>
        </div>

        {/* ─── Farm Cards ─── */}
        <div className="space-y-6">
          {POOLS.map((pool, i) => (
            <FarmCard
              key={i}
              poolIndex={pool.chefIndex}
              pool={pool}
              shieldPrice={shieldPrice}
              rewardPerSecond={rewardPerSecond}
              totalAllocPoint={totalAllocPoint}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
