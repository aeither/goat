import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { dailyWiserPlugin } from "@goat-sdk/plugin-dw";
import { Token, erc721 } from "@goat-sdk/plugin-erc721";

import { sendETH } from "@goat-sdk/wallet-evm";
import { viem } from "@goat-sdk/wallet-viem";

require("dotenv").config();

const NIFTY: Token = {
    chains: {
        "11155111": {
            contractAddress: "0xREPLACE_WITH_YOUR_ADDRESS",
        },
    },
    name: "NIFTY",
    symbol: "NIFTY",
};

const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);

const walletClient = createWalletClient({
    account: account,
    transport: http(process.env.RPC_PROVIDER_URL),
    chain: sepolia,
});

(async () => {
    const tools = await getOnChainTools({
        wallet: viem(walletClient),
        plugins: [dailyWiserPlugin(), sendETH(), erc721({ tokens: [NIFTY] })],
    });

    const example = '{ "title": "General Knowledge Quiz", "questions": [{ "question": "What is the capital of France?", "options": ["Berlin", "Madrid", "Paris", "Rome"], "correctAnswer": 2 }, { "question": "What is 2 + 2?", "options": ["3", "4", "5", "6"], "correctAnswer": 1 }], "reward": 10 }'


    const result = await generateText({
        model: openai("gpt-4o-mini"),
        tools: tools,
        maxSteps: 5,
        prompt: `create a quiz with info: ${example}`,
        onStepFinish(event) {
            console.log(event);
            
        },
    });

    console.log(result.text);
})();
