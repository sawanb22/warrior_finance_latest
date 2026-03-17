'use client';
import { useReadContracts, useBalance, useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import addresses from '../constants/contractAddresses.json';
import POTION_DAO_STAKING_ABI from '../constants/POTION_DAO_STAKING_ABI.json';
import BNB_ORACLE_ABI from '../constants/BNBORACLE.json';
import PAIR_ABI from '../constants/IUniswapv2Pair.json';

const EMPTY_ARRAY: any[] = [];

const STAKING = addresses.STAKING_CONTRACT as `0x${string}`;
const SHIELD_TOKEN = addresses.SHIELD_TOKEN as `0x${string}`;

/**
 * Reads all staking-related on-chain data.
 * Mirrors shield's Staking.js / Lock.jsx contract reads.
 */
export const useStakingData = () => {
    const { address } = useAccount();

    // ── Batch contract reads ──
    const { data, isLoading, refetch } = useReadContracts({
        contracts: [
            // [0] BNB/USD from Chainlink
            { address: addresses.BNB_ORACLE as `0x${string}`, abi: BNB_ORACLE_ABI as any, functionName: 'latestAnswer' },
            // [1] SHLD/BNB LP reserves → SHIELD price
            { address: addresses.SHLD_BNB_LP as `0x${string}`, abi: PAIR_ABI as any, functionName: 'getReserves' },
            // [2] rewardData(WETH) → rewardRate for APR
            { address: STAKING, abi: POTION_DAO_STAKING_ABI as any, functionName: 'rewardData', args: [addresses.WETH_TOKEN as `0x${string}`] },
            // [3] rewardsDuration
            { address: STAKING, abi: POTION_DAO_STAKING_ABI as any, functionName: 'rewardsDuration' },
            // [4] totalSupply (total staked in contract)
            { address: STAKING, abi: POTION_DAO_STAKING_ABI as any, functionName: 'totalSupply' },
            // [5] lockedSupply (total locked in contract)
            { address: STAKING, abi: POTION_DAO_STAKING_ABI as any, functionName: 'lockedSupply' },
            // [6] unlockedBalance(user)
            ...(address ? [{ address: STAKING, abi: POTION_DAO_STAKING_ABI as any, functionName: 'unlockedBalance' as const, args: [address] }] : []),
            // [7] lockedBalances(user)
            ...(address ? [{ address: STAKING, abi: POTION_DAO_STAKING_ABI as any, functionName: 'lockedBalances' as const, args: [address] }] : []),
            // [8] claimableRewards(user)
            ...(address ? [{ address: STAKING, abi: POTION_DAO_STAKING_ABI as any, functionName: 'claimableRewards' as const, args: [address] }] : []),
            // [9] withdrawableBalance(user)
            ...(address ? [{ address: STAKING, abi: POTION_DAO_STAKING_ABI as any, functionName: 'withdrawableBalance' as const, args: [address] }] : []),
            // [10] lockDuration
            { address: STAKING, abi: POTION_DAO_STAKING_ABI as any, functionName: 'lockDuration' },
            // [11] earnedBalances(user) → [total, [{amount, unlockTime}]]
            ...(address ? [{ address: STAKING, abi: POTION_DAO_STAKING_ABI as any, functionName: 'earnedBalances' as const, args: [address] }] : []),
            // [12] getBalanceInfo(user) → {total, staked, locked, earned, ...}
            ...(address ? [{ address: STAKING, abi: POTION_DAO_STAKING_ABI as any, functionName: 'getBalanceInfo' as const, args: [address] }] : []),
        ] as any,
    });

    // User's SHIELD token balance
    const { data: shieldBalance } = useBalance({
        address: address,
        token: SHIELD_TOKEN,
    });

    // ── Parse values ──
    const bnbPrice = data?.[0]?.result
        ? Number(formatUnits(data[0].result as bigint, 8))
        : 0;

    // SHIELD price from LP reserves
    let shieldPrice = 0;
    if (data?.[1]?.result && bnbPrice) {
        const reserves = data[1].result as [bigint, bigint, number];
        const bnbInLp = Number(formatUnits(reserves[0], 18));
        const shldInLp = Number(formatUnits(reserves[1], 18));
        if (shldInLp > 0) {
            shieldPrice = (bnbInLp * bnbPrice) / shldInLp;
        }
    }

    // Stake APR (same formula as shield Staking.js getApr())
    let stakeApr = 0;
    const totalStakedRaw = data?.[4]?.result as bigint | undefined;
    if (data?.[2]?.result && data?.[3]?.result && totalStakedRaw && shieldPrice > 0) {
        const rewardData = data[2].result as any;
        const rewardRate = Number(formatUnits(rewardData[1], 18));
        const rewardsDuration = Number(data[3].result);
        const totalStaked = Number(formatUnits(totalStakedRaw, 18));
        const rewardInUsd = rewardRate * bnbPrice;
        const stakedInUsd = totalStaked * shieldPrice;
        if (stakedInUsd > 0 && rewardsDuration > 0) {
            const days = rewardsDuration / 86400;
            stakeApr = ((rewardInUsd * rewardsDuration) / stakedInUsd) * (365 / days) * 100;
        }
    }
    const lockApr = stakeApr * 2;

    // Total staked/locked supply
    const totalStakedRawNum = totalStakedRaw ? Number(formatUnits(totalStakedRaw, 18)) : 0;
    const totalLockedRaw = data?.[5]?.result as bigint | undefined;
    const totalLockedRawNum = totalLockedRaw ? Number(formatUnits(totalLockedRaw, 18)) : 0;

    // User-specific data (indices shift by 6 when address is present)
    const baseIdx = 6;

    // unlockedBalance → user's staked amount (withdrawable)
    const unlockedBalanceRaw = address && data?.[baseIdx]?.result
        ? (data[baseIdx].result as bigint)
        : BigInt(0);
    const userStaked = Number(formatUnits(unlockedBalanceRaw, 18));

    // lockedBalances → [total, unlockable, locked, lockData[]]
    const lockedBalancesResult = address && data?.[baseIdx + 1]?.result
        ? (data[baseIdx + 1].result as any)
        : null;
    const userLockedTotal = lockedBalancesResult
        ? Number(formatUnits(BigInt(lockedBalancesResult[0]?.toString() || '0'), 18))
        : 0;
    const userLockedUnlockable = lockedBalancesResult
        ? Number(formatUnits(BigInt(lockedBalancesResult[1]?.toString() || '0'), 18))
        : 0;
    // Raw lock entries array
    const lockedBalancesEntries: { amount: bigint; unlockTime: bigint }[] =
        lockedBalancesResult?.[3] || EMPTY_ARRAY;

    // claimableRewards → [[token, amount], [token, amount]]
    const claimableResult = address && data?.[baseIdx + 2]?.result
        ? (data[baseIdx + 2].result as any)
        : null;
    const claimableShield = claimableResult
        ? Number(formatUnits(BigInt(claimableResult[0]?.[1]?.toString() || '0'), 18))
        : 0;
    const claimableBnb = claimableResult
        ? Number(formatUnits(BigInt(claimableResult[1]?.[1]?.toString() || '0'), 18))
        : 0;

    // withdrawableBalance → { amount, penaltyAmount }
    const withdrawableResult = address && data?.[baseIdx + 3]?.result
        ? (data[baseIdx + 3].result as any)
        : null;
    const withdrawableAmount = withdrawableResult
        ? Number(formatUnits(BigInt(withdrawableResult[0]?.toString() || '0'), 18))
        : 0;
    const penaltyAmount = withdrawableResult
        ? Number(formatUnits(BigInt(withdrawableResult[1]?.toString() || '0'), 18))
        : 0;

    // Lock duration
    const lockDuration = data?.[baseIdx + 4]?.result
        ? Number(data[baseIdx + 4].result)
        : 0;

    // earnedBalances → [total, [{amount, unlockTime}]]
    const earnedBalancesResult = address && data?.[baseIdx + 5]?.result
        ? (data[baseIdx + 5].result as any)
        : null;
    const earnedBalancesTotal = earnedBalancesResult
        ? Number(formatUnits(BigInt(earnedBalancesResult[0]?.toString() || '0'), 18))
        : 0;
    const earnedBalancesEntries: { amount: bigint; unlockTime: bigint }[] =
        earnedBalancesResult?.[1] || EMPTY_ARRAY;

    // getBalanceInfo → { total, staked, locked, earned }
    const balanceInfoResult = address && data?.[baseIdx + 6]?.result
        ? (data[baseIdx + 6].result as any)
        : null;
    const balanceInfoEarned = balanceInfoResult?.earned
        ? Number(formatUnits(BigInt(balanceInfoResult.earned.toString()), 18))
        : 0;

    // Unclaimed vesting = balanceInfo.earned - earnedBalances.total
    const unclaimedVesting = balanceInfoEarned > 0 && earnedBalancesTotal > 0
        ? balanceInfoEarned - earnedBalancesTotal
        : 0;

    // User's wallet balance
    const walletBalance = shieldBalance ? parseFloat(shieldBalance.formatted) : 0;
    const walletBalanceFormatted = shieldBalance?.formatted || '0';

    return {
        // Prices
        bnbPrice,
        shieldPrice,
        // APRs
        stakeApr,
        lockApr,
        // Global supply
        totalStakedSupply: totalStakedRawNum,
        totalLockedSupply: totalLockedRawNum,
        // User balances
        userStaked,
        userLockedTotal,
        userLockedUnlockable,
        walletBalance,
        walletBalanceFormatted,
        // Rewards
        claimableShield,
        claimableBnb,
        withdrawableAmount,
        penaltyAmount,
        // Lock
        lockDuration,
        // Vesting / Lock entries (for Dashboard lists)
        earnedBalancesTotal,
        earnedBalancesEntries,
        lockedBalancesEntries,
        unclaimedVesting,
        // Meta
        isLoading,
        refetch,
    };
};
