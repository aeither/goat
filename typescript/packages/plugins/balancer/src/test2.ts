import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { routerAbi } from "./routerAbi";


const RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/4jkGGzC_RvvRnyDGvztkl9UZzqUzs-LV"
const routerAddress = "0x0BF61f706105EA44694f2e92986bD01C39930280"

const main = async () => {
    // Query operation
    const client = createPublicClient({
        transport: http(RPC_URL),
        chain: sepolia,
    });

    const { result: amountOut } = await client.simulateContract({
        address: routerAddress,
        abi: routerAbi,
        functionName: "querySwapSingleTokenExactIn",
        args: [
            "0x1e5b830439fce7aa6b430ca31a9d4dd775294378", // pool address
            "0xb19382073c7a0addbb56ac6af1808fa49e377b75", // tokenIn
            "0xf04378a3ff97b3f979a46f91f9b2d5a1d2394773", // tokenOut
            1000000000000000000n, // exactAmountIn
            "0x", // userData
        ],
    });
    console.log("🚀 ~ main ~ amountOut:", amountOut)

    // // Sending transaction
    // const walletClient = createWalletClient({
    //     chain: sepolia,
    //     transport: http(RPC_URL),
    // });

    // const hash = await walletClient.writeContract({
    //     address: routerAddress,
    //     abi: routerAbi,
    //     functionName: "swapSingleTokenExactIn",
    //     args: [
    //         "0x1e5b830439fce7aa6b430ca31a9d4dd775294378", // pool address
    //         "0xb19382073c7a0addbb56ac6af1808fa49e377b75", // tokenIn
    //         "0xf04378a3ff97b3f979a46f91f9b2d5a1d2394773", // tokenOut
    //         1000000000000000000n, // exactAmountIn
    //         900000000000000000n, // minAmountOut
    //         999999999999999999n, // Deadline, in this case infinite
    //         false, // wethIsEth for Eth wrapping
    //         "0x", // userData
    //     ],
    //     account: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    // });
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
