'use client';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi';
import { parseUnits, formatUnits, maxUint256 } from 'viem';
import addresses from '../constants/contractAddresses.json';
import POTION_DAO_STAKING_ABI from '../constants/POTION_DAO_STAKING_ABI.json';
import TOKEN_ABI from '../constants/TOKEN_ABI.json';

const STAKING = addresses.STAKING_CONTRACT as `0x${string}`;
const SHIELD_TOKEN = addresses.SHIELD_TOKEN as `0x${string}`;

/**
 * Hook for staking contract write operations.
 * Mirrors shield's Staking.js / Lock.jsx write calls.
 */
export const useStakingActions = () => {
    const { address } = useAccount();

    // ── Check ERC20 allowance ──
    const { data: allowanceRaw, refetch: refetchAllowance } = useReadContract({
        address: SHIELD_TOKEN,
        abi: TOKEN_ABI as any,
        functionName: 'allowance',
        args: address ? [address, STAKING] : undefined,
        query: { enabled: !!address },
    });
    const allowance = allowanceRaw ? Number(formatUnits(allowanceRaw as bigint, 18)) : 0;

    // ── Approve ──
    const {
        writeContract: approveWrite,
        data: approveTxHash,
        isPending: isApprovePending,
        reset: resetApprove,
    } = useWriteContract();

    const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } =
        useWaitForTransactionReceipt({ hash: approveTxHash });

    const approve = async () => {
        approveWrite({
            address: SHIELD_TOKEN,
            abi: TOKEN_ABI as any,
            functionName: 'approve',
            args: [STAKING, maxUint256],
        });
    };

    // ── Stake (isLocked = false) ──
    const {
        writeContract: stakeWrite,
        data: stakeTxHash,
        isPending: isStakePending,
        reset: resetStake,
    } = useWriteContract();

    const { isLoading: isStakeConfirming, isSuccess: isStakeSuccess } =
        useWaitForTransactionReceipt({ hash: stakeTxHash });

    const stake = async (amount: string) => {
        if (!amount || parseFloat(amount) <= 0) return;
        stakeWrite({
            address: STAKING,
            abi: POTION_DAO_STAKING_ABI as any,
            functionName: 'stake',
            args: [parseUnits(amount, 18), false],
        });
    };

    // ── Lock (isLocked = true) ──
    const {
        writeContract: lockWrite,
        data: lockTxHash,
        isPending: isLockPending,
        reset: resetLock,
    } = useWriteContract();

    const { isLoading: isLockConfirming, isSuccess: isLockSuccess } =
        useWaitForTransactionReceipt({ hash: lockTxHash });

    const lock = async (amount: string) => {
        if (!amount || parseFloat(amount) <= 0) return;
        lockWrite({
            address: STAKING,
            abi: POTION_DAO_STAKING_ABI as any,
            functionName: 'stake',
            args: [parseUnits(amount, 18), true],
        });
    };

    // ── Withdraw (unstake) ──
    const {
        writeContract: withdrawWrite,
        data: withdrawTxHash,
        isPending: isWithdrawPending,
        reset: resetWithdraw,
    } = useWriteContract();

    const { isLoading: isWithdrawConfirming, isSuccess: isWithdrawSuccess } =
        useWaitForTransactionReceipt({ hash: withdrawTxHash });

    const withdraw = async (amount: string) => {
        if (!amount || parseFloat(amount) <= 0) return;
        withdrawWrite({
            address: STAKING,
            abi: POTION_DAO_STAKING_ABI as any,
            functionName: 'withdraw',
            args: [parseUnits(amount, 18)],
        });
    };

    // ── Withdraw Expired Locks ──
    const {
        writeContract: withdrawExpiredWrite,
        data: withdrawExpiredTxHash,
        isPending: isWithdrawExpiredPending,
        reset: resetWithdrawExpired,
    } = useWriteContract();

    const { isLoading: isWithdrawExpiredConfirming, isSuccess: isWithdrawExpiredSuccess } =
        useWaitForTransactionReceipt({ hash: withdrawExpiredTxHash });

    const withdrawExpiredLocks = async () => {
        withdrawExpiredWrite({
            address: STAKING,
            abi: POTION_DAO_STAKING_ABI as any,
            functionName: 'withdrawExpiredLocks',
        });
    };

    // ── Claim Rewards ──
    const {
        writeContract: claimWrite,
        data: claimTxHash,
        isPending: isClaimPending,
        reset: resetClaim,
    } = useWriteContract();

    const { isLoading: isClaimConfirming, isSuccess: isClaimSuccess } =
        useWaitForTransactionReceipt({ hash: claimTxHash });

    const claimRewards = async () => {
        claimWrite({
            address: STAKING,
            abi: POTION_DAO_STAKING_ABI as any,
            functionName: 'getReward',
        });
    };

    // ── Emergency Withdraw (Claim All with penalty) ──
    const {
        writeContract: emergencyWithdrawWrite,
        data: emergencyWithdrawTxHash,
        isPending: isEmergencyWithdrawPending,
    } = useWriteContract();

    const { isLoading: isEmergencyWithdrawConfirming, isSuccess: isEmergencyWithdrawSuccess } =
        useWaitForTransactionReceipt({ hash: emergencyWithdrawTxHash });

    const emergencyWithdraw = async () => {
        emergencyWithdrawWrite({
            address: STAKING,
            abi: POTION_DAO_STAKING_ABI as any,
            functionName: 'emergencyWithdraw',
        });
    };

    // ── Withdraw Expired Vestings ──
    const {
        writeContract: withdrawExpiredVestingsWrite,
        data: withdrawExpiredVestingsTxHash,
        isPending: isWithdrawExpiredVestingsPending,
    } = useWriteContract();

    const { isLoading: isWithdrawExpiredVestingsConfirming, isSuccess: isWithdrawExpiredVestingsSuccess } =
        useWaitForTransactionReceipt({ hash: withdrawExpiredVestingsTxHash });

    const withdrawExpiredVestings = async () => {
        withdrawExpiredVestingsWrite({
            address: STAKING,
            abi: POTION_DAO_STAKING_ABI as any,
            functionName: 'withdrawExpiredVestings',
        });
    };

    return {
        // Allowance
        allowance,
        refetchAllowance,
        // Approve
        approve,
        isApproveLoading: isApprovePending || isApproveConfirming,
        isApproveSuccess,
        resetApprove,
        // Stake
        stake,
        isStakeLoading: isStakePending || isStakeConfirming,
        isStakeSuccess,
        resetStake,
        // Lock
        lock,
        isLockLoading: isLockPending || isLockConfirming,
        isLockSuccess,
        resetLock,
        // Withdraw (unstake)
        withdraw,
        isWithdrawLoading: isWithdrawPending || isWithdrawConfirming,
        isWithdrawSuccess,
        resetWithdraw,
        // Withdraw expired locks
        withdrawExpiredLocks,
        isWithdrawExpiredLoading: isWithdrawExpiredPending || isWithdrawExpiredConfirming,
        isWithdrawExpiredSuccess,
        resetWithdrawExpired,
        // Claim
        claimRewards,
        isClaimLoading: isClaimPending || isClaimConfirming,
        isClaimSuccess,
        resetClaim,
        // Emergency Withdraw
        emergencyWithdraw,
        isEmergencyWithdrawLoading: isEmergencyWithdrawPending || isEmergencyWithdrawConfirming,
        isEmergencyWithdrawSuccess,
        // Withdraw Expired Vestings
        withdrawExpiredVestings,
        isWithdrawExpiredVestingsLoading: isWithdrawExpiredVestingsPending || isWithdrawExpiredVestingsConfirming,
        isWithdrawExpiredVestingsSuccess,
    };
};
