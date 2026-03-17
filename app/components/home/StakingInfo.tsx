"use client";
import React from 'react';
import { useProtocolData } from '../../hooks/useProtocolData';

const sigmarValStyle = { fontSize: '22px', letterSpacing: '-0.04em', lineHeight: '1.18' } as const;
const poppinsLabelStyle = { fontSize: '16px', letterSpacing: '0.02em', lineHeight: '1.0' } as const;

const StatCard = ({ label, value, subLabel, subValue }: { label: string, value: string, subLabel: string, subValue: string }) => (
    <div className="flex-1 bg-[#EFE3C9] rounded-[20px] border-2 border-[#d9c9a8] shadow-[0px_4px_0px_rgba(0,0,0,0.15)] px-5 py-4 flex justify-between items-center">
        <div>
            <p className="[font-family:var(--font-poppins)] font-semibold text-black/50" style={poppinsLabelStyle}>{label}</p>
            <p className="[font-family:var(--font-sigmar)] font-normal text-black" style={sigmarValStyle}>{value}</p>
        </div>
        <div className="text-right">
            <p className="[font-family:var(--font-poppins)] font-semibold text-black/50" style={poppinsLabelStyle}>{subLabel}</p>
            <p className="[font-family:var(--font-sigmar)] font-normal text-black" style={sigmarValStyle}>{subValue}</p>
        </div>
    </div>
);

export const StakingInfo = () => {
    const { stakingApr, lockApr, farmAprShld, farmAprBnbx } = useProtocolData();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full pb-4">
            {/* SHIELD Stake APR — mirrors shield left card row2 */}
            <StatCard label="Stake APR" value="SHiELD" subLabel="APR" subValue={`${stakingApr.toFixed(2)}%`} />
            {/* SHIELD Lock APR — mirrors shield left card lock APR */}
            <StatCard label="Lock APR" value="SHiELD" subLabel="APR" subValue={`${lockApr.toFixed(2)}%`} />
            {/* SHLD/BNB Farm APR — mirrors shield right card "SHiELD/ BNB" row */}
            <StatCard label="SHiELD/ BNB" value="" subLabel="APR" subValue={`${farmAprShld.toFixed(2)}%`} />
            {/* BNBX/BNB Farm APR — mirrors shield right card "BNBX/ BNB" row */}
            <StatCard label="BNBX/ BNB" value="" subLabel="APR" subValue={`${farmAprBnbx.toFixed(2)}%`} />
        </div>
    );
};
