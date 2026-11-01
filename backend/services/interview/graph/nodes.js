import { feedbackAgent } from "../agents/feedback.agent.js";
import { interviewAgent } from "../agents/interview.agent.js";
import { summaryAgent } from "../agents/summary.agent.js";

// interviewNode : Takes interview details from state and generates questions
export const interviewNode = async (state) => {
  const questions = await interviewAgent({
    role: state.role,
    type: state.type,
    useResume: state.useResume,
    resume: state.resume,
  });

  // Return the generated questions back to state
  return { questions };
};

// feedbackNode : Takes the current question and user's answer and generates feedback
export const feedbackNode = async (state) => {
  const feedback = await feedbackAgent({
    question: state.question,
    answer: state.answer,
    difficulty: state.difficulty,
  });

  // Return feedback back to state
  return { feedback };
};

// summaryNode : Creates the final interview summary/report
export const summaryNode = async (state) => {
  const report = await summaryAgent({
    type: state.type,
    role: state.role,
    questions: state.questions,
  });

  // Return the final summary to state
  return { report };
};
