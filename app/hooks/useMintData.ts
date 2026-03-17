"use client";
import { useReadContract, useBalance, useAccount } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import addresses from '../constants/contractAddresses.json';
import WETHX_PTN_POOL_ABI from '../constants/WETHX_PTN_POOL_ABI.json';
import erc20_ABI from '../constants/erc20_ABI.json';

// Token configurations — mirrors shield's Mint.js TOKEN_CONFIG
export const MINT_TOKEN_CONFIG: Record<string, { poolAddress: string; tokenAddress: string; symbol: string; xSymbol: string }> = {
    BNB: {
        poolAddress: addresses.Pool,
        tokenAddress: "",  // native BNB — no token address
        symbol: "BNB",
        xSymbol: "BNBX",
    },
    GUARD: {
        poolAddress: (addresses as any).GUARDX_POOL,
        tokenAddress: (addresses as any).GUARD_TOKEN,
        symbol: "GUARD",
        xSymbol: "GUARDX",
    },
    ANDY: {
        poolAddress: (addresses as any).ANDYX_POOL,
        tokenAddress: (addresses as any).ANDY_TOKEN,
        symbol: "ANDY",
        xSymbol: "ANDYX",
    },
};

export const useMintData = (selectedToken: string) => {
    const { address } = useAccount();
    const config = MINT_TOKEN_CONFIG[selectedToken];
    const poolAddr = config.poolAddress as `0x${string}`;

    // ── Pool info (mint fee, pause status, etc.) ──
    const { data: poolInfo } = useReadContract({
        address: poolAddr,
        abi: WETHX_PTN_POOL_ABI as any,
        functionName: 'info',
    });

    // ── xToken address from pool ──
    const { data: xTokenAddress } = useReadContract({
        address: poolAddr,
        abi: WETHX_PTN_POOL_ABI as any,
        functionName: 'xToken',
    });

    // ── User's input token balance ──
    const { data: inputTokenBalance } = useBalance({
        address: address,
        token: config.tokenAddress ? config.tokenAddress as `0x${string}` : undefined,
    });

    // ── User's xToken balance ──
    const { data: xTokenBalance } = useBalance({
        address: address,
        token: xTokenAddress as `0x${string}` | undefined,
    });

    // ── Allowance check for ERC20 tokens (not needed for BNB) ──
    const { data: allowanceRaw, refetch: refetchAllowance } = useReadContract({
        address: config.tokenAddress ? config.tokenAddress as `0x${string}` : undefined,
        abi: erc20_ABI as any,
        functionName: 'allowance',
        args: address && config.tokenAddress ? [address, poolAddr] : undefined,
        query: { enabled: !!address && !!config.tokenAddress },
    });

    // ── User info (pending collect amounts) ──
    const { data: userInfo, refetch: refetchUserInfo } = useReadContract({
        address: poolAddr,
        abi: WETHX_PTN_POOL_ABI as any,
        functionName: 'userInfo',
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });

    // Parse values
    const mintFee = poolInfo ? Number((poolInfo as any)[2]) / 1e4 : 0; // shield: poolInfo[2] / 10e3
    const isMintPaused = poolInfo ? Boolean((poolInfo as any)[4]) : false;

    const inputBalance = inputTokenBalance ? parseFloat(inputTokenBalance.formatted) : 0;
    const inputBalanceFormatted = inputTokenBalance ? parseFloat(inputTokenBalance.formatted).toFixed(5) : '0.00';

    const xBalance = xTokenBalance ? parseFloat(xTokenBalance.formatted) : 0;
    const xBalanceFormatted = xTokenBalance ? parseFloat(xTokenBalance.formatted).toFixed(5) : '0.0';

    const allowance = allowanceRaw ? Number(formatUnits(allowanceRaw as bigint, 18)) : 0;

    // Pending collect: userInfo[0] = xTokenBalance (pending xTokens to collect)
    const pendingCollect = userInfo ? Number(formatUnits((userInfo as any)[0] as bigint, 18)) : 0;
    const collectBlock = userInfo ? Number((userInfo as any)[3]) : 0;

    return {
        poolInfo,
        xTokenAddress: xTokenAddress as `0x${string}` | undefined,
        mintFee,
        isMintPaused,
        inputBalance,
        inputBalanceFormatted,
        xBalance,
        xBalanceFormatted,
        allowance,
        pendingCollect,
        collectBlock,
        refetchAllowance,
        refetchUserInfo,
        config,
    };
};
