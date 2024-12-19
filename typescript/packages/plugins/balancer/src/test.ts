import { BalancerApi, ChainId, SwapKind, Token, TokenAmount } from "@balancer/sdk";


const chainId = ChainId.MAINNET;
const swapKind = SwapKind.GivenIn;
const tokenIn = new Token(
    chainId,
    "0x2416092f143378750bb29b79ed961ab195cceea5",
    18,
    "WETH"
);
const swapAmount = TokenAmount.fromHumanAmount(tokenIn, "0.00001");

const tokenOut = new Token(
    chainId,
    "0x2416092f143378750bb29b79ed961ab195cceea5",
    18,
    "ezETH"
);

const main = async () => {

    const balancerApi = new BalancerApi(
        'https://api-v3.balancer.fi/',
        ChainId.MODE,
    );

    const sorPaths = await balancerApi.sorSwapPaths.fetchSorSwapPaths({
        chainId: ChainId.MODE,
        tokenIn: tokenIn.address,
        tokenOut: tokenOut.address,
        swapKind: swapKind,
        swapAmount: swapAmount,
    });
    console.log("🚀 ~ main ~ sorPaths:", sorPaths)

};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
