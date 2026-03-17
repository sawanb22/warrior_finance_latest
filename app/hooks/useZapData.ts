'use client';
import { useState, useEffect, useMemo } from 'react';
import { useAccount, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits, parseUnits, maxUint256, formatEther, parseEther } from 'viem';
import addresses from '../constants/contractAddresses.json';
import POTION_DAO_ZAP_ABI from '../constants/POTION_DAO_ZAP_ABI.json';
import NEW_ZAP_ABI from '../constants/NEW_ZAP_ABI.json';
import PAIR_ABI from '../constants/IUniswapv2Pair.json';
import ROUTER_ABI from '../constants/UniswapRouter_ABI.json';
import FACTORY_ABI from '../constants/UniswapFactory.json';
import TOKEN_ABI from '../constants/TOKEN_ABI.json';

const ZAP_OLD = addresses.ShieldDaoZapWethSwap as `0x${string}`;
const ZAP_NEW = addresses.NEW_ZAP_ADDRESS as `0x${string}`;
const ROUTER = addresses.UNISWAP_ROUTER as `0x${string}`;
const FACTORY = addresses.UNISWAP_FACTORY as `0x${string}`;
const WETH = addresses.WETH_TOKEN as `0x${string}`;

function calculateSwapInAmount(reserveIn: string, userIn: string) {
    // simplified mock derived from the old project's math
    // this can be adjusted if we need exact formulas, but typically router handles it
    const rIn = parseFloat(formatEther(BigInt(reserveIn || '0')));
    const uIn = parseFloat(formatEther(BigInt(userIn || '0')));
    const swapIn = (Math.sqrt(rIn * (rIn * 3988000 + uIn * 3988000)) - rIn * 1997) / 1995;
    if (isNaN(swapIn) || swapIn < 0) return '0';
    return parseEther(swapIn.toFixed(18)).toString();
}

export const useZapData = (poolIndex: number, lpTokenAddr?: `0x${string}`) => {
    const { address } = useAccount();
    const isNewZapperPool = poolIndex === 3 || poolIndex === 4;
    const zapAddress = isNewZapperPool ? ZAP_NEW : ZAP_OLD;
    const zapAbi = isNewZapperPool ? NEW_ZAP_ABI : POTION_DAO_ZAP_ABI;

    const [inputZapValue, setInputZapValue] = useState("");
    const [slippage, setSlippage] = useState(0.5);

    // Get Native Balance
    const { data: balanceData } = useBalance({ address });
    const nativeBalance = balanceData ? parseFloat(balanceData.formatted) : 0;
    const nativeBalanceFormatted = balanceData?.formatted || "0";

    // Read zaps mapping from Zap contract
    const { data: zapsDetail } = useReadContract({
        address: ZAP_OLD,
        abi: POTION_DAO_ZAP_ABI as any,
        functionName: 'zaps',
        args: [poolIndex],
    });

    const token0Addr = zapsDetail ? (zapsDetail as any)[1] : undefined;
    const token1Addr = zapsDetail ? (zapsDetail as any)[2] : undefined;

    // Read symbols
    const { data: symbol0 } = useReadContract({
        address: token0Addr,
        abi: TOKEN_ABI as any,
        functionName: 'symbol',
        query: { enabled: !!token0Addr }
    });
    const { data: symbol1 } = useReadContract({
        address: token1Addr,
        abi: TOKEN_ABI as any,
        functionName: 'symbol',
        query: { enabled: !!token1Addr }
    });

    const isNonNativePool = token0Addr && token0Addr !== WETH;

    // LP Token Info
    const { data: totalSupplyRaw } = useReadContract({
        address: lpTokenAddr,
        abi: PAIR_ABI as any,
        functionName: 'totalSupply',
        query: { enabled: !!lpTokenAddr }
    });

    const { data: reservesRaw } = useReadContract({
        address: lpTokenAddr,
        abi: PAIR_ABI as any,
        functionName: 'getReserves',
        query: { enabled: !!lpTokenAddr }
    });

    const reserve0 = reservesRaw ? (reservesRaw as any)[0].toString() : '0';
    const reserve1 = reservesRaw ? (reservesRaw as any)[1].toString() : '0';
    const totalSupply = totalSupplyRaw ? (totalSupplyRaw as bigint).toString() : '0';

    // Calculate minimum liquidity (simplified native pool logic)
    const minLiquidityReceived = useMemo(() => {
        if (!inputZapValue || !reservesRaw || !totalSupplyRaw) return '0';

        const inputAmount = parseFloat(inputZapValue);
        const r0 = parseFloat(formatUnits(BigInt(reserve0), 18)); // very rough approximation assuming 18 decimals
        const ts = parseFloat(formatUnits(BigInt(totalSupply), 18));

        if (r0 === 0) return '0';

        // Very basic liquidity calculation akin to old zap modal's simplify logic
        const minLq = (inputAmount * ts * (1 - slippage / 100)) / (r0 * 2);
        if (isNaN(minLq)) return '0';
        return parseUnits(minLq.toFixed(18), 18).toString();
    }, [inputZapValue, reserve0, totalSupply, slippage]);

    // Approval (we skip native approval, but if we required ERC20 zap in the future we'd use this. Here Zap uses ETH directly).
    // Native ETH doesn't require approval to the Zap contract for `zapETH` endpoints.

    // Write Contract for Zap
    const { writeContract: zapWrite, data: zapTxHash, isPending: isZapPending } = useWriteContract();
    const { isLoading: isZapConfirming, isSuccess: isZapSuccess } = useWaitForTransactionReceipt({ hash: zapTxHash });

    const executeZap = () => {
        if (!inputZapValue || parseFloat(inputZapValue) <= 0 || !address) return;

        const valueWei = parseEther(inputZapValue);

        let args = isNewZapperPool
            ? [poolIndex, minLiquidityReceived, true]
            : [poolIndex, minLiquidityReceived, valueWei, true];

        zapWrite({
            address: zapAddress,
            abi: zapAbi as any,
            functionName: 'zapETH',
            args,
            value: valueWei,
        });
    };

    return {
        inputZapValue,
        setInputZapValue,
        slippage,
        setSlippage,
        nativeBalance,
        nativeBalanceFormatted,
        isZapLoading: isZapPending || isZapConfirming,
        isZapSuccess,
        executeZap,
        symbol0: symbol0 as string || 'Unknown',
        symbol1: symbol1 as string || 'Unknown',
        minLiquidityReceived: parseFloat(formatUnits(BigInt(minLiquidityReceived), 18)).toFixed(7),
        priceImpact: "0.1", // Simplified placeholder as exact price impact relies on precise intertoken routing
        estDaily: 0,
    };
};
