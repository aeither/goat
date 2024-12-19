import { type Chain, PluginBase } from "@goat-sdk/core";
import { BalancerService } from "./balancer.service";

export class BalancerPlugin extends PluginBase {
    constructor() {
        super("balancer", [new BalancerService()]);
    }

    supportsChain = (chain: Chain) => chain.type === "evm";
}

export const balancer = () => new BalancerPlugin();
