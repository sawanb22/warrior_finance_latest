'use client';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseUnits, maxUint256 } from 'viem';
import addresses from '../constants/contractAddresses.json';
import POTION_DAO_CHEF_ABI from '../constants/POTION_DAO_CHEF_ABI.json';
import TOKEN_ABI from '../constants/TOKEN_ABI.json';

const CHEF = addresses.ShieldDaoChef as `0x${string}`;

/**
 * Hook for farm contract write operations: deposit, withdraw, harvest, approve, harvestAll.
 */
export const useFarmActions = () => {
    const { address } = useAccount();

    // ── Approve LP token ──
    const { writeContract: approveWrite, data: approveTxHash, isPending: isApprovePending } = useWriteContract();
    const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({ hash: approveTxHash });

    const approveLp = async (lpTokenAddr: `0x${string}`) => {
        approveWrite({
            address: lpTokenAddr,
            abi: TOKEN_ABI as any,
            functionName: 'approve',
            args: [CHEF, maxUint256],
        });
    };

    // ── Deposit ──
    const { writeContract: depositWrite, data: depositTxHash, isPending: isDepositPending } = useWriteContract();
    const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({ hash: depositTxHash });

    const deposit = async (poolIndex: number, amount: string) => {
        if (!amount || parseFloat(amount) <= 0 || !address) return;
        depositWrite({
            address: CHEF,
            abi: POTION_DAO_CHEF_ABI as any,
            functionName: 'deposit',
            args: [poolIndex, parseUnits(amount, 18), address],
        });
    };

    // ── Withdraw ──
    const { writeContract: withdrawWrite, data: withdrawTxHash, isPending: isWithdrawPending } = useWriteContract();
    const { isLoading: isWithdrawConfirming, isSuccess: isWithdrawSuccess } = useWaitForTransactionReceipt({ hash: withdrawTxHash });

    const withdraw = async (poolIndex: number, amount: string) => {
        if (!amount || parseFloat(amount) <= 0 || !address) return;
        withdrawWrite({
            address: CHEF,
            abi: POTION_DAO_CHEF_ABI as any,
            functionName: 'withdraw',
            args: [poolIndex, parseUnits(amount, 18), address],
        });
    };

    // ── Harvest (single pool) ──
    const { writeContract: harvestWrite, data: harvestTxHash, isPending: isHarvestPending } = useWriteContract();
    const { isLoading: isHarvestConfirming, isSuccess: isHarvestSuccess } = useWaitForTransactionReceipt({ hash: harvestTxHash });

    const harvest = async (poolIndex: number) => {
        if (!address) return;
        harvestWrite({
            address: CHEF,
            abi: POTION_DAO_CHEF_ABI as any,
            functionName: 'harvest',
            args: [poolIndex, address],
        });
    };

    // ── Harvest All ──
    const { writeContract: harvestAllWrite, data: harvestAllTxHash, isPending: isHarvestAllPending } = useWriteContract();
    const { isLoading: isHarvestAllConfirming, isSuccess: isHarvestAllSuccess } = useWaitForTransactionReceipt({ hash: harvestAllTxHash });

    const harvestAll = async () => {
        if (!address) return;
        harvestAllWrite({
            address: CHEF,
            abi: POTION_DAO_CHEF_ABI as any,
            functionName: 'harvestAllRewards',
            args: [address],
        });
    };

    return {
        approveLp,
        isApproveLoading: isApprovePending || isApproveConfirming,
        isApproveSuccess,
        deposit,
        isDepositLoading: isDepositPending || isDepositConfirming,
        isDepositSuccess,
        withdraw,
        isWithdrawLoading: isWithdrawPending || isWithdrawConfirming,
        isWithdrawSuccess,
        harvest,
        isHarvestLoading: isHarvestPending || isHarvestConfirming,
        isHarvestSuccess,
        harvestAll,
        isHarvestAllLoading: isHarvestAllPending || isHarvestAllConfirming,
        isHarvestAllSuccess,
    };
};
