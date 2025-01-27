import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { GraphQLParameters } from "./parameters";

export class DynamicGraphqlService {
    @Tool({
        name: "query_graphql",
        description: "Execute a GraphQL query against a specified endpoint",
    })
    async executeQuery(walletClient: EVMWalletClient, parameters: GraphQLParameters) {
        const response = await fetch(parameters.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(parameters.headers || {}),
            },
            body: JSON.stringify({
                query: parameters.query,
                variables: parameters.variables,
            }),
        });

        if (!response.ok) {
            throw new Error(`GraphQL request failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    }
}
