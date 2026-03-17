"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { formatUnits } from "viem";
import { useRouter } from "next/navigation";
import { useStakingData } from "../hooks/useStakingData";
import { useStakingActions } from "../hooks/useStakingActions";

const logoIcon = "/dashboard-assets/Group 927.svg";

const fmt = (n: number, d = 2) =>
    isNaN(n) || !isFinite(n)
        ? "0"
        : n.toLocaleString("en-US", { maximumFractionDigits: d });

const calcRemaining = (epoch: number) => {
    const left = epoch - Math.floor(Date.now() / 1000);
    if (left <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
        days: Math.floor(left / 86400),
        hours: Math.floor((left % 86400) / 3600),
        minutes: Math.floor((left % 3600) / 60),
        seconds: left % 60,
    };
};

const sigmar = "[font-family:'Sigmar',Helvetica] font-normal";
const poppins = "[font-family:'Poppins',Helvetica]";

const greenBtn =
    "bg-[#62d732] border-2 border-[#309c03] shadow-[0px_4px_0px_#309c03] rounded-[14px] font-bold text-white active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2";

const ShieldIcon = () => (
    <div className="w-[38px] h-[38px] rounded-full bg-[#e8d5b0] border border-[#0000001a] overflow-hidden flex items-center justify-center shrink-0">
        <Image src="/dashboard-assets/Group 927.svg" alt="SHiELD" width={26} height={26} />
    </div>
);

const BnbIcon = () => (
    <div className="w-[38px] h-[38px] rounded-full bg-[#f0b90b] flex items-center justify-center shrink-0 border border-[#c88f00]">
        <span className="text-white text-[16px] font-extrabold leading-none">B</span>
    </div>
);

function useCountdowns(entries: { unlockTime: bigint }[]) {
    const [times, setTimes] = useState<ReturnType<typeof calcRemaining>[]>([]);

    // Serialize entry values to avoid infinite loops when array references change
    const serializedEntries = entries.map(e => e.unlockTime.toString()).join(',');

    useEffect(() => {
        const update = () =>
            setTimes(entries.map((e) => calcRemaining(Number(e.unlockTime))));
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serializedEntries]);
    return times;
}

