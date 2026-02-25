import React from 'react';

// Using existing assets where possible
// The "Bus" frame seems to be this complex group: group-905.svg or group.svg
// Let's retry using the images from the original file but placing them relatively.

export const MascotPlaceholder = () => (
    <div className="flex justify-center items-center z-10 w-full h-full">
        <img
            src="/dashboard-assets/Group 905.svg"
            alt="Warrior Mascot"
            className="w-full h-full object-contain drop-shadow-2xl"
        />
    </div>
);

export const StatsBoard = () => {
    return (
        <div className="relative w-[340px] sm:w-[389px] h-[220px] sm:h-[243px] z-20">
            {/* Layer 1: Board background */}
            <div className="absolute inset-0">
                <img
                    src="/dashboard-assets/Group 916.svg"
                    alt="Board Background"
                    className="w-full h-full object-fill drop-shadow-xl"
                />
            </div>



            {/* Paper / Text content on board */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-[15px]">
                {/* "Total Locked" — Sigmar 20px, 118% lh, -4% ls */}
                <span style={{
                    fontFamily: 'Sigmar, cursive',
                    fontWeight: 400,
                    fontSize: '20px',
                    lineHeight: '118%',
                    letterSpacing: '-0.04em',
                    color: '#cb661f',
                    marginTop: '-3px',
                }}>
                    Total Locked
                </span>

                {/* Number — Sigmar 64px, 118% lh, -4% ls */}
                <span style={{
                    fontFamily: 'Sigmar, cursive',
                    fontWeight: 400,
                    fontSize: '64px',
                    lineHeight: '118%',
                    letterSpacing: '-0.04em',
                    color: '#76332c',
                    marginTop: '-5px',
                }}>
                    435648
                </span>

                {/* Buttons — 151×46px each, side-by-side, Poppins 700 14px -4% ls */}
                <div className="flex gap-3" style={{ marginTop: '4.5px', width: '100%', justifyContent: 'center', marginLeft: '-7px' }}>
                    <button style={{
                        width: '151px',
                        height: '46px',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 700,
                        fontSize: '14px',
                        lineHeight: '102%',
                        letterSpacing: '-0.04em',
                        color: '#ffffff',
                        background: '#62d732',
                        border: '2px solid #309c03',
                        borderRadius: '17px',
                        boxShadow: '0px 4px 0px #309c04',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        flexShrink: 0,
                    }}>
                        Lock Yours
                    </button>
                    <button style={{
                        width: '151px',
                        height: '46px',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 700,
                        fontSize: '14px',
                        lineHeight: '102%',
                        letterSpacing: '-0.04em',
                        color: '#1a1b1e',
                        background: '#ffffff',
                        border: '2px solid #1a1b1e',
                        borderRadius: '17px',
                        boxShadow: '0px 4px 0px #1a1b1e',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        flexShrink: 0,
                    }}>
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    );
};

// Keeping StatsBus for backward compatibility or simple usage, but it will now just center both
export const StatsBus = () => {
    return (
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full py-10">
            <MascotPlaceholder />
            <StatsBoard />
        </div>
    );
};
