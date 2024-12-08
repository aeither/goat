import { z } from "zod";

export const getCryptoNewsParametersSchema = z.object({
	limit: z.number().optional().describe("The number of trending coins to return. Defaults to all coins."),
	include_platform: z.boolean().optional().describe("Include platform contract addresses (e.g., ETH, BSC) in response"),
});
