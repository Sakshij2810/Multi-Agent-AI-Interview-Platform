import { llm } from "../config/llm.js";
import { summaryPrompt } from "../prompts/summaryPrompt.js";

// data : {role, type, questions}
export const summaryAgent = async (data) => {
  let response;
  try {
    const prompt = summaryPrompt(data);

    response = await llm.invoke(prompt);

    const cleaned = response.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.log("Summary Agent Parse Error");
    console.log("LLM response", response?.content);

    throw new Error("Failed to generate Summary");
  }
};
