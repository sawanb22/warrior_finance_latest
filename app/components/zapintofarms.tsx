'use client';
import { useZapData } from '../hooks/useZapData';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export const Box = ({
    onClose,
    pool,
    poolIndex,
    lpTokenAddr
}: {
    onClose?: () => void,
    pool: any,
    poolIndex: number,
    lpTokenAddr?: `0x${string}`
}) => {
    const { isConnected } = useAccount();
    const { openConnectModal } = useConnectModal();

    const {
        inputZapValue,
        setInputZapValue,
        slippage,
        setSlippage,
        nativeBalanceFormatted,
        isZapLoading,
        isZapSuccess,
        executeZap,
        symbol0,
        symbol1,
        minLiquidityReceived,
        priceImpact,
        estDaily,
    } = useZapData(poolIndex, lpTokenAddr);

    const handleMax = () => {
        if (nativeBalanceFormatted) setInputZapValue(parseFloat(nativeBalanceFormatted).toFixed(18));
    };

    return (
        /* Overlay backdrop */
        <div
            className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-[80px]"
            onClick={onClose}
        >
            {/* Card */}
            <div
                className="relative w-[472px] bg-[#ffeed6] rounded-[20px] shadow-2xl flex flex-col gap-4 p-6 my-auto mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-center [font-family:'Sigmar',Helvetica] font-normal text-black text-[28px] leading-tight tracking-[-0.3px]">
                    Zap into Farms
                </h2>

                <div className="bg-white rounded-[17px] border-2 border-[#381200] shadow-[0px_4px_0px_#381200] px-4 pt-4 pb-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <input
                            type="number"
                            className="[font-family:'Sigmar',Helvetica] font-normal text-black text-3xl tracking-[-1.2px] bg-transparent outline-none w-full"
                            placeholder="0.00"
                            value={inputZapValue}
                            onChange={(e) => setInputZapValue(e.target.value)}
                        />
                        <button className="flex items-center gap-2 bg-[#ffeed6] border-2 border-[#381200] rounded-[13px] px-3 py-1.5 shrink-0">
                            <img src="/icons/bnb.png" className="w-[22px] h-[22px] rounded-full object-cover" alt="BNB" />
                            <span className="[font-family:'Sigmar',Helvetica] font-normal text-black text-sm tracking-[-0.56px]">
                                BNB
                            </span>
                        </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <button onClick={handleMax} className="bg-[#62d732] border-2 border-[#309c03] rounded-[17px] px-4 py-0.5 [font-family:var(--font-poppins)] font-bold text-white text-[14px] leading-[1.02] tracking-[-0.04em] active:translate-y-0.5 transition-all outline-none focus:outline-none">
                            Max
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="[font-family:'Poppins',Helvetica] font-semibold text-black text-sm opacity-60">
                                Balance
                            </span>
                            <span className="[font-family:'Sigmar',Helvetica] font-normal text-black text-sm tracking-[-0.56px]">
                                {parseFloat(nativeBalanceFormatted).toFixed(4)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center -my-2 z-10">
                    <div className="w-[36px] h-[36px] bg-[#62d732] border-2 border-[#309c03] shadow-[0px_4px_0px_#309c03] rounded-[12px] flex items-center justify-center">
                        <svg width="18" height="12" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 3L11 13L20 3" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                <div className="bg-[#f1ddc1] rounded-[20px] border border-[#0000001a] p-5 flex flex-col gap-4 -mt-1 relative">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                            <img src={pool.img1} alt="" className="w-[32px] h-[32px] rounded-full object-cover shrink-0 z-10" />
                            <img src={pool.img2} alt="" className="w-[32px] h-[32px] rounded-full object-cover shrink-0 -ml-4 z-0" />
                        </div>
                        <span className="[font-family:'Sigmar',Helvetica] font-normal text-black text-sm tracking-[-0.56px]">
                            {pool.title}
                        </span>
                    </div>

                    <div className="flex flex-col gap-2 mb-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <img src="/icons/bnb.png" alt="BNB" className="w-[20px] h-[20px] rounded-full object-cover shrink-0" />
                                <span className="[font-family:'Poppins',Helvetica] font-semibold text-black text-sm opacity-80 tracking-[0.28px]">
                                    {symbol1 !== 'Unknown' ? symbol1 : pool.title.split('/')[1]?.trim()}
                                </span>
                            </div>
                            <span className="[font-family:'Sigmar',Helvetica] font-normal text-black text-sm tracking-[0.28px] opacity-80">
                                ~Est. Swap
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <img src={pool.img1} alt="" className="w-[20px] h-[20px] object-cover rounded-full" />
                                <span className="[font-family:'Poppins',Helvetica] font-semibold text-black text-sm opacity-80 tracking-[0.28px]">
                                    {symbol0 !== 'Unknown' ? symbol0 : pool.title.split('/')[0]?.trim()}
                                </span>
                            </div>
                            <span className="[font-family:'Sigmar',Helvetica] font-normal text-black text-sm tracking-[0.28px] opacity-80">
                                ~Est. Swap
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs mx-1 opacity-60">
                        <span className="[font-family:'Poppins',Helvetica] font-semibold">APR</span>
                        <span className="[font-family:'Poppins',Helvetica] font-semibold">Est. Daily Income</span>
                        <span className="[font-family:'Poppins',Helvetica] font-semibold">Price Impact</span>
                    </div>

                    <div className="flex items-center justify-between text-sm mx-1 opacity-80 mb-2">
                        <span className="[font-family:'Sigmar',Helvetica] font-normal">--%</span>
                        <span className="[font-family:'Sigmar',Helvetica] font-normal">${estDaily.toFixed(2)}</span>
                        <span className="[font-family:'Sigmar',Helvetica] font-normal">{priceImpact}%</span>
                    </div>

                    <div className="flex items-center justify-between px-1">
                        <span className="[font-family:'Poppins',Helvetica] font-semibold text-black text-sm opacity-50 tracking-[0.28px]">
                            Minimum Received
                        </span>
                        <span className="[font-family:'Sigmar',Helvetica] font-normal text-black text-[13px] tracking-[0.28px] opacity-80">
                            {minLiquidityReceived} LP
                        </span>
                    </div>

                    <div className="flex items-center justify-between px-1 mt-2">
                        <span className="[font-family:'Poppins',Helvetica] font-semibold text-black text-sm opacity-50 tracking-[0.28px]">
                            Slippage
                        </span>
                        <div className="flex items-center gap-2">
                            {[0.5, 1.0, 2.0].map((v) => (
                                <button
                                    key={v}
                                    onClick={() => setSlippage(v)}
                                    className={`${slippage === v ? 'bg-[#62d732] border-[#309c03] text-white' : 'bg-transparent border-[#309c03] text-[#626262]'} border-2 rounded-[17px] px-3 py-1 [font-family:var(--font-poppins)] font-bold text-[13px] leading-[1.02] tracking-[-0.04em] transition-all outline-none focus:outline-none`}
                                >
                                    {v}%
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {!isConnected ? (
                    <button
                        onClick={openConnectModal}
                        className="w-full bg-[#62d732] border-2 border-[#309c03] shadow-[0px_4px_0px_#309c04] rounded-[17px] py-4 [font-family:var(--font-poppins)] font-bold text-white text-[16px] leading-[1.02] tracking-[-0.04em] active:translate-y-0.5 active:shadow-none transition-all outline-none focus:outline-none"
                    >
                        Connect Wallet
                    </button>
                ) : (
                    <button
                        onClick={executeZap}
                        disabled={!inputZapValue || parseFloat(inputZapValue) <= 0 || isZapLoading || parseFloat(inputZapValue) > parseFloat(nativeBalanceFormatted)}
                        className="w-full bg-[#62d732] border-2 border-[#309c03] shadow-[0px_4px_0px_#309c04] rounded-[17px] py-4 [font-family:var(--font-poppins)] font-bold text-white text-[16px] leading-[1.02] tracking-[-0.04em] active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50 disabled:active:translate-y-0 disabled:active:shadow-[0px_4px_0px_#309c04] outline-none focus:outline-none flex justify-center items-center gap-2"
                    >
                        {isZapLoading && <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
                        {parseFloat(inputZapValue) > parseFloat(nativeBalanceFormatted) ? 'Insufficient Fund' : 'Zap'}
                    </button>
                )}
            </div>
        </div>
    );
};
