import { createToolParameters } from "@goat-sdk/core";
import { z } from "zod";

export class QuizParameters extends createToolParameters(
    z.object({
        title: z.string(),
        questions: z.array(z.object({
            question: z.string(),
            options: z.array(z.string()),
            correctAnswer: z.number()
        })),
        reward: z.number().optional()
    })
) { }
