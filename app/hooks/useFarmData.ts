'use client';
import { useReadContracts, useBalance, useAccount, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import addresses from '../constants/contractAddresses.json';
import POTION_DAO_CHEF_ABI from '../constants/POTION_DAO_CHEF_ABI.json';
import TOKEN_ABI from '../constants/TOKEN_ABI.json';
import BNB_ORACLE_ABI from '../constants/BNBORACLE.json';
import PAIR_ABI from '../constants/IUniswapv2Pair.json';

const CHEF = addresses.ShieldDaoChef as `0x${string}`;
const SHIELD_TOKEN = addresses.SHIELD_TOKEN as `0x${string}`;

/**
 * Per-pool farm data hook.
 * Reads the user's deposited balance, pending reward, LP balance, allowance etc.
 */
export const useFarmData = (poolIndex: number) => {
    const { address } = useAccount();

    // Get LP token address for this pool
    const { data: lpToken } = useReadContract({
        address: CHEF,
        abi: POTION_DAO_CHEF_ABI as any,
        functionName: 'lpToken',
        args: [poolIndex],
    });

    const lpTokenAddr = lpToken as `0x${string}` | undefined;

    // User's LP token balance in wallet
    const { data: lpBalance } = useBalance({
        address: address,
        token: lpTokenAddr,
        query: { enabled: !!lpTokenAddr && !!address },
    });

    // User info from chef (deposited amount, rewardDebt, unlockTime)
    const { data: userInfo, refetch: refetchUserInfo } = useReadContract({
        address: CHEF,
        abi: POTION_DAO_CHEF_ABI as any,
        functionName: 'userInfo',
        args: address ? [poolIndex, address] : undefined,
        query: { enabled: !!address },
    });

    // Pending reward for user
    const { data: pendingReward, refetch: refetchPending } = useReadContract({
        address: CHEF,
        abi: POTION_DAO_CHEF_ABI as any,
        functionName: 'pendingReward',
        args: address ? [poolIndex, address] : undefined,
        query: { enabled: !!address },
    });

    // allowance: user -> chef for lp token
    const { data: allowanceRaw, refetch: refetchAllowance } = useReadContract({
        address: lpTokenAddr!,
        abi: TOKEN_ABI as any,
        functionName: 'allowance',
        args: address ? [address, CHEF] : undefined,
        query: { enabled: !!address && !!lpTokenAddr },
    });

    // Total number of pools
    const { data: poolLengthRaw } = useReadContract({
        address: CHEF,
        abi: POTION_DAO_CHEF_ABI as any,
        functionName: 'poolLength',
    });
    const poolLength = poolLengthRaw ? Number(poolLengthRaw) : 0;

    const deposited = userInfo ? Number(formatUnits(BigInt((userInfo as any)[0]?.toString() || '0'), 18)) : 0;
    const pending = pendingReward ? Number(formatUnits(pendingReward as bigint, 18)) : 0;
    const walletLpBalance = lpBalance ? parseFloat(lpBalance.formatted) : 0;
    const walletLpFormatted = lpBalance?.formatted || '0';
    const allowance = allowanceRaw ? Number(formatUnits(allowanceRaw as bigint, 18)) : 0;

    const refetch = () => {
        refetchUserInfo();
        refetchPending();
        refetchAllowance();
    };

    return {
        lpTokenAddr,
        deposited,
        pending,
        walletLpBalance,
        walletLpFormatted,
        allowance,
        poolLength,
        refetch,
        refetchAllowance,
    };
};
