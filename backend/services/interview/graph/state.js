import { Annotation } from "@langchain/langgraph";

// Create the shared state for the interview graph
// Add all the data that our nodes will need

export const InterviewState = Annotation.Root({
  action: Annotation(), // start, feedback
  type: Annotation(), // hr, technical
  role: Annotation(), // interview role

  useResume: Annotation(), // whether to use resume
  resume: Annotation(), // user's resume

  questions: Annotation(), // generated interview questions

  // Current question information
  question: Annotation(),
  answer: Annotation(),
  difficulty: Annotation(),

  feedback: Annotation(), // feedback for the answer

  // Final interview result
  report: Annotation(),

  completed: Annotation(), // true when interview is completed
});
