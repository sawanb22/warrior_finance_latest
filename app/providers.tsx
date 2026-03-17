"use client";

import {
    getDefaultConfig,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider, http } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactNode } from 'react';

// Use the project ID from the shield project
const projectId = '3503f54f4af9f3a448774f9a20a75584';

export const config = getDefaultConfig({
    appName: 'Warrior Finance',
    projectId: projectId,
    chains: [bsc],
    ssr: true, // Recommended for Next.js
    transports: {
        [bsc.id]: http("https://bsc-dataseed1.binance.org"),
    },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
