"use client";
import { useState } from 'react';
import { useReadContract, useBalance, useAccount } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import addresses from '../constants/contractAddresses.json';
import WETHX_PTN_POOL_ABI from '../constants/WETHX_PTN_POOL_ABI.json';
import WETHX_PTN_MASTER_ORACLE_ABI from '../constants/WETHX_PTN_MASTER_ORACLE_ABI.json';
import erc20_ABI from '../constants/erc20_ABI.json';

// Token configurations — mirrors shield's Radeem.js TOKEN_CONFIG
export const REDEEM_TOKEN_CONFIG: Record<string, {
    poolAddress: string; tokenAddress: string; xTokenSymbol: string;
    outputTokenSymbol: string; shieldSymbol: string; masterOracle: string;
}> = {
    BNBX: {
        poolAddress: addresses.Pool,
        tokenAddress: "",
        xTokenSymbol: "BNBX",
        outputTokenSymbol: "BNB",
        shieldSymbol: "SHiELD",
        masterOracle: addresses.WETHX_SHLD_MasterOracle,
    },
    GUARDX: {
        poolAddress: (addresses as any).GUARDX_POOL,
        tokenAddress: (addresses as any).GUARD_TOKEN,
        xTokenSymbol: "GUARDX",
        outputTokenSymbol: "GUARD",
        shieldSymbol: "SHiELD",
        masterOracle: (addresses as any).GUARDX_MASTER_ORACLE,
    },
    ANDYX: {
        poolAddress: (addresses as any).ANDYX_POOL,
        tokenAddress: (addresses as any).ANDY_TOKEN,
        xTokenSymbol: "ANDYX",
        outputTokenSymbol: "ANDY",
        shieldSymbol: "SHiELD",
        masterOracle: (addresses as any).ANDYX_MASTER_ORACLE,
    },
};

export const useRedeemData = (selectedToken: string) => {
    const { address } = useAccount();
    const config = REDEEM_TOKEN_CONFIG[selectedToken];
    const poolAddr = config.poolAddress as `0x${string}`;

    // ── Pool info (redeem fee, pause status, etc.) ──
    const { data: poolInfo } = useReadContract({
        address: poolAddr,
        abi: WETHX_PTN_POOL_ABI as any,
        functionName: 'info',
    });

    // ── xToken and yToken addresses from pool ──
    const { data: xTokenAddress } = useReadContract({
        address: poolAddr,
        abi: WETHX_PTN_POOL_ABI as any,
        functionName: 'xToken',
    });

    const { data: yTokenAddress } = useReadContract({
        address: poolAddr,
        abi: WETHX_PTN_POOL_ABI as any,
        functionName: 'yToken',
    });

    // ── User's xToken balance (the input token for redeem) ──
    const { data: xTokenBalance } = useBalance({
        address: address,
        token: xTokenAddress as `0x${string}` | undefined,
    });

    // ── User's shield/yToken balance ──
    const { data: shieldBalance } = useBalance({
        address: address,
        token: yTokenAddress as `0x${string}` | undefined,
    });

    // ── Allowance: xToken → pool ──
    const { data: allowanceRaw, refetch: refetchAllowance } = useReadContract({
        address: xTokenAddress as `0x${string}` | undefined,
        abi: erc20_ABI as any,
        functionName: 'allowance',
        args: address && xTokenAddress ? [address, poolAddr] : undefined,
        query: { enabled: !!address && !!xTokenAddress },
    });

    // ── User info (pending collect amounts) ──
    const { data: userInfo, refetch: refetchUserInfo } = useReadContract({
        address: poolAddr,
        abi: WETHX_PTN_POOL_ABI as any,
        functionName: 'userInfo',
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });

    // ── calcRedeem() on-chain read (mirrors shield's Radeem.js) ──
    const [calcRedeemInput, setCalcRedeemInput] = useState<string>('0');
    const { data: calcRedeemResult } = useReadContract({
        address: poolAddr,
        abi: WETHX_PTN_POOL_ABI as any,
        functionName: 'calcRedeem',
        args: [parseUnits(calcRedeemInput || '0', 18)],
        query: { enabled: parseFloat(calcRedeemInput || '0') > 0 },
    });

    // calcRedeem returns (ethAmount, shieldAmount)
    const calcRedeemEth = calcRedeemResult 
        ? Number(formatUnits((calcRedeemResult as any)[0] as bigint, 18))
        : 0;
    const calcRedeemShield = calcRedeemResult
        ? Number(formatUnits((calcRedeemResult as any)[1] as bigint, 18))
        : 0;

    // ── Shield price from oracle ──
    const { data: shieldPriceRate } = useReadContract({
        address: config.masterOracle as `0x${string}`,
        abi: WETHX_PTN_MASTER_ORACLE_ABI as any,
        functionName: 'getYTokenPrice',
    });

    // Parse values
    const redeemFee = poolInfo ? Number((poolInfo as any)[3]) / 1e4 : 0; // shield: poolInfo._redemptionFee / 10e3
    const isRedeemPaused = poolInfo ? Boolean((poolInfo as any)[5]) : false;
    const collateralBalance = poolInfo
        ? Number(formatUnits((poolInfo as any)[6] as bigint || BigInt(0), 18))
        : 0;

    const xBalance = xTokenBalance ? parseFloat(xTokenBalance.formatted) : 0;
    const xBalanceFormatted = xTokenBalance ? parseFloat(xTokenBalance.formatted).toFixed(4) : '0.0';

    const shieldBal = shieldBalance ? parseFloat(shieldBalance.formatted) : 0;

    const allowance = allowanceRaw ? Number(formatUnits(allowanceRaw as bigint, 18)) : 0;

    // Pending collect: userInfo[1] = yTokenBalance (shield), userInfo[2] = ethBalance (output token)
    const pendingShield = userInfo ? Number(formatUnits((userInfo as any)[1] as bigint || BigInt(0), 18)) : 0;
    const pendingEth = userInfo ? Number(formatUnits((userInfo as any)[2] as bigint || BigInt(0), 18)) : 0;
    const collectBlock = userInfo ? Number((userInfo as any)[3]) : 0;

    return {
        poolInfo,
        xTokenAddress: xTokenAddress as `0x${string}` | undefined,
        yTokenAddress: yTokenAddress as `0x${string}` | undefined,
        redeemFee,
        isRedeemPaused,
        collateralBalance,
        xBalance,
        xBalanceFormatted,
        shieldBal,
        allowance,
        pendingShield,
        pendingEth,
        collectBlock,
        refetchAllowance,
        refetchUserInfo,
        config,
        // calcRedeem on-chain
        setCalcRedeemInput,
        calcRedeemEth,
        calcRedeemShield,
    };
};
