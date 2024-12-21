import { type Chain, PluginBase, WalletClientBase } from "@goat-sdk/core";
import { DailyWiserTools } from "./erc20.service";

export class DailyWiserPlugin extends PluginBase<WalletClientBase> {
    constructor() {
        super("dailywiser", [new DailyWiserTools()]); // Pass DailyWiserTools as an array
    }

    supportsChain(chain: Chain): boolean {
        return chain.type === "evm"; // Support EDU chain
    }
}

export function dailyWiserPlugin() {
    return new DailyWiserPlugin();
}
