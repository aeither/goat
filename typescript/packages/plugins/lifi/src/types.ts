import type { Route } from "@lifi/sdk";
import type { Address } from "viem";

export interface SwapParams {
    chain: string;
    fromToken: Address;
    toToken: Address;
    amount: string;
    slippage?: number;
}

export interface SwapQuote {
    aggregator: "lifi" | "bebop";
    minOutputAmount: string;
    swapData: Route | BebopRoute;
}

export interface Transaction {
    hash: `0x${string}`;
    from: Address;
    to: Address;
    value: bigint;
    data: string;
    chainId: number;
}

export interface BebopRoute {
    fromAddress: Address;
    fromChainId: number;
    steps: Array<{
        estimate: {
            approvalAddress: Address;
        };
    }>;
}
