import { createToolParameters } from "@goat-sdk/core";
import { z } from "zod";

export class GraphQLParameters extends createToolParameters(
    z.object({
        endpoint: z.string().describe("The GraphQL endpoint URL"),
        query: z.string().describe("The GraphQL query string"),
        variables: z.record(z.any()).optional().describe("Optional variables for the GraphQL query"),
        headers: z.record(z.string()).optional().describe("Optional headers for the GraphQL request"),
    }),
) {}
