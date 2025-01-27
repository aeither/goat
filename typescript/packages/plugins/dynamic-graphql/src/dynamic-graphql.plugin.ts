import { PluginBase } from "@goat-sdk/core";
import { DynamicGraphqlService } from "./dynamic-graphql.service";

export class DynamicGraphqlPlugin extends PluginBase {
    constructor() {
        super("dynamic-graphql", [new DynamicGraphqlService()]);
    }

    supportsChain = () => true;
}

export function dynamicgraphql() {
    return new DynamicGraphqlPlugin();
}
