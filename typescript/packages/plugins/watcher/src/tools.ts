import type { DeferredTool, EVMWalletClient } from "@goat-sdk/core";

import { z } from "zod";
import {
    getCryptoNewsParametersSchema,
} from "./parameters";

async function fetchCryptoNews(coinId: string) {
    console.log()
    return "bitcoin surpassed 100000 before december, unexpected!!!"
}

export function getTools(credentials: {
	apiKey: string;
}): DeferredTool<any>[] {
    const tools: DeferredTool<any>[] = [];

    const getCryptoNewsTool: DeferredTool<any> = {
        name: 'get_crypto_news',
        description: 'This {{tool}} fetches the latest crypto news',
        parameters: getCryptoNewsParametersSchema,
        method: async (walletClient: EVMWalletClient, parameters: z.infer<typeof getCryptoNewsParametersSchema>) => fetchCryptoNews(credentials.apiKey),
    };

    tools.push(
        getCryptoNewsTool,
    );

    return tools;
}
