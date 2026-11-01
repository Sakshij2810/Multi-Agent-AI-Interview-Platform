import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { llm } from "../config/llm.js";
import { resumeScorerPrompt } from "../prompt/resumeScorerPrompt.js";

export const resumeAgent = async (resumeText) => {
  let response;
  try {
    const prompt = resumeScorerPrompt();

    response = await llm.invoke([
      new SystemMessage(prompt),

      new HumanMessage(resumeText),
    ]);

    return response.content;
  } catch (error) {
    console.log("Resume Scorer Agent Parse Error", error);
    console.log("LLM response", response?.content);

    throw new Error("Failed to generate resume score.");
  }
};
