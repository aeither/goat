import { createToolParameters } from "@goat-sdk/core";
import type { Address } from "viem";
import { z } from "zod";

const swapParametersSchema = z.object({
    chain: z.string(),
    fromToken: z.custom<Address>(),
    toToken: z.custom<Address>(),
    amount: z.string(),
    slippage: z.number().optional(),
});

export class SwapParameters extends createToolParameters(swapParametersSchema) {}

export type SwapParametersType = z.infer<typeof swapParametersSchema>;

export class ExampleParameters extends createToolParameters(
    z.object({
        exampleField: z.string().describe("An example field"),
    }),
) {}
