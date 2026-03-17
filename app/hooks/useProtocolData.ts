import { useReadContracts, useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import BigNumber from 'bignumber.js';
import addresses from '../constants/contractAddresses.json';
import POTION_DAO_STAKING_ABI from '../constants/POTION_DAO_STAKING_ABI.json';
import BNB_ORACLE_ABI from '../constants/BNBORACLE.json';
import PAIR_ABI from '../constants/IUniswapv2Pair.json';
import WETHX_PTN_POOL_ABI from '../constants/WETHX_PTN_POOL_ABI.json';
import WETHX_PTN_MASTER_ORACLE_ABI from '../constants/WETHX_PTN_MASTER_ORACLE_ABI.json';
import POTION_DAO_CHEF_ABI from '../constants/POTION_DAO_CHEF_ABI.json';
import TOKEN_ABI from '../constants/TOKEN_ABI.json';
import IUniswapOracle from '../constants/IUniswapOracle.json';

export const useProtocolData = () => {
    // ── Batch all contract reads ──
    const { data, isError, isLoading, refetch } = useReadContracts({
        contracts: [
            // [0] BNB/USD price from Chainlink
            { address: addresses.BNB_ORACLE as `0x${string}`, abi: BNB_ORACLE_ABI, functionName: 'latestAnswer' },
            // [1] SHLD/BNB LP reserves → SHIELD price
            { address: addresses.SHLD_BNB_LP as `0x${string}`, abi: PAIR_ABI, functionName: 'getReserves' },
            // [2] BNBX/BNB LP reserves → BNBX price
            { address: addresses.BNBX_BNB_LP as `0x${string}`, abi: PAIR_ABI, functionName: 'getReserves' },
            // [3] Staking rewardData (WETH reward token) → APR numerator
            { address: addresses.STAKING_CONTRACT as `0x${string}`, abi: POTION_DAO_STAKING_ABI, functionName: 'rewardData', args: [addresses.WETH_TOKEN] },
            // [4] Staking rewardsDuration → APR denominator
            { address: addresses.STAKING_CONTRACT as `0x${string}`, abi: POTION_DAO_STAKING_ABI, functionName: 'rewardsDuration' },
            // [5] Staking totalSupply (staked tokens) → APR + TVL
            { address: addresses.STAKING_CONTRACT as `0x${string}`, abi: POTION_DAO_STAKING_ABI, functionName: 'totalSupply' },
            // [6] Staking lockedSupply → TVL
            { address: addresses.STAKING_CONTRACT as `0x${string}`, abi: POTION_DAO_STAKING_ABI, functionName: 'lockedSupply' },
            // [7] Pool info → collateral ratio
            { address: addresses.Pool as `0x${string}`, abi: WETHX_PTN_POOL_ABI, functionName: 'info' },
            // [8] TWAP from master oracle
            { address: addresses.WETHX_SHLD_MasterOracle as `0x${string}`, abi: WETHX_PTN_MASTER_ORACLE_ABI, functionName: 'getXTokenTWAP' },
            // [9] Chef totalAllocPoint (for farm APR)
            { address: addresses.ShieldDaoChef as `0x${string}`, abi: POTION_DAO_CHEF_ABI, functionName: 'totalAllocPoint' },
            // [10] Chef rewardPerSecond (for farm APR)
            { address: addresses.ShieldDaoChef as `0x${string}`, abi: POTION_DAO_CHEF_ABI, functionName: 'rewardPerSecond' },
            // [11] SHIELD ERC20 totalSupply → real circulating supply
            { address: addresses.SHIELD_TOKEN as `0x${string}`, abi: TOKEN_ABI, functionName: 'totalSupply' },
            // [12] BNBX ERC20 totalSupply → BNBX circulating supply
            { address: addresses.WETHX as `0x${string}`, abi: TOKEN_ABI, functionName: 'totalSupply' },
            // [13] BNBX/BNB LP totalSupply → LP rate denominator for farm TVL
            { address: addresses.BNBX_BNB_LP as `0x${string}`, abi: TOKEN_ABI, functionName: 'totalSupply' },
            // [14] SHLD/BNB LP totalSupply → LP rate denominator for farm TVL
            { address: addresses.SHLD_BNB_LP as `0x${string}`, abi: TOKEN_ABI, functionName: 'totalSupply' },
            // [15] Chef poolInfo(0) → alloc points for BNBX/BNB farm (pool 0)
            { address: addresses.ShieldDaoChef as `0x${string}`, abi: POTION_DAO_CHEF_ABI, functionName: 'poolInfo', args: [0] },
            // [16] Chef poolInfo(1) → alloc points for SHLD/BNB farm (pool 1)
            { address: addresses.ShieldDaoChef as `0x${string}`, abi: POTION_DAO_CHEF_ABI, functionName: 'poolInfo', args: [1] },
            // [17] GUARDX ERC20 totalSupply → GUARDX circulating supply
            { address: addresses.GUARDX as `0x${string}`, abi: TOKEN_ABI, functionName: 'totalSupply' },
            // [18] GUARDX spot price from BNB_GUARD_ORACLE
            { address: addresses.BNB_GUARD_ORACLE as `0x${string}`, abi: IUniswapOracle, functionName: 'spot', args: [addresses.GUARD, BigInt("1000000000000000000")] },
        ]
    });

    // ── Balance reads for TVL (mirrors shield's useBalance calls) ──

    // WETH (WBNB) balance inside the collateral pool contract
    const { data: poolEthBalance } = useBalance({
        address: addresses.Pool as `0x${string}`,
        token: addresses.WETH_TOKEN as `0x${string}`,
    });
    // LP tokens (BNBX/BNB) held by the Chef contract (pool 0)
    const { data: lpFarmBalance1 } = useBalance({
        address: addresses.ShieldDaoChef as `0x${string}`,
        token: addresses.BNBX_BNB_LP as `0x${string}`,
    });
    // LP tokens (SHLD/BNB) held by the Chef contract (pool 1)
    const { data: lpFarmBalance2 } = useBalance({
        address: addresses.ShieldDaoChef as `0x${string}`,
        token: addresses.SHLD_BNB_LP as `0x${string}`,
    });


    // ═══════════════════════════════════════
    // PRICE CALCULATIONS
    // ═══════════════════════════════════════

    // BNB price – Chainlink 8 decimals
    const bnbPrice = data?.[0]?.result
        ? Number(formatUnits(data[0].result as bigint, 8))
        : 0;

    // SHIELD price: (WBNB in LP × bnbPrice) / SHLD in LP
    // Shield code: reserves[0]=WBNB, reserves[1]=SHLD
    let shieldPrice = 0;
    if (data?.[1]?.result && bnbPrice) {
        const reserves = data[1].result as [bigint, bigint, number];
        const bnbInLp = new BigNumber(reserves[0].toString()).div(1e18);
        const shldInLp = new BigNumber(reserves[1].toString()).div(1e18);
        if (shldInLp.gt(0)) {
            shieldPrice = bnbInLp.multipliedBy(bnbPrice).div(shldInLp).toNumber();
        }
    }

    // BNBX price: (WBNB in LP × bnbPrice) / BNBX in LP
    let bnbxPrice = 0;
    if (data?.[2]?.result && bnbPrice) {
        const reserves = data[2].result as [bigint, bigint, number];
        const bnbInLp = new BigNumber(reserves[0].toString()).div(1e18);
        const bnbxInLp = new BigNumber(reserves[1].toString()).div(1e18);
        if (bnbxInLp.gt(0)) {
            bnbxPrice = bnbInLp.multipliedBy(bnbPrice).div(bnbxInLp).toNumber();
        }
    }

    // GUARDX price: spot price from Oracle × bnbPrice
    let guardxPrice = 0;
    if (data?.[18]?.result && bnbPrice) {
        // spot price is returned with 1e18 precision
        const spotRaw = new BigNumber((data[18].result as bigint).toString()).div(1e18).toNumber();
        guardxPrice = spotRaw * bnbPrice;
    }

    // ═══════════════════════════════════════
    // CIRCULATING SUPPLY (ERC20 totalSupply)
    // ═══════════════════════════════════════
    const shieldCircSupply = data?.[11]?.result ? Number(formatUnits(data[11].result as bigint, 18)) : 0;
    const bnbxCircSupply = data?.[12]?.result ? Number(formatUnits(data[12].result as bigint, 18)) : 0;
    const guardxCircSupply = data?.[17]?.result ? Number(formatUnits(data[17].result as bigint, 18)) : 0;

    // ═══════════════════════════════════════
    // MARKET CAP
    // ═══════════════════════════════════════
    const shieldMarketCap = shieldPrice * shieldCircSupply;
    const bnbxMarketCap = bnbxPrice * bnbxCircSupply;
    const guardxMarketCap = guardxPrice * guardxCircSupply;

    // ═══════════════════════════════════════
    // STAKING APR  (mirrors shield getApr / getLockerApr)
    // ═══════════════════════════════════════
    let stakingApr = 0;
    if (data?.[3]?.result && data?.[4]?.result && data?.[5]?.result && shieldPrice > 0) {
        const rewardData = data[3].result as any;
        const rewardRate = Number(formatUnits(rewardData[1], 18));       // tokens/sec
        const rewardsDuration = Number(data[4].result);                       // seconds
        const totalStaked = Number(formatUnits(data[5].result as bigint, 18));

        const rewardInUsd = rewardRate * bnbPrice;                            // reward is WETH/BNB
        const stakedInUsd = totalStaked * shieldPrice;

        if (stakedInUsd > 0 && rewardsDuration > 0) {
            const days = rewardsDuration / 86400;
            stakingApr = ((rewardInUsd * rewardsDuration) / stakedInUsd) * (365 / days) * 100;
        }
    }
    // Lock APR = Stake APR × 2 (shield: return getApr() * 2)
    const lockApr = stakingApr * 2;

    // ═══════════════════════════════════════
    // LP FARM RATES  (mirrors shield lpRate calculation)
    // lpRate = (WBNB_in_pool_raw × 2 × bnbPrice) / LP_totalSupply_raw
    // This gives the USD value backed by 1 raw LP token unit.
    // ═══════════════════════════════════════
    let lpRateOne = 0; // USD per raw LP-token-unit for BNBX/BNB pool
    let lpRateTwo = 0; // USD per raw LP-token-unit for SHLD/BNB pool

    if (data?.[2]?.result && data?.[13]?.result && bnbPrice) {
        // WBNB reserves inside BNBX/BNB LP  (reserves[0] = WBNB raw)
        const bnbxReserves = data[2].result as [bigint, bigint, number];
        const wbnbInBnbxPool = Number(bnbxReserves[0]);                      // raw wei
        const bnbxLpTotalSupply = Number(data[13].result);                   // raw wei
        if (bnbxLpTotalSupply > 0) {
            lpRateOne = (wbnbInBnbxPool * 2 * bnbPrice) / bnbxLpTotalSupply;
        }
    }

    if (data?.[1]?.result && data?.[14]?.result && bnbPrice) {
        // WBNB reserves inside SHLD/BNB LP (reserves[0] = WBNB raw)
        const shldReserves = data[1].result as [bigint, bigint, number];
        const wbnbInShldPool = Number(shldReserves[0]);                       // raw wei
        const shldLpTotalSupply = Number(data[14].result);                    // raw wei
        if (shldLpTotalSupply > 0) {
            lpRateTwo = (wbnbInShldPool * 2 * bnbPrice) / shldLpTotalSupply;
        }
    }

    // ═══════════════════════════════════════
    // TVL / TOTAL LOCKED  (mirrors shield lines 667-700)
    // totalLockedValue = stakedUSD + lockedUSD + lpFarm1 + lpFarm2 + poolCollateral + 50000
    // ═══════════════════════════════════════

    // stake/locked value = rawTokens × shieldPrice / 1e18
    const stakedUsd = data?.[5]?.result
        ? new BigNumber(data[5].result.toString()).multipliedBy(shieldPrice).div(1e18).toNumber()
        : 0;
    const lockedUsd = data?.[6]?.result
        ? new BigNumber(data[6].result.toString()).multipliedBy(shieldPrice).div(1e18).toNumber()
        : 0;

    // LP farm value: lpFarmBalance.formatted (= LP tokens in Chef as float) × lpRate
    // This mirrors shield: locekdP1 = lpFarmBalance1?.formatted * lpRateOne
    const lockedP1 = lpFarmBalance1 && lpRateOne
        ? parseFloat(lpFarmBalance1.formatted) * lpRateOne
        : 0;
    const lockedP2 = lpFarmBalance2 && lpRateTwo
        ? parseFloat(lpFarmBalance2.formatted) * lpRateTwo
        : 0;

    // Collateral pool: WETH locked in the pool contract × BNB price
    const poolLockedValue = poolEthBalance && bnbPrice
        ? parseFloat(poolEthBalance.formatted) * bnbPrice
        : 0;

    // Final TVL — matches shield's totalLockedValue exactly
    const totalLockedValue = Math.round(stakedUsd + lockedUsd + lockedP1 + lockedP2 + poolLockedValue + 50000);

    // ═══════════════════════════════════════
    // COLLATERAL RATIO (6-decimal precision: 1000000 = 100%)
    // ═══════════════════════════════════════
    const poolInfo = data?.[7]?.result as any;
    const collRatio = poolInfo ? Number(poolInfo[0]) / 1e6 : 0;

    // ═══════════════════════════════════════
    // TWAP
    // ═══════════════════════════════════════
    const twap = data?.[8]?.result
        ? Number(formatUnits(data[8].result as bigint, 6))
        : 0;

    // ═══════════════════════════════════════
    // FARM APRs  (mirrors shield's PoolPair1 / PoolPair2 components)
    // farmAPR = (rewardPerSecond × allocShare × 86400 × 365 × shieldPrice) / (lpInChef × lpRate) × 100
    // ═══════════════════════════════════════

    const rewardPerSecond = data?.[10]?.result ? Number(formatUnits(data[10].result as bigint, 18)) : 0;
    const totalAllocPoint = data?.[9]?.result ? Number(data[9].result) : 0;

    const calcFarmApr = (poolInfoResult: any, lpFarmBalance: any, lpRate: number) => {
        if (!poolInfoResult || !lpFarmBalance || !lpRate || !totalAllocPoint || !shieldPrice) return 0;
        const poolAlloc = Number(poolInfoResult[2]);    // allocPoint is index 2 in poolInfo tuple
        const farmsRewardPerSecond = (poolAlloc / totalAllocPoint) * rewardPerSecond;
        const annualFarmReward = farmsRewardPerSecond * 86400 * 365;
        const annualFarmRewardUsd = annualFarmReward * shieldPrice;
        const amount = parseFloat(lpFarmBalance.formatted) || 0;
        const tvlFarm = amount * lpRate;
        return tvlFarm > 0 ? (annualFarmRewardUsd / tvlFarm) * 100 : 0;
    };

    // Pool 0 = BNBX/BNB farm, Pool 1 = SHLD/BNB farm
    const farmAprBnbx = calcFarmApr(data?.[15]?.result, lpFarmBalance1, lpRateOne);
    const farmAprShld = calcFarmApr(data?.[16]?.result, lpFarmBalance2, lpRateTwo);

    return {
        // Prices
        bnbPrice,
        shieldPrice,
        bnbxPrice,
        guardxPrice,
        // Circulating supply (ERC20 totalSupply)
        shieldCircSupply,
        bnbxCircSupply,
        guardxCircSupply,
        // Market caps
        shieldMarketCap,
        bnbxMarketCap,
        guardxMarketCap,
        // Staking APRs
        stakingApr,
        lockApr,
        // Farm APRs
        farmAprBnbx,
        farmAprShld,
        // Farm raw values
        rewardPerSecond,
        totalAllocPoint,
        // TVL
        totalLockedValue,
        // Protocol
        collRatio,
        twap,
        // Status
        isLoading,
        isError,
        refetch,
    };
};
