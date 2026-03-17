"use client";
import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import WETHX_PTN_POOL_ABI from '../constants/WETHX_PTN_POOL_ABI.json';
import erc20_ABI from '../constants/erc20_ABI.json';

export const useRedeemActions = () => {
    const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
    const { writeContractAsync } = useWriteContract();

    const { isLoading: isTxLoading, isSuccess: isTxSuccess } =
        useWaitForTransactionReceipt({ hash: txHash });

    // ── Approve xToken for pool spending ──
    const [isApproveLoading, setIsApproveLoading] = useState(false);
    const approve = async (xTokenAddress: string, poolAddress: string) => {
        try {
            setIsApproveLoading(true);
            const hash = await writeContractAsync({
                address: xTokenAddress as `0x${string}`,
                abi: erc20_ABI as any,
                functionName: 'approve',
                args: [poolAddress, parseUnits('999999999', 18)],
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

    // ── Redeem: call pool.redeem(xTokenAmount, minShieldOut, minEthOut) ──
    const [isRedeemLoading, setIsRedeemLoading] = useState(false);
    const redeem = async (
        poolAddress: string,
        xTokenAmount: string,
        minShieldOut: string,
        minEthOut: string
    ) => {
        try {
            setIsRedeemLoading(true);
            const hash = await writeContractAsync({
                address: poolAddress as `0x${string}`,
                abi: WETHX_PTN_POOL_ABI as any,
                functionName: 'redeem',
                args: [
                    parseUnits(xTokenAmount || '0', 18),
                    parseUnits(minShieldOut || '0', 18),
                    parseUnits(minEthOut || '0', 18),
                ],
            });
            setTxHash(hash);
            return hash;
        } catch (e) {
            console.error('Redeem error:', e);
            throw e;
        } finally {
            setIsRedeemLoading(false);
        }
    };

    // ── Collect: claim pending redeemed tokens ──
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
        redeem,
        isRedeemLoading,
        collect,
        isCollectLoading,
        isTxLoading,
        isTxSuccess,
    };
};
