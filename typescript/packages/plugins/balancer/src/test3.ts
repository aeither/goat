import {
    createPublicClient,
    createWalletClient,
    http,
    parseAbi,
    parseUnits
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'

// Balancer Vault contract
const BALANCER_VAULT = '0xBA12222222228d8Ba445958a75a0704d566BF2C8'
const BALANCER_VAULT_ABI = parseAbi([
    'function swap(tuple(bytes32 poolId, uint8 kind, address assetIn, address assetOut, uint256 amount, bytes userData) singleSwap, tuple(address sender, address recipient, uint256 limit, uint256 deadline) funds) external payable returns (uint256 amountCalculated)'
])

// Configure clients
const publicClient = createPublicClient({
    chain: mainnet,
    transport: http()
})

// TODO
const account = privateKeyToAccount('')
const walletClient = createWalletClient({
    account,
    chain: mainnet,
    transport: http()
})

async function executeSwap() {
    const tokenIn = '0x6B175474E89094C44Da98b954EedeAC495271d0F' // DAI
    const tokenOut = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' // WETH
    const poolId = '0x0b09dea16768f0799065c475be02919503cb2a3500020000000000000000001a'
    const amountIn = parseUnits('100', 18) // Swap 100 DAI

    const swapParams = {
        poolId,
        kind: 0, // GIVEN_IN
        assetIn: tokenIn,
        assetOut: tokenOut,
        amount: amountIn,
        userData: '0x'
    }

    const funds = {
        sender: account.address,
        recipient: account.address,
        limit: 0n, // Min amount out (0 for no limit)
        deadline: BigInt(Math.floor(Date.now() / 1000) + 3600) // 1 hour deadline
    }

    // Approve token spending
    const erc20Abi = parseAbi([
        'function approve(address spender, uint256 amount) external returns (bool)'
    ])

    const hash = await walletClient.writeContract({
        address: tokenIn,
        abi: erc20Abi,
        functionName: 'approve',
        args: [BALANCER_VAULT, amountIn]
    })

    await publicClient.waitForTransactionReceipt({ hash })

    // Execute swap
    const swapHash = await walletClient.writeContract({
        address: BALANCER_VAULT,
        abi: BALANCER_VAULT_ABI,
        functionName: 'swap',
        args: [swapParams, funds]
    })

    const receipt = await publicClient.waitForTransactionReceipt({ hash: swapHash })
    console.log('Swap successful:', swapHash)
    return receipt
}

executeSwap().catch(console.error)
