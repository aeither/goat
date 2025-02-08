import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { ExampleParameters } from "./parameters";

export class LifiService {
    @Tool({
        name: "lifi_example",
        description: "An example method in LifiService",
    })
    async doSomething(walletClient: EVMWalletClient, parameters: ExampleParameters) {
        // Implementation goes here
        return "Hello from LifiService!";
    }
}
