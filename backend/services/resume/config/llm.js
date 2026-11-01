import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";
dotenv.config();

export const llm = new ChatGroq({
  // model: "llama-3.3-70b-versatile",
  model: "openai/gpt-oss-120b",
  temperature: 0.2,
  maxTokens: 5000,
  maxRetries: 2,
  // other params...
});
