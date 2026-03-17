import React from 'react';

interface CollateralCardProps {
    value: string;
    label: string;
    lastUpdate: string;
}

const sigmarValStyle = { fontSize: '22px', letterSpacing: '-0.04em', lineHeight: '1.18' } as const;
const poppinsLabelStyle = { fontSize: '16px', letterSpacing: '0.02em', lineHeight: '1.0' } as const;
const poppinsSubStyle = { fontSize: '13px', letterSpacing: '0.02em', lineHeight: '1.0' } as const;

export const CollateralCard: React.FC<CollateralCardProps> = ({ value, label, lastUpdate }) => {
    return (
        <div className="bg-[#EFE3C9] rounded-[20px] border-2 border-[#d9c9a8] shadow-[0px_4px_0px_rgba(0,0,0,0.15)] px-6 py-5 flex flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-start">
                <p className="[font-family:var(--font-poppins)] font-semibold text-black/50" style={poppinsLabelStyle}>{label}</p>
                <p className="[font-family:var(--font-poppins)] font-semibold text-black/50 mt-0.5" style={poppinsSubStyle}>{lastUpdate}</p>
            </div>
            <div className="flex-shrink-0">
                <span className="[font-family:var(--font-sigmar)] font-normal text-black" style={sigmarValStyle}>
                    {value}
                </span>
            </div>
        </div>
    );
};
