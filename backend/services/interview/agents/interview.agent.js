import { llm } from "../config/llm.js";
import { hrInterviewPrompt } from "../prompts/hrInterviewPrompt.js";
import { technicalInterviewPrompt } from "../prompts/technicalInterviewPrompt.js";

// data: {role, type, useResume, resume}
export const interviewAgent = async (data) => {
  let response;
  try {
    const prompt =
      data.type?.toLowerCase() === "hr"
        ? hrInterviewPrompt(data)
        : technicalInterviewPrompt(data);

    response = await llm.invoke(prompt);
    console.log("response.....", response);

    const cleaned = response.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Interview Agent Error:", error);
    console.error("Error message:", error.message);
    console.error("Error status:", error.status);
    console.error("Error code:", error.code);
    console.error("LLM response:", response?.content);

    throw new Error("Failed to generate interview questions.", {
      cause: error,
    });
  }
};
