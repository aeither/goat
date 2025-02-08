import { PluginBase } from "@goat-sdk/core";
import { LifiService } from "./lifi.service";

export class LifiPlugin extends PluginBase {
    constructor() {
        super("lifi", [new LifiService()]);
    }

    supportsChain = () => true;
}

export function lifi() {
    return new LifiPlugin();
}
