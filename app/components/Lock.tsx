"use client";
import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useStakingData } from '../hooks/useStakingData';
import { useStakingActions } from '../hooks/useStakingActions';

export const Lock = () => {
    const [isLockTab, setIsLockTab] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const { address, isConnected } = useAccount();
    const { openConnectModal } = useConnectModal();

    const {
        lockApr, userLockedTotal, userLockedUnlockable,
        walletBalance, walletBalanceFormatted, isLoading, refetch,
    } = useStakingData();

    const {
        allowance, refetchAllowance,
        approve, isApproveLoading, isApproveSuccess,
        lock, isLockLoading, isLockSuccess,
        withdrawExpiredLocks, isWithdrawExpiredLoading, isWithdrawExpiredSuccess,
    } = useStakingActions();

    // Refetch data after successful tx
    useEffect(() => {
        if (isLockSuccess || isWithdrawExpiredSuccess || isApproveSuccess) {
            refetch();
            refetchAllowance();
            if (isLockSuccess) setInputValue('');
        }
    }, [isLockSuccess, isWithdrawExpiredSuccess, isApproveSuccess]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (/^[0-9]*\.?[0-9]*$/.test(val)) setInputValue(val);
    };

    const handlePercentage = (pct: number) => {
        const val = (walletBalance * pct / 100);
        setInputValue(val.toFixed(6));
    };

    const isApproved = allowance >= parseFloat(inputValue || '0');
    const insufficientFunds = parseFloat(inputValue || '0') > walletBalance;

    // Shared styles — same as staking.tsx for consistency
    const cardBg = "relative bg-[#ffeed6] rounded-[20px] border-2 border-[#381200] shadow-[0px_9px_0px_#65ff00] p-6 sm:p-8 w-full max-w-[500px]";
    const tabActive = "[font-family:var(--font-sigmar)] font-normal text-[22px] text-[#62d732] cursor-pointer";
    const tabInactive = "[font-family:var(--font-sigmar)] font-normal text-[22px] text-black/40 cursor-pointer hover:text-black/60 transition-colors";
    const labelText = "[font-family:var(--font-poppins)] font-semibold text-[14px] text-black/50";
    const valueText = "[font-family:var(--font-sigmar)] font-normal text-[16px] text-black";
    const orangeBtn = "w-full h-[50px] rounded-[17px] bg-[#62d732] text-white [font-family:var(--font-poppins)] font-bold text-[16px] border-2 border-[#309c04] shadow-[0px_4px_0px_0px_#309c04] hover:bg-[#55c42b] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
    const pctBtn = "px-3 py-1.5 rounded-[13px] border-2 border-[#381200] bg-[#ffeed6] [font-family:var(--font-sigmar)] font-bold text-[12px] text-black hover:translate-y-0.5 transition-all";
    const maxBtn = "px-4 py-1.5 rounded-[17px] bg-[#62d732] text-white [font-family:var(--font-poppins)] font-bold text-[12px] border-2 border-[#309c04] shadow-[0px_2px_0px_0px_#309c04] hover:bg-[#55c42b] active:translate-y-0.5 active:shadow-none transition-all";
    const inputContainer = "rounded-[17px] border-2 border-[#381200] bg-white shadow-[0px_4px_0px_#381200] p-4 mb-6";
    const dataRow = "flex items-center justify-between rounded-[17px] border-2 border-[#381200] bg-white shadow-[0px_2px_0px_#381200] px-4 py-3 mb-6";

    return (
        <div className="relative w-full min-h-screen bg-transparent overflow-x-hidden flex justify-center items-start pt-[130px] pb-20">
            <div className="relative z-10 flex justify-center w-full px-4">
                <div className={cardBg}>
                    {/* Tab buttons */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsLockTab(true)}
                                className={isLockTab ? tabActive : tabInactive}>Lock</button>
                            <button onClick={() => setIsLockTab(false)}
                                className={!isLockTab ? tabActive : tabInactive}>Withdraw</button>
                        </div>
                        <div className="w-7 h-7 rounded-full border border-black/20 flex items-center justify-center cursor-help group relative">
                            <span className="text-black/40 text-sm font-bold">i</span>
                            <div className="absolute bottom-full right-0 mb-2 bg-black text-white text-xs rounded-lg px-3 py-2 w-[220px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                Includes lock balance and unlocked vestings.
                            </div>
                        </div>
                    </div>

                    {isLockTab ? (
                        /* ── LOCK TAB ── */
                        <div>
                            {/* Total Locked box */}
                            <div className={dataRow}>
                                <span className={labelText}>Total Locked</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-[30px] h-[30px] rounded-full bg-[#ffeed6] border border-[#381200] flex items-center justify-center">
                                        <img src="/dashboard-assets/Group 927.svg" alt="logo" className="w-5 h-5" />
                                    </div>
                                    <span className={valueText}>{userLockedTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Balance + APR */}
                            <div className="mt-1 space-y-2 px-1 mb-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col text-[14px] font-semibold [font-family:var(--font-poppins)] tracking-[2%] leading-[26px]">
                                        <span className="text-black/60">Balance</span>
                                        <span className="text-black/60">APR</span>
                                    </div>
                                    <div className="flex flex-col text-[14px] [font-family:var(--font-sigmar)] font-normal text-right leading-[23px] tracking-[2%]">
                                        <span className="text-black">{walletBalance.toFixed(1)} SHiELD</span>
                                        <span className="text-black">{lockApr.toFixed(2)}%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Input + percentage buttons */}
                            <div className={inputContainer}>
                                <input
                                    type="text"
                                    placeholder="0.00"
                                    value={inputValue}
                                    onChange={handleInput}
                                    className="w-full bg-transparent outline-none text-[24px] text-black [font-family:var(--font-sigmar)] placeholder:text-black/30 mb-3"
                                />
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {[10, 25, 50, 75].map(pct => (
                                            <button key={pct} className={pctBtn}
                                                onClick={() => handlePercentage(pct)}>
                                                {pct}%
                                            </button>
                                        ))}
                                    </div>
                                    <button className={maxBtn} onClick={() => handlePercentage(100)}>
                                        Max
                                    </button>
                                </div>
                            </div>

                            {/* Action button */}
                            {!isConnected ? (
                                <button className={orangeBtn} onClick={openConnectModal}>
                                    Connect wallet
                                </button>
                            ) : !isApproved ? (
                                <button className={orangeBtn} onClick={approve} disabled={isApproveLoading}>
                                    {isApproveLoading && <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
                                    Approve SHiELD
                                </button>
                            ) : insufficientFunds ? (
                                <button className={orangeBtn} disabled>Insufficient Fund</button>
                            ) : (
                                <button className={orangeBtn}
                                    disabled={!parseFloat(inputValue) || isLockLoading}
                                    onClick={() => lock(inputValue)}>
                                    {isLockLoading && <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
                                    Lock
                                </button>
                            )}
                        </div>
                    ) : (
                        /* ── WITHDRAW TAB ── */
                        <div>
                            {/* Expired Locks box */}
                            <div className={dataRow}>
                                <span className={labelText}>Total Expired Locks</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-[30px] h-[30px] rounded-full bg-[#ffeed6] border border-[#381200] flex items-center justify-center">
                                        <img src="/dashboard-assets/Group 927.svg" alt="logo" className="w-5 h-5" />
                                    </div>
                                    <span className={valueText}>{userLockedUnlockable.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Balance + APR */}
                            <div className="mt-1 space-y-2 px-1 mb-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col text-[14px] font-semibold [font-family:var(--font-poppins)] tracking-[2%] leading-[26px]">
                                        <span className="text-black/60">Balance</span>
                                        <span className="text-black/60">APR</span>
                                    </div>
                                    <div className="flex flex-col text-[14px] [font-family:var(--font-sigmar)] font-normal text-right leading-[23px] tracking-[2%]">
                                        <span className="text-black">{walletBalance.toFixed(1)} SHiELD</span>
                                        <span className="text-black">{lockApr.toFixed(2)}%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Withdraw expired locks button (no input needed — shield calls withdrawExpiredLocks() directly) */}
                            {!isConnected ? (
                                <button className={orangeBtn} onClick={openConnectModal}>
                                    Connect wallet
                                </button>
                            ) : (
                                <button className={orangeBtn}
                                    disabled={isWithdrawExpiredLoading || userLockedUnlockable <= 0}
                                    onClick={withdrawExpiredLocks}>
                                    {isWithdrawExpiredLoading && <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
                                    Withdraw Expired Locks
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
