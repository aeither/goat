import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { PEPE, USDC, erc20 } from "@goat-sdk/plugin-erc20";
import { watcher } from "@goat-sdk/plugin-watcher";

import { sendETH } from "@goat-sdk/core";
import { viem } from "@goat-sdk/wallet-viem";

require("dotenv").config();

const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);

const walletClient = createWalletClient({
    account: account,
    transport: http(process.env.RPC_PROVIDER_URL),
    chain: sepolia,
});

(async () => {
	const tools = await getOnChainTools({
		wallet: viem(walletClient),
		plugins: [
			watcher({apiKey: "apiKey"}),
			sendETH(),
			erc20({ tokens: [USDC, PEPE] })],
	});

	const result = await generateText({
		model: openai("gpt-4o-mini"),
		tools: tools,
		maxSteps: 5,
		prompt: "get latest news about ethereum",
	});

	console.log(result.text);
})();
