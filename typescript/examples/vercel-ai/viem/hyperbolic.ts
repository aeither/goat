import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

require("dotenv").config();

const openai = createOpenAI({
    apiKey: process.env.HYPERBOLIC_API_KEY,
    baseURL: 'https://api.hyperbolic.xyz/v1',
});

(async () => {
    const result = await generateText({
        model: openai("meta-llama/Meta-Llama-3.1-70B-Instruct"),
        prompt: "Hi Hyperbolic",
    });

    console.log(result.text);
})();
