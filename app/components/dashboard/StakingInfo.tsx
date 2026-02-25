import React from 'react';

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
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full pb-4">
            <StatCard label="Stake" value="WROR" subLabel="APR" subValue="0.0 %" />
            <StatCard label="Stake" value="WROR" subLabel="APR" subValue="0.0 %" />
            <StatCard label="Stake" value="WROR" subLabel="APR" subValue="0.0 %" />
            <StatCard label="Stake" value="WROR" subLabel="APR" subValue="0.0 %" />
        </div>
    );
};
