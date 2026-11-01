import { feedbackNode, interviewNode, summaryNode } from "./nodes.js";
import { InterviewState } from "./state.js";
import { END, START, StateGraph } from "@langchain/langgraph";

// state : {action, type, role, useResume, resume, questions, question, answer, difficulty, feedback, report, completed}

// Router --> checks the action in state and decides which node should run first
function router(state) {
  switch (state.action) {
    case "start":
      return "interviewAgent";

    case "feedback":
      return "feedbackAgent";

    default:
      return END;
  }
}

// Feedback Router -->  checks if the interview is completed -  If completed → generate summary - Otherwise → end the graph
function feedbackRouter(state) {
  if (state.completed) {
    return "summaryAgent";
  }

  return END;
}

// Create the graph using our InterviewState
export const graph = new StateGraph(InterviewState)
  // Add all nodes to the graph

  .addNode("interviewAgent", interviewNode) // "interviewAgent" → node name | interviewNode → function that runs
  .addNode("feedbackAgent", feedbackNode)
  .addNode("summaryAgent", summaryNode)

  // add all edges - (source, path, pathMap )

  .addConditionalEdges(START, router, {
    interviewAgent: "interviewAgent",
    feedbackAgent: "feedbackAgent",
  })
  .addEdge("interviewAgent", END)
  .addConditionalEdges("feedbackAgent", feedbackRouter, {
    summaryAgent: "summaryAgent",
    [END]: END,
  })
  .addEdge("summaryAgent", END)
  .compile();
