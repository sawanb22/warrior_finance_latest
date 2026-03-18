'use client';
import { useState, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { useAccount, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits, parseUnits, maxUint256, formatEther, parseEther } from 'viem';
import addresses from '../constants/contractAddresses.json';
import POTION_DAO_ZAP_ABI from '../constants/POTION_DAO_ZAP_ABI.json';
import POTION_DAO_CHEF_ABI from '../constants/POTION_DAO_CHEF_ABI.json';
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

// Babylonian algorithm for square root (adapted for BigNumber.js from old project)
function Babylonian(num: BigNumber): BigNumber {
  const MAX_ITERATIONS = 200;
  let guess = new BigNumber(Math.floor(Math.sqrt(num.toNumber())));
  if (guess.isNaN() || guess.lte(0)) guess = new BigNumber(1);
  let prevGuess = new BigNumber(0);
  let i = 0;

  do {
    prevGuess = guess;
    guess = num.dividedBy(prevGuess).plus(prevGuess).dividedBy(2);
    i++;
  } while (prevGuess.minus(guess).absoluteValue().isGreaterThan(1) && i < MAX_ITERATIONS);

  return guess;
}

function calculateSwapInAmount(_reserveIn: string, _tokenIn: string) {
    const swapFee = 17;
    const D = new BigNumber(10000); // denominator
    const R = D.minus(swapFee); // r number

    const tokenInB = new BigNumber(_tokenIn);
    const reserveInB = new BigNumber(_reserveIn);

    if (tokenInB.lte(0) || reserveInB.lte(0)) return '0';

    const numerator = tokenInB.times(4).times(D).times(R).plus(reserveInB.times(D.plus(R)).times(D.plus(R))).times(reserveInB);
    const denominator = R.times(2);

    const sqrt = Babylonian(numerator);
    const subtracted = sqrt.minus(reserveInB.times(D.plus(R)));
    return subtracted.dividedBy(denominator).decimalPlaces(0).toString();
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

    // Read chef data for estDaily computation
    const { data: poolInfoRaw } = useReadContract({
        address: addresses.ShieldDaoChef as `0x${string}`,
        abi: POTION_DAO_CHEF_ABI as any,
        functionName: 'poolInfo',
        args: [poolIndex],
    });
    const allocPoint = poolInfoRaw ? Number((poolInfoRaw as any)[2]) : 0;

    const { data: rewardPerSecondRaw } = useReadContract({
        address: addresses.ShieldDaoChef as `0x${string}`,
        abi: POTION_DAO_CHEF_ABI as any,
        functionName: 'rewardPerSecond',
    });
    const rewardPerSecond = rewardPerSecondRaw ? Number(formatUnits(rewardPerSecondRaw as bigint, 18)) : 0;

    const { data: totalAllocPointRaw } = useReadContract({
        address: addresses.ShieldDaoChef as `0x${string}`,
        abi: POTION_DAO_CHEF_ABI as any,
        functionName: 'totalAllocPoint',
    });
    const totalAllocPoint = totalAllocPointRaw ? Number(totalAllocPointRaw) : 0;

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

    // Calculate minimum liquidity and price impact
    const { minLiquidityReceived, priceImpact, estDaily } = useMemo(() => {
        if (!inputZapValue || !reservesRaw || !totalSupplyRaw) {
            return { minLiquidityReceived: '0', priceImpact: '0', estDaily: 0 };
        }

        const inputWei = parseEther(inputZapValue).toString();
        // Native Zap logic typically pairs WETH as token0.
        // If not token0, swap logic is mirrored, but usually native zaps handle WETH as token0 or the Zap contract sorts it.
        // For accurate UI estimation, we assume token0 is the native pairing base as per Shield's default pools.
        const swapInWei = calculateSwapInAmount(reserve0, inputWei);

        // Min Liquidity computation
        const r0B = new BigNumber(reserve0);
        const swapInB = new BigNumber(swapInWei);
        const tsB = new BigNumber(totalSupply);

        if (r0B.lte(0) || tsB.lte(0) || swapInB.lte(0)) {
            return { minLiquidityReceived: '0', priceImpact: '0', estDaily: 0 };
        }

        // liquidity = (swapIn * totalSupply) / (reserve0 * 2) roughly, adjusted for exact math
        // In old project: minLq = amount.mul(ts).div(res0).mul(1-slippage)
        // Here we do the raw math properly:
        const slipFactor = new BigNumber(1).minus(new BigNumber(slippage).div(100));
        const minLqB = swapInB.times(tsB).dividedBy(r0B.times(2)).times(slipFactor);
        const minLiquidityReceivedStr = minLqB.decimalPlaces(0).toString();

        // Price Impact
        // impact = (swapIn / (reserve0 + swapIn)) * 100
        const impactB = swapInB.dividedBy(r0B.plus(swapInB)).times(100);
        const priceImpactStr = impactB.isNaN() ? '0' : impactB.toFixed(2);

        // Est Daily
        const dailyEmission = totalAllocPoint > 0 ? (allocPoint / totalAllocPoint) * rewardPerSecond * 86400 : 0;
        const tsFloat = parseFloat(formatUnits(BigInt(totalSupply), 18));
        const estD = tsFloat > 0 ? (parseFloat(formatUnits(BigInt(minLiquidityReceivedStr), 18)) * dailyEmission) / tsFloat : 0;

        return {
            minLiquidityReceived: minLiquidityReceivedStr,
            priceImpact: priceImpactStr,
            estDaily: estD,
        };
    }, [inputZapValue, reserve0, totalSupply, slippage, allocPoint, rewardPerSecond, totalAllocPoint]);

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
        minLiquidityReceived: parseFloat(formatUnits(BigInt(minLiquidityReceived || '0'), 18)).toFixed(7),
        priceImpact,
        estDaily,
    };
};
