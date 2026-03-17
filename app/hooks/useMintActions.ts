"use client";
import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import WETHX_PTN_POOL_ABI from '../constants/WETHX_PTN_POOL_ABI.json';
import erc20_ABI from '../constants/erc20_ABI.json';

export const useMintActions = () => {
    const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
    const { writeContractAsync } = useWriteContract();

    const { isLoading: isTxLoading, isSuccess: isTxSuccess } =
        useWaitForTransactionReceipt({ hash: txHash });

    // ── Approve ERC20 token for pool spending ──
    const [isApproveLoading, setIsApproveLoading] = useState(false);
    const approve = async (tokenAddress: string, spenderAddress: string) => {
        try {
            setIsApproveLoading(true);
            const hash = await writeContractAsync({
                address: tokenAddress as `0x${string}`,
                abi: erc20_ABI as any,
                functionName: 'approve',
                args: [spenderAddress, parseUnits('999999999', 18)],
            });
            setTxHash(hash);
            return hash;
        } catch (e) {
            console.error('Approve error:', e);
            throw e;
        } finally {
            setIsApproveLoading(false);
        }
    };

    // ── Mint: call pool.mint(minXTokenOut, tokenAmountIn) ──
    // For BNB: pass value (native), for ERC20s: no value
    const [isMintLoading, setIsMintLoading] = useState(false);
    const mint = async (
        poolAddress: string,
        inputAmount: string,
        minXTokenOut: string,
        isNative: boolean
    ) => {
        try {
            setIsMintLoading(true);
            const amountWei = parseUnits(inputAmount || '0', 18);
            const minOutWei = parseUnits(minXTokenOut || '0', 18);
            const hash = await writeContractAsync({
                address: poolAddress as `0x${string}`,
                abi: WETHX_PTN_POOL_ABI as any,
                functionName: 'mint',
                args: [minOutWei, amountWei],
                value: isNative ? amountWei : undefined,
            });
            setTxHash(hash);
            return hash;
        } catch (e) {
            console.error('Mint error:', e);
            throw e;
        } finally {
            setIsMintLoading(false);
        }
    };

    // ── Collect: claim pending xTokens after mint ──
    const [isCollectLoading, setIsCollectLoading] = useState(false);
    const collect = async (poolAddress: string) => {
        try {
            setIsCollectLoading(true);
            const hash = await writeContractAsync({
                address: poolAddress as `0x${string}`,
                abi: WETHX_PTN_POOL_ABI as any,
                functionName: 'collect',
            });
            setTxHash(hash);
            return hash;
        } catch (e) {
            console.error('Collect error:', e);
            throw e;
        } finally {
            setIsCollectLoading(false);
        }
    };

    return {
        approve,
        isApproveLoading,
        mint,
        isMintLoading,
        collect,
        isCollectLoading,
        isTxLoading,
        isTxSuccess,
    };
};