export const Dashboard = () => {
    const { isConnected } = useAccount();
    const { openConnectModal } = useConnectModal();
    const router = useRouter();

    const {
        shieldPrice,
        totalStakedSupply,
        totalLockedSupply,
        claimableShield,
        claimableBnb,
        withdrawableAmount,
        earnedBalancesTotal,
        earnedBalancesEntries,
        lockedBalancesEntries,
        unclaimedVesting,
        userLockedUnlockable,
        refetch,
    } = useStakingData();

    const {
        claimRewards, isClaimLoading, isClaimSuccess,
        emergencyWithdraw, isEmergencyWithdrawLoading, isEmergencyWithdrawSuccess,
        withdrawExpiredVestings, isWithdrawExpiredVestingsLoading, isWithdrawExpiredVestingsSuccess,
    } = useStakingActions();

    useEffect(() => {
        if (isClaimSuccess || isEmergencyWithdrawSuccess || isWithdrawExpiredVestingsSuccess) refetch();
    }, [isClaimSuccess, isEmergencyWithdrawSuccess, isWithdrawExpiredVestingsSuccess]);

    const vestingTimes = useCountdowns(earnedBalancesEntries);
    const lockTimes = useCountdowns(lockedBalancesEntries);

    const stakedUsd = totalStakedSupply * shieldPrice;
    const lockedUsd = totalLockedSupply * shieldPrice;

    const cardBase = "bg-[#ffeed6] rounded-[22px] border border-[#4100001a]";

    /* Reward section: title on top, hint below it in small muted text */
    const RewardSection = ({
        title,
        hint,
        children,
        noBorder = false,
    }: {
        title: string;
        hint: string;
        children: React.ReactNode;
        noBorder?: boolean;
    }) => (
        <div className={`px-9 py-6 ${!noBorder ? "border-b border-[#4100001a]" : ""}`}>
            {/* stacked: title then hint — no wrapping ever */}
            <div className="mb-6">
                <span className={`${poppins} text-black font-bold text-[19px]`}>{title}</span>
                <p className={`${poppins} text-black/45 text-[14px] mt-1`}>{hint}</p>
            </div>
            {children}
        </div>
    );


    return (
        <div className="relative w-full min-h-screen flex justify-center items-start pt-[160px] pb-24 px-4 text-black">
            <div className="relative z-10 w-full max-w-[1450px]">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* ══════════════ LEFT COLUMN ══════════════ */}
                    <div className="flex-1 min-w-0 flex flex-col gap-6">

                        {/* Total Staked + Locked */}
                        <div className="flex flex-col sm:flex-row gap-8">

                            {/* TOTAL STAKED */}
                            <div className={`${cardBase} p-9 flex-1`}>
                                <div className="flex justify-between items-start mb-5">
                                    <h2 className={`${sigmar} text-black text-[20px] leading-none`}>Total Staked</h2>
                                    <span className="text-black/40 text-base cursor-help" title="Total SHIELD staked">ⓘ</span>
                                </div>
                                <div className="flex items-center gap-3 mb-1">
                                    <ShieldIcon />
                                    <span className={`${sigmar} text-black text-[34px] leading-none tracking-tight`}>
                                        {fmt(totalStakedSupply)}
                                    </span>
                                    <span className={`${poppins} text-black/50 text-[14px] font-semibold self-end mb-1`}>
                                        ${fmt(stakedUsd, 3)}
                                    </span>
                                </div>
                                <p className={`${poppins} text-black/50 text-[13px] mb-7`}>Total SHiELD Staked</p>
                                <button
                                    className={`${greenBtn} py-[15px] w-full text-[16px]`}
                                    onClick={() => router.push("/staking")}
                                >
                                    Stake More
                                </button>
                            </div>

                            {/* TOTAL LOCKED */}
                            <div className={`${cardBase} p-9 flex-1`}>
                                <div className="flex justify-between items-start mb-5">
                                    <h2 className={`${sigmar} text-black text-[20px] leading-none`}>Total Locked</h2>
                                    <span className="text-black/40 text-base cursor-help" title="Total SHIELD locked">ⓘ</span>
                                </div>
                                <div className="flex items-center gap-3 mb-1">
                                    <ShieldIcon />
                                    <span className={`${sigmar} text-black text-[34px] leading-none tracking-tight`}>
                                        {fmt(totalLockedSupply)}
                                    </span>
                                    <span className={`${poppins} text-black/50 text-[14px] font-semibold self-end mb-1`}>
                                        ${fmt(lockedUsd, 3)}
                                    </span>
                                </div>
                                <p className={`${poppins} text-black/50 text-[13px] mb-7`}>Total SHiELD Locked</p>
                                <button
                                    className={`${greenBtn} py-[15px] w-full text-[16px]`}
                                    onClick={() => router.push("/lock")}
                                >
                                    Lock More
                                </button>
                            </div>
                        </div>

                        {/* VESTING PANEL */}
                        <div className={`${cardBase} p-9`}>
                            <div className="flex justify-between items-center mb-5">
                                <h2 className={`${sigmar} text-black text-[20px] leading-none`}>Vesting</h2>
                                <span className="text-black/40 text-base cursor-help" title="Farm claimable rewards currently vested">ⓘ</span>
                            </div>
                            <div className="min-h-[110px] max-h-[260px] overflow-y-auto space-y-2">
                                {earnedBalancesEntries.length > 0 ? (
                                    earnedBalancesEntries.map((entry, i) => {
                                        const amt = Number(formatUnits(BigInt(entry.amount.toString()), 18));
                                        const t = vestingTimes[i];
                                        return (
                                            <div key={i} className="bg-white/50 rounded-[14px] border border-[#4100001a] px-5 py-3 flex flex-wrap items-center justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <ShieldIcon />
                                                    <span className={`${sigmar} text-black text-[26px] leading-none`}>{fmt(amt)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`${poppins} text-black/50 text-[12px]`}>Claimable in</span>
                                                    <span className={`${sigmar} text-black text-[14px]`}>
                                                        {t?.days || 0}D:{t?.hours || 0}H:{t?.minutes || 0}M:{t?.seconds || 0}S
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="flex justify-center items-center h-[90px]">
                                        <p className={`${poppins} text-black/40 text-[14px]`}>No Vestings Found</p>
                                    </div>
                                )}
                            </div>
                            {unclaimedVesting > 0 && (
                                <div className="flex items-center justify-between mt-5 pt-5 border-t border-[#4100001a]">
                                    <div className="flex items-center gap-3">
                                        <span className={`${poppins} text-black text-[14px] font-semibold`}>Unclaimed Vesting</span>
                                        <ShieldIcon />
                                        <span className={`${sigmar} text-black text-[20px]`}>{fmt(unclaimedVesting)}</span>
                                    </div>
                                    <button
                                        className={`${greenBtn} py-[11px] px-6 text-[15px]`}
                                        disabled={isWithdrawExpiredVestingsLoading}
                                        onClick={() => withdrawExpiredVestings()}
                                    >
                                        {isWithdrawExpiredVestingsLoading && (
                                            <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                        )}
                                        Claim
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* LOCKED PANEL */}
                        <div className={`${cardBase} p-9`}>
                            <div className="flex justify-between items-center mb-5">
                                <h2 className={`${sigmar} text-black text-[20px] leading-none`}>Locked</h2>
                                <span className="text-black/40 text-base cursor-help" title="Locked tokens and their unlock dates">ⓘ</span>
                            </div>
                            <div className="min-h-[110px] max-h-[260px] overflow-y-auto space-y-2">
                                {lockedBalancesEntries.length > 0 ? (
                                    lockedBalancesEntries.map((entry, i) => {
                                        const amt = Number(formatUnits(BigInt(entry.amount.toString()), 18));
                                        const t = lockTimes[i];
                                        return (
                                            <div key={i} className="bg-white/50 rounded-[14px] border border-[#4100001a] px-5 py-3 flex flex-wrap items-center justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <ShieldIcon />
                                                    <span className={`${sigmar} text-black text-[26px] leading-none`}>{fmt(amt)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`${poppins} text-black/50 text-[12px]`}>Unlocks in</span>
                                                    <span className={`${sigmar} text-black text-[14px]`}>
                                                        {t?.days || 0}D:{t?.hours || 0}H:{t?.minutes || 0}M:{t?.seconds || 0}S
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="flex justify-center items-center h-[90px]">
                                        <p className={`${poppins} text-black/40 text-[14px]`}>No Locks Found</p>
                                    </div>
                                )}
                            </div>
                            {userLockedUnlockable > 0 && (
                                <div className="flex items-center gap-3 mt-5 pt-5 border-t border-[#4100001a]">
                                    <span className={`${poppins} text-black text-[14px] font-semibold`}>Unlockable</span>
                                    <ShieldIcon />
                                    <span className={`${sigmar} text-black text-[20px]`}>{fmt(userLockedUnlockable)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ══════════════ RIGHT COLUMN ══════════════ */}
                    <div className="w-full lg:w-[520px] shrink-0 lg:sticky lg:top-[160px] self-start">
                        <div className={`${cardBase} overflow-hidden`}>

                            {/* Heading */}
                            <div className="px-9 pt-9 pb-8">
                                <h2 className={`${sigmar} text-black text-[28px] leading-tight`}>Claim your Rewards</h2>
                            </div>

                            <hr className="border-[#4100001a]" />

                            {/* ── CLAIMABLE REWARDS ── */}
                            <RewardSection title="Claimable Rewards" hint="Includes SHiELD Locked and Staked">
                                <div className="flex items-center gap-4 flex-wrap">
                                    {/* SHiELD */}
                                    <div className="flex items-center gap-2">
                                        <ShieldIcon />
                                        <span className={`${sigmar} text-black text-[30px] leading-none`}>{fmt(claimableShield)}</span>
                                    </div>
                                    {/* BNB */}
                                    <div className="flex items-center gap-2">
                                        <BnbIcon />
                                        <span className={`${sigmar} text-black text-[30px] leading-none`}>{fmt(claimableBnb, 5)}</span>
                                    </div>
                                    {/* Claim */}
                                    <button
                                        className={`${greenBtn} py-[11px] px-7 text-[15px] ml-auto`}
                                        disabled={(!claimableShield && !claimableBnb) || isClaimLoading}
                                        onClick={() => { if (!isConnected) { openConnectModal?.(); return; } claimRewards(); }}
                                    >
                                        {isClaimLoading && (
                                            <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                        )}
                                        Claim
                                    </button>
                                </div>
                            </RewardSection>

                            <hr className="border-[#4100001a]" />

                            {/* ── SHiELD IN VESTING ── */}
                            <RewardSection title="SHiELD in Vesting" hint="SHiELD can be claimed with 50% Penalty">
                                <div className="flex items-center gap-2">
                                    <ShieldIcon />
                                    <span className={`${sigmar} text-black text-[30px] leading-none`}>{fmt(earnedBalancesTotal)}</span>
                                </div>
                            </RewardSection>

                            <hr className="border-[#4100001a]" />

                            {/* ── CLAIM ALL ── */}
                            <RewardSection title="Claim All" hint="With penalty if Applicable" noBorder>
                                <div className="flex items-center gap-4 flex-wrap">
                                    {/* SHiELD */}
                                    <div className="flex items-center gap-2">
                                        <ShieldIcon />
                                        <span className={`${sigmar} text-black text-[30px] leading-none`}>
                                            {fmt(withdrawableAmount + claimableShield, 0)}
                                        </span>
                                    </div>
                                    {/* BNB */}
                                    <div className="flex items-center gap-2">
                                        <BnbIcon />
                                        <span className={`${sigmar} text-black text-[30px] leading-none`}>{fmt(claimableBnb, 2)}</span>
                                    </div>
                                    {/* Claim */}
                                    <button
                                        className={`${greenBtn} py-[11px] px-7 text-[15px] ml-auto`}
                                        disabled={(withdrawableAmount + claimableShield <= 0) || isEmergencyWithdrawLoading}
                                        onClick={() => { if (!isConnected) { openConnectModal?.(); return; } emergencyWithdraw(); }}
                                    >
                                        {isEmergencyWithdrawLoading && (
                                            <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                        )}
                                        Claim
                                    </button>
                                </div>
                            </RewardSection>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
