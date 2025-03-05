import { Tool } from "@goat-sdk/core";
import type { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { type Route, createConfig, executeRoute, getRoutes } from "@lifi/sdk";
import { type Address, parseAbi, parseUnits } from "viem";
import type { SwapParameters } from "./parameters";
import type { SwapQuote, Transaction } from "./types";

export class LifiService {
    private lifiConfig;

    constructor() {
        this.lifiConfig = createConfig({
            integrator: "goat",
        });
    }

    @Tool({
        name: "swap",
        description: "Swap tokens on the same chain using LiFi",
    })
    async swap(walletClient: EVMWalletClient, params: SwapParameters): Promise<Transaction> {
        const fromAddress = await walletClient.getAddress();
        const quote = await this.getLifiQuote(fromAddress as `0x${string}`, params, walletClient);

        if (!quote) {
            throw new Error("No routes found");
        }

        return this.executeLifiQuote(quote, walletClient);
    }

    private async getLifiQuote(
        fromAddress: Address,
        params: SwapParameters,
        walletClient: EVMWalletClient,
    ): Promise<SwapQuote | undefined> {
        try {
            const decimalsAbi = parseAbi(["function decimals() view returns (uint8)"]);
            const decimals = await walletClient.read({
                address: params.fromToken,
                abi: decimalsAbi,
                functionName: "decimals",
            });

            const routes = await getRoutes({
                fromChainId: walletClient.getChain().id,
                toChainId: walletClient.getChain().id,
                fromTokenAddress: params.fromToken,
                toTokenAddress: params.toToken,
                fromAmount: parseUnits(params.amount, Number(decimals.value)).toString(),
                fromAddress: fromAddress,
                options: {
                    slippage: (params.slippage ?? 0.5) / 100,
                    order: "RECOMMENDED",
                },
            });

            if (!routes.routes.length) {
                throw new Error("No routes found");
            }

            return {
                aggregator: "lifi",
                minOutputAmount: routes.routes[0].steps[0].estimate.toAmountMin,
                swapData: routes.routes[0],
            };
        } catch (error) {
            console.error("Error in getLifiQuote:", error);
            return undefined;
        }
    }

    private async executeLifiQuote(quote: SwapQuote, walletClient: EVMWalletClient): Promise<Transaction> {
        if (quote.aggregator !== "lifi") {
            throw new Error("Invalid quote aggregator");
        }

        try {
            const result = await executeRoute(quote.swapData as Route);
            if (!result.steps[0]?.execution?.process[0]?.txHash) {
                throw new Error("Transaction hash is undefined");
            }
            const process = result.steps[0]?.execution?.process[0];

            if (!process?.status || process.status === "FAILED") {
                throw new Error("Transaction failed");
            }

            return {
                hash: process.txHash as `0x${string}`,
                from: quote.swapData.fromAddress as Address,
                to: quote.swapData.steps[0].estimate.approvalAddress as Address,
                value: BigInt(0),
                data: process.data ?? "0x",
                chainId: quote.swapData.fromChainId,
            };
        } catch (error) {
            console.error("Error executing LiFi quote:", error);
            throw error;
        }
    }
}
