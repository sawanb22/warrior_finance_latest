"use client";

export const Staking = () => {
    // Exact Sigmar typography from design specs: 16px, 400 weight (font-normal), 111% line-height
    const sigmarText = "text-black font-normal text-[16px] leading-[1.11] [font-family:var(--font-sigmar)]";

    return (
        <div className="relative w-full min-h-screen bg-transparent overflow-x-hidden flex justify-center items-start pt-[130px] pb-20">

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
                    {/* Left Column */}
                    <div className="flex flex-col gap-6 w-full">
                        {/* Claim your Rewards */}
                        <div className="bg-[#ffeed6] rounded-[20px] p-4 sm:p-6 w-full">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className={sigmarText}>Claim your Rewards</h2>
                                <span className={`${sigmarText} text-[#3ac202] cursor-pointer text-[14px]`}>Stake History</span>
                            </div>

                            <div className="flex flex-col gap-3">
                                {[1, 2, 3, 4].map((item, index) => (
                                    <div key={index} className="bg-[#ffeed6] rounded-[17px] border-2 border-[#38120033] p-3 flex flex-row flex-wrap sm:flex-nowrap justify-between items-center gap-4 transition-all hover:border-[#381200] hover:shadow-[0px_4px_0px_0px_#381200]">
                                        {/* Left part */}
                                        <div className="flex items-center gap-3">
                                            <div className="w-[38px] h-[38px] flex-shrink-0 relative">
                                                <img src="/dashboard-assets/Group 927.svg" alt="Token" className="w-full h-full object-contain" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={sigmarText}>881,046</span>
                                                <span className="font-poppins font-bold text-[14px] leading-[1.5] tracking-[0.02em] text-black/60">Lorem</span>
                                            </div>
                                            <div className="ml-2 border border-[#309c03] rounded-lg px-2 py-1 flex items-center justify-center">
                                                <span className="font-poppins font-semibold text-[12px] tracking-[-0.04em] text-black">Claimable</span>
                                            </div>
                                        </div>

                                        {/* Right part */}
                                        <div className="flex items-center gap-3 ml-auto">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40 flex-shrink-0 hidden sm:block">
                                                <circle cx="12" cy="12" r="9" stroke="black" strokeWidth="2" />
                                                <path d="M12 11V16" stroke="black" strokeWidth="2" strokeLinecap="round" />
                                                <circle cx="12" cy="8" r="1.5" fill="black" />
                                            </svg>
                                            <button className="bg-[#62d732] border-2 border-[#309C04] shadow-[0px_4px_0px_#309C04] rounded-[17px] px-6 py-[6px] [font-family:var(--font-poppins)] font-bold text-white text-[14px] leading-[1.02] tracking-[-0.04em] active:translate-y-1 active:shadow-none transition-all">
                                                <span>Claim</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* WROR Vests */}
                        <div className="bg-[#ffeed6] rounded-[20px] p-4 sm:p-6 w-full flex flex-col min-h-[233px]">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className={sigmarText}>WROR Vests</h2>
                                <div className="flex items-center gap-2">
                                    <span className="font-poppins font-semibold text-[14px] text-black/50">Balance</span>
                                    <span className={sigmarText}>79.61 WROR</span>
                                </div>
                            </div>
                            <div className="bg-[#f1ddc1] rounded-[20px] border border-black/10 w-full flex-grow flex items-center justify-center">
                                <span className="font-poppins font-semibold text-[14px] text-black/50">No vesting found</span>
                            </div>
                        </div>

                        {/* WROR Locks */}
                        <div className="bg-[#ffeed6] rounded-[20px] p-4 sm:p-6 w-full flex flex-col min-h-[233px]">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className={sigmarText}>WROR Locks</h2>
                                <div className="flex items-center gap-2">
                                    <span className="font-poppins font-semibold text-[14px] text-black/50">Balance</span>
                                    <span className={sigmarText}>79.61 WROR</span>
                                </div>
                            </div>
                            <div className="bg-[#f1ddc1] rounded-[20px] border border-black/10 w-full flex-grow flex items-center justify-center">
                                <span className="font-poppins font-semibold text-[14px] text-black/50">No vesting found</span>
                            </div>
                        </div>

                        {/* WROR Vests 2 */}
                        <div className="bg-[#ffeed6] rounded-[20px] p-4 sm:p-6 w-full flex flex-col min-h-[233px]">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className={sigmarText}>WROR Vests</h2>
                                <div className="flex items-center gap-2">
                                    <span className="font-poppins font-semibold text-[14px] text-black/50">Balance</span>
                                    <span className={sigmarText}>79.61 WROR</span>
                                </div>
                            </div>
                            <div className="bg-[#f1ddc1] rounded-[20px] border border-black/10 w-full flex-grow flex items-center justify-center">
                                <span className="font-poppins font-semibold text-[14px] text-black/50">No vesting found</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-6 w-full">
                        {/* Stake WROR */}
                        <div className="bg-[#ffeed6] rounded-[20px] p-4 sm:p-6 w-full flex flex-col h-fit">
                            <h2 className={`${sigmarText} mb-4`}>Stake WROR</h2>
                            <p className="font-poppins font-semibold text-[14px] leading-[1.5] tracking-[0.02em] text-black/60 mb-12">
                                Stake WROR And Earn Platform Fees With No Lockup Period.
                            </p>

                            <div className="flex justify-between items-center mb-2">
                                <span className="font-poppins font-semibold text-[14px] text-black/50">Balance</span>
                                <span className={sigmarText}>79.61 WROR</span>
                            </div>

                            <div className="bg-white rounded-[17px] border-2 border-[#381200] shadow-[0px_4px_0px_#381200] h-[50px] w-full flex items-center px-4 mb-5 relative">
                                <input
                                    type="text"
                                    placeholder="Enter Amount"
                                    className="w-full bg-transparent outline-none text-[14px] text-black placeholder:opacity-50 [font-family:var(--font-sigmar)]"
                                />
                                <div className="w-[30px] h-[30px] flex-shrink-0 cursor-pointer absolute right-2">
                                    <img src="/dashboard-assets/Group%20814.svg" alt="Max" className="w-full h-full object-contain" />
                                </div>
                            </div>

                            <button className="bg-[#62D732] border-2 border-[#309C04] shadow-[0px_4px_0px_0px_#309C04] rounded-[17px] h-[50px] w-full flex items-center justify-center [font-family:var(--font-poppins)] font-bold text-white text-[14px] leading-[1.02] tracking-[-0.04em] active:translate-y-1 active:shadow-[0px_0px_0px_0px_#309C04] transition-all mt-2">
                                <span>Connect Wallet</span>
                            </button>
                        </div>

                        {/* Lock WROR */}
                        <div className="bg-[#ffeed6] rounded-[20px] p-4 sm:p-6 w-full flex flex-col h-fit">
                            <h2 className={`${sigmarText} mb-4`}>Lock WROR</h2>

                            <div className="flex flex-col gap-6 mb-12">
                                <p className="font-poppins font-semibold text-[14px] leading-[1.5] tracking-[0.02em] text-black/60">
                                    Stake WROR And Earn Platform Fees With No Lockup Period.
                                </p>
                                <p className="font-poppins font-semibold text-[14px] leading-[1.5] tracking-[0.02em] text-black/60">
                                    The Lock Date Are Grouped By The Week. Any Lock Between Thursday 00:00 UTC To Wednesday 23:59 UTC Are Grouped In The Same Week Group, And Will Release At The Same Time Eight (8) Weeks Later.
                                </p>
                                <p className="font-poppins font-semibold text-[14px] leading-[1.5] tracking-[0.02em] text-black/60">
                                    Locked FXM Will Continue To Earn Fees After The Locks Expire If You Do Not Withdraw.
                                </p>
                            </div>

                            <div className="flex justify-between items-center mb-2">
                                <span className="font-poppins font-semibold text-[14px] text-black/50">Balance</span>
                                <span className={sigmarText}>79.61 WROR</span>
                            </div>

                            <div className="bg-white rounded-[17px] border-2 border-[#381200] shadow-[0px_4px_0px_#381200] h-[50px] w-full flex items-center px-4 mb-5 relative">
                                <input
                                    type="text"
                                    placeholder="Enter Amount"
                                    className="w-full bg-transparent outline-none text-[14px] text-black placeholder:opacity-50 [font-family:var(--font-sigmar)]"
                                />
                                <div className="w-[30px] h-[30px] flex-shrink-0 cursor-pointer absolute right-2">
                                    <img src="/dashboard-assets/Group%20814.svg" alt="Max" className="w-full h-full object-contain" />
                                </div>
                            </div>

                            <button className="bg-[#62D732] border-2 border-[#309C04] shadow-[0px_4px_0px_0px_#309C04] rounded-[17px] h-[50px] w-full flex items-center justify-center [font-family:var(--font-poppins)] font-bold text-white text-[14px] leading-[1.02] tracking-[-0.04em] active:translate-y-1 active:shadow-[0px_0px_0px_0px_#309C04] transition-all mt-2">
                                <span>Connect Wallet</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
