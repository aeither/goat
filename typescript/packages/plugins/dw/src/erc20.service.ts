import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { ERC20_ABI } from "./abi";
import { QuizParameters } from "./parameters";

export class DailyWiserTools {
    @Tool({
        name: "create_quiz",
        description: "Create an educational quiz with optional reward points",
    })
    async createQuiz(walletClient: EVMWalletClient, parameters: QuizParameters) {
        const { title, questions, reward } = parameters;

        // Store quiz on chain
        const quizData = {
            title,
            questions,
            reward: reward || 0,
            creator: await walletClient.getAddress()
        };
        console.log("🚀 ~ DailyWiserTools ~ createQuiz ~ quizData:", quizData)

        const transaction = await walletClient.sendTransaction({
            to: "DAILYWISER_CONTRACT_ADDRESS",
            // data: quizData,
            abi: ERC20_ABI,
            args: [],
            functionName: ""
        });

        // const to = await walletClient.resolveAddress(parameters.to);
        const hash = await walletClient.sendTransaction({
            to: "parameters.tokenAddress",
            abi: ERC20_ABI,
            functionName: "transfer",
            args: ["to", 3],
        });

        return {
            quizId: transaction.hash,
            status: "created"
        };
    }
}
