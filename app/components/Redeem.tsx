"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useRedeemData, REDEEM_TOKEN_CONFIG } from '../hooks/useRedeemData';
import { useRedeemActions } from '../hooks/useRedeemActions';

const group927 = "/dashboard-assets/Group 927.svg";

export const Redeem = () => {
    const [selectedToken, setSelectedToken] = useState("BNBX");
    const [showDropdown, setShowDropdown] = useState(false);
    const [xTokenInput, setXTokenInput] = useState("");
    const [ethOutput, setEthOutput] = useState("");
    const [shieldOutput, setShieldOutput] = useState("");
    const [slippage, setSlippage] = useState(0.5);

    const { address, isConnected } = useAccount();
    const { openConnectModal } = useConnectModal();

    const {
        redeemFee, isRedeemPaused, collateralBalance,
        xBalance, xBalanceFormatted, allowance, pendingShield, pendingEth,
        collectBlock, refetchAllowance, refetchUserInfo, config,
        xTokenAddress, yTokenAddress,
        setCalcRedeemInput, calcRedeemEth, calcRedeemShield,
    } = useRedeemData(selectedToken);

    const {
        approve, isApproveLoading,
        redeem, isRedeemLoading,
        collect, isCollectLoading,
        isTxSuccess,
    } = useRedeemActions();

    // Use on-chain calcRedeem result instead of simple math
    useEffect(() => {
        if (xTokenInput && parseFloat(xTokenInput) > 0) {
            setCalcRedeemInput(xTokenInput);
        } else {
            setCalcRedeemInput('0');
        }
    }, [xTokenInput, setCalcRedeemInput]);

    useEffect(() => {
        if (xTokenInput && parseFloat(xTokenInput) > 0) {
            setEthOutput(calcRedeemEth > 0 ? calcRedeemEth.toFixed(4) : "0.0");
            setShieldOutput(calcRedeemShield > 0 ? calcRedeemShield.toFixed(4) : "0.0");
        } else {
            setEthOutput("");
            setShieldOutput("");
        }
    }, [calcRedeemEth, calcRedeemShield, xTokenInput]);

    // Refetch after successful transaction
    useEffect(() => {
        if (isTxSuccess) {
            refetchAllowance();
            refetchUserInfo();
        }
    }, [isTxSuccess]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (/^[0-9]*\.?[0-9]*$/.test(val)) setXTokenInput(val);
    };

    const handleMax = () => {
        setXTokenInput(xBalance > 0 ? xBalance.toString() : "0");
    };

    const handleTokenSelect = (token: string) => {
        setSelectedToken(token);
        setShowDropdown(false);
        setXTokenInput("");
        setEthOutput("");
        setShieldOutput("");
    };

    const isApproved = allowance >= parseFloat(xTokenInput || '0');
    const insufficientFunds = parseFloat(xTokenInput || '0') > xBalance;

    const minEthOut = ethOutput
        ? (parseFloat(ethOutput) - parseFloat(ethOutput) * (slippage / 100)).toFixed(4)
        : "0.0";
    const minShieldOut = shieldOutput
        ? (parseFloat(shieldOutput) - parseFloat(shieldOutput) * (slippage / 100)).toFixed(4)
        : "0.0";

    const handleRedeem = async () => {
        try {
            await redeem(config.poolAddress, xTokenInput, minShieldOut, minEthOut);
            refetchUserInfo();
            setXTokenInput("");
        } catch (e) { }
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handler = () => showDropdown && setShowDropdown(false);
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, [showDropdown]);

    return (
        <div className="relative w-full min-h-screen bg-transparent overflow-x-hidden flex justify-center items-start pt-[130px] pb-20">

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
                            <input
                                type="text"
                                placeholder="0.00"
                                value={xTokenInput}
                                onChange={handleInput}
                                className="text-[28px] [font-family:var(--font-sigmar)] font-bold text-black leading-[118%] tracking-[-4%] bg-transparent outline-none w-[60%]"
                            />
                            {/* Token dropdown */}
                            <div className="relative" onClick={(e) => e.stopPropagation()}>
                                <div
                                    className="flex items-center gap-2 bg-[#ffeed6] border-2 border-[#381200] rounded-[13px] px-3 py-2 cursor-pointer hover:translate-y-0.5 active:translate-y-1 transition-all"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    <div className="w-[25px] h-[25px] rounded-full overflow-hidden bg-[#200c15] flex items-center justify-center">
                                        <Image src={group927} alt="token" width={25} height={25} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-[14px] [font-family:var(--font-sigmar)] font-bold text-black leading-[99%] tracking-[-4%]">{config.xTokenSymbol}</span>
                                    <svg width="13" height="9" viewBox="0 0 13 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L6.5 7.5L12 1" stroke="black" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                                {showDropdown && (
                                    <div className="absolute right-0 top-full mt-1 bg-[#ffeed6] border-2 border-[#381200] rounded-[13px] overflow-hidden z-50 min-w-[130px]">
                                        {Object.entries(REDEEM_TOKEN_CONFIG).map(([key, cfg]) => (
                                            <button
                                                key={key}
                                                onClick={() => handleTokenSelect(key)}
                                                className={`w-full px-3 py-2 text-left text-[14px] [font-family:var(--font-sigmar)] font-bold text-black hover:bg-white/50 transition-all ${selectedToken === key ? 'bg-white/30' : ''}`}
                                            >
                                                {cfg.xTokenSymbol}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <button
                                onClick={handleMax}
                                className="h-[32px] bg-[#62d732] border-2 border-[#309c04] rounded-[17px] px-3 text-white text-[14px] [font-family:var(--font-poppins)] font-bold leading-[1.02] tracking-[-0.04em] transition-all uppercase flex items-center justify-center"
                            >
                                Max
                            </button>
                            <div className="text-right flex items-center gap-2">
                                <span className="text-black/50 text-[13px] font-bold [font-family:var(--font-poppins)] tracking-[2%]">Balance</span>
                                <span className="text-black text-[15px] [font-family:var(--font-sigmar)] font-bold tracking-[-4%]">{xBalanceFormatted}</span>
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

                    {/* ── Output Row 1 (Output Token) ── */}
                    <div className="relative bg-white border-2 border-[#381200] rounded-[17px] px-4 py-3 flex justify-between items-center h-[68px] mb-[21px]">
                        <span className="text-[28px] [font-family:var(--font-sigmar)] font-bold text-black leading-[118%] tracking-[-4%]">
                            {ethOutput || "0.00"}
                        </span>
                        <div className="flex items-center gap-2 bg-[#ffeed6] border-2 border-[#381200] rounded-[13px] px-3 py-2">
                            <div className="w-[25px] h-[25px] rounded-full overflow-hidden bg-[#200c15] flex items-center justify-center">
                                <Image src={group927} alt="token" width={25} height={25} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-[14px] [font-family:var(--font-sigmar)] font-bold text-black leading-[99%] tracking-[-4%]">{config.outputTokenSymbol}</span>
                        </div>
                    </div>

                    {/* Group 967 – "+" separator */}
                    <div className="relative flex justify-center z-20 -my-[23px]">
                        <Image
                            src="/dashboard-assets/Group 967.svg"
                            alt="plus"
                            width={50}
                            height={46}
                            className="cursor-pointer hover:scale-105 transition-transform -translate-y-[10px]"
                        />
                    </div>

                    {/* ── Output Row 2 (Shield Token) ── */}
                    <div className="relative bg-white border-2 border-[#381200] rounded-[17px] px-4 py-3 flex justify-between items-center h-[68px] mb-5">
                        <span className="text-[28px] [font-family:var(--font-sigmar)] font-bold text-black leading-[118%] tracking-[-4%]">
                            {shieldOutput || "0.00"}
                        </span>
                        <div className="flex items-center gap-2 bg-[#ffeed6] border-2 border-[#381200] rounded-[13px] px-3 py-2">
                            <div className="w-[25px] h-[25px] rounded-full overflow-hidden bg-[#200c15] flex items-center justify-center">
                                <Image src={group927} alt="token" width={25} height={25} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-[14px] [font-family:var(--font-sigmar)] font-bold text-black leading-[99%] tracking-[-4%]">{config.shieldSymbol}</span>
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
                                <span className="text-black">{redeemFee} %</span>
                                <span className="text-black">{collateralBalance.toFixed(5)} {config.outputTokenSymbol}</span>
                                <span className="text-black">{minEthOut} {config.outputTokenSymbol}</span>
                            </div>
                        </div>
                    </div>

                    {/* ── Slippage Section ── */}
                    <div className="mt-4 flex items-center justify-between px-1">
                        <span className="text-[14px] font-semibold [font-family:var(--font-poppins)] tracking-[2%] leading-[26px] text-black/60">Slippage</span>
                        <div className="flex gap-2.5">
                            {[0.5, 1, 2].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSlippage(s)}
                                    className={`w-[62px] h-[34px] ${slippage === s ? 'bg-[#62d732] text-white' : 'bg-transparent text-[#309c04]'} border-2 border-[#309c04] rounded-[17px] text-[14px] [font-family:var(--font-poppins)] font-bold leading-[1.02] tracking-[-0.04em] flex items-center justify-center transition-all hover:scale-105 active:translate-y-1`}
                                >
                                    {s}%
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Action Button ── */}
                    {!isConnected ? (
                        <button
                            onClick={openConnectModal}
                            className="mt-6 mb-1 w-full h-[58px] bg-[#62d732] border-2 border-[#309c04] rounded-[17px] text-white text-[14px] [font-family:var(--font-poppins)] font-bold leading-[1.02] tracking-[-0.04em] transition-all hover:translate-y-0.5"
                        >
                            Connect Wallet
                        </button>
                    ) : !isApproved ? (
                        <button
                            onClick={() => xTokenAddress && approve(xTokenAddress, config.poolAddress)}
                            disabled={isApproveLoading}
                            className="mt-6 mb-1 w-full h-[58px] bg-[#62d732] border-2 border-[#309c04] rounded-[17px] text-white text-[14px] [font-family:var(--font-poppins)] font-bold leading-[1.02] tracking-[-0.04em] transition-all hover:translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isApproveLoading && <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
                            Approve
                        </button>
                    ) : insufficientFunds ? (
                        <button
                            disabled
                            className="mt-6 mb-1 w-full h-[58px] bg-[#62d732] border-2 border-[#309c04] rounded-[17px] text-white text-[14px] [font-family:var(--font-poppins)] font-bold leading-[1.02] tracking-[-0.04em] transition-all opacity-50"
                        >
                            Insufficient Funds
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleRedeem}
                                disabled={!parseFloat(xTokenInput) || isRedeemLoading}
                                className="mt-6 mb-1 w-full h-[58px] bg-[#62d732] border-2 border-[#309c04] rounded-[17px] text-white text-[14px] [font-family:var(--font-poppins)] font-bold leading-[1.02] tracking-[-0.04em] transition-all hover:translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isRedeemLoading && <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
                                Redeem {config.xTokenSymbol}
                            </button>
                            {(pendingShield > 0 || pendingEth > 0) && (
                                <button
                                    onClick={() => collect(config.poolAddress)}
                                    disabled={isCollectLoading}
                                    className="mt-2 w-full h-[50px] bg-[#62d732] border-2 border-[#309c04] rounded-[17px] text-white text-[14px] [font-family:var(--font-poppins)] font-bold leading-[1.02] tracking-[-0.04em] transition-all hover:translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isCollectLoading && <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
                                    Collect{" "}
                                    {pendingEth.toFixed(4)} {config.outputTokenSymbol}
                                    {pendingShield > 0 ? ` & ${pendingShield.toFixed(4)} ${config.shieldSymbol}` : ""}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
