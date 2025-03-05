import { createConfig, executeRoute, getRoutes } from "@lifi/sdk";
import { http, createPublicClient, createWalletClient, parseAbi, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";

// Configure Viem clients
const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(),
});

const privateKey = "0x..."; // Replace with your private key
const account = privateKeyToAccount(privateKey);

const walletClient = createWalletClient({
    account,
    chain: mainnet,
    transport: http(),
});

// Configure LI.FI
const lifiConfig = createConfig({
    integrator: "your-integrator-name",
    // Add any necessary configuration
});

async function swap(fromToken: string, toToken: string, amount: string) {
    try {
        const fromAddress = account.address;

        // Get token decimals
        const decimalsAbi = parseAbi(["function decimals() view returns (uint8)"]);
        const decimals = await publicClient.readContract({
            address: fromToken as `0x${string}`,
            abi: decimalsAbi,
            functionName: "decimals",
        });

        // Get routes from LI.FI
        const routes = await getRoutes({
            fromChainId: 1, // Mainnet
            toChainId: 1, // Mainnet
            fromTokenAddress: fromToken,
            toTokenAddress: toToken,
            fromAmount: parseUnits(amount, decimals).toString(),
            fromAddress: fromAddress,
        });

        if (!routes.routes.length) throw new Error("No routes found");

        // Execute the best route
        const execution = await executeRoute(routes.routes[0], lifiConfig);
        const process = execution.steps[0]?.execution?.process[0];

        if (!process?.status || process.status === "FAILED") {
            throw new Error("Transaction failed");
        }

        console.log("Swap successful!");
        console.log("Transaction hash:", process.txHash);
    } catch (error) {
        console.error("Error during swap:", error.message);
    }
}

// Example usage
const fromToken = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC
const toToken = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // WETH
const amount = "100"; // 100 USDC

swap(fromToken, toToken, amount);
