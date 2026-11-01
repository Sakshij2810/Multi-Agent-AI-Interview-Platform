import { graph } from "../graph/graph.js";
import redis from "../../../shared/redis/redis.js";
import Interview from "../model/interview.model.js";

// startInterview
/*
1. Get userId from request headers

2. Get interview data from req.body
   → type
   → role
   → useResume
   → resume

3. Validate type and role

4. Call LangGraph
   → action = "start"
   → pass role, type, useResume, resume

5. Get generated questions from graph result

6. Check if questions were generated
   → if empty → return error

7. Create interview in MongoDB
   → userId
   → type
   → role
   → useResume
   → questions
   → currentQuestion = 0
   → status = "in-progress"

8. Clear user's interview cache from Redis

9. Send response
   → interviewId
   → currentQuestion
   → totalQuestions
   → first question

10. Catch errors → return 500
*/

export const startInterview = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const { type, role, useResume, resume } = req.body;

    if (!type || !role) {
      return res.status(400).json({
        success: false,
        message: "Interview type and role are required",
      });
    }

    const result = await graph.invoke({
      action: "start",
      role,
      type,
      useResume,
      resume,
    });

    const questions = result.questions;

    if (!questions || questions.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate interview questions",
      });
    }

    const interview = await Interview.create({
      userId,
      type,
      role,
      useResume,
      currentQuestion: 0,
      questions,
      status: "in-progress",
    });

    await redis.del(`interviews:${userId}`);

    return res.status(200).json({
      success: true,
      message: "Interview started successfully",
      interviewId: interview._id,
      currentQuestion: interview.currentQuestion,
      totalQuestions: interview.questions.length,
      question: interview.questions[0],
    }); // dont send entire interview : security/business logic reason -> If all questions are sent to the browser at the beginning, the user can potentially inspect the network response and see the entire interview.
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// submitAnswer
/*
1. Get userId from request headers
2. Get interviewId and answer from req.body
3. Validate interviewId and answer

4. Find interview in MongoDB
   → match interviewId + userId

5. Check if interview exists
   → if not → 404

6. Check interview status
   → if already completed → return error

7. Get current question
   → currentQuestion = questions[currentQuestion index]

8. Check if current question exists
9. Save user's answer to current question

10. Check whether this is the last question
    → completed = true / false

11. Call LangGraph
    → action = "feedback"
    → pass question, answer, difficulty
    → pass completed
    → pass role, type, questions

12. Get feedback from graph result
13. Save feedback to current question
14. Increase currentQuestion index

15. If interview is completed:
    → change status to "completed"
    → save overallScore
    → save summary
    → save strengths
    → save weaknesses
    → save recommendations
    → save interview to MongoDB
    → clear Redis cache
    → return final interview result

16. If interview is NOT completed:
    → save interview to MongoDB
    → clear Redis cache
    → return next question + feedback

17. Catch errors → return 500
*/

export const submitAnswer = async (req, res) => {
  try {
    // 1. Get userId from request headers ->  2. Get interviewId and answer from req.body -> 3. Validate interviewId and answer
    const userId = req.headers["x-user-id"];
    const { interviewId, answer } = req.body;

    if (!interviewId || !answer) {
      return res.status(400).json({
        success: false,
        message: "Interview ID and answer are required",
      });
    }

    // 4. Find interview in MongoDB -> 5. Check if interview exists -> 6. Check interview status
    const interview = await Interview.findOne({ _id: interviewId, userId });

    if (!interview) {
      return res
        .status(404)
        .json({ success: false, message: "Interview not found" });
    }

    if (interview.status === "completed") {
      return res
        .status(400)
        .json({ success: false, message: "Interview already completed" });
    }

    // 7. Get current question -> 8. Check if current question exists
    const index = interview.currentQuestion;
    const currentQuestion = interview.questions[index];

    if (!currentQuestion) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid question index" });
    }

    // 9. Save user's answer to current question -> 10. Check whether this is the last question
    currentQuestion.userAnswer = answer;

    const completed =
      interview.currentQuestion + 1 >= interview.questions.length;

    // 11. Call LangGraph
    const result = await graph.invoke({
      action: "feedback",
      question: currentQuestion.question,
      answer,
      difficulty: currentQuestion.difficulty,
      completed,
      role: interview.role,
      type: interview.type,
      questions: interview.questions,
    });

    // 12. Get feedback from graph result -> 13. Save feedback to current question -> 14. Increase currentQuestion index
    const feedback = result.feedback;
    currentQuestion.feedback = feedback;
    interview.currentQuestion++;

    // 15. If interview is completed: save report fields → clear Redis cache  -> return final interview result
    if (completed) {
      interview.status = "completed";
      interview.overallScore = result.report.overallScore;
      interview.summary = result.report.summary;
      interview.strengths = result.report.strengths;
      interview.weaknesses = result.report.weaknesses;
      interview.recommendations = result.report.recommendations;

      await interview.save();

      await redis.del(`interviews:${userId}`);

      return res.status(200).json({
        success: true,
        completed: true,
        interview,
        feedback: result.feedback,
      });
    }

    // 16. If interview is NOT completed: → save interview to MongoDB → clear Redis cache → return next question + feedback
    await interview.save();

    await redis.del(`interviews:${userId}`);

    return res.status(200).json({
      success: true,
      completed: false,
      currentQuestion: interview.currentQuestion,
      question: interview.questions[interview.currentQuestion],
      feedback: result.feedback,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// getInterview

export const getInterview = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "interviewId is required" });
    }

    const interview = await Interview.findOne({ _id: id, userId });

    if (!interview) {
      return res
        .status(404)
        .json({ success: false, message: "Interview not found" });
    }

    return res.status(200).json({ success: true, interview });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// getAllInterviews
export const getAllInterviews = async (req, res) => {
  try {
    // 1. Get the user’s ID from the request headers.
    const userId = req.headers["x-user-id"];

    // 2. check in Redis for data -> if present return data
    const cache = await redis.get(`interviews:${userId}`);

    if (cache) {
      console.log("✅ Data served from Redis");
      return res.status(200).json(JSON.parse(cache));
    }

    // 3. If no cache -> fetch all interviews of user from MongoDB -> then get all completed interviews
    const interviews = await Interview.find({ userId }).sort({ createdAt: -1 });
    const completedInterviews = interviews?.filter(
      (interview) => interview.status === "completed",
    );

    // 4. calculate dashboard stats :totalInterviews, totalQuestions, completed, averageScore

    const totalQuestions = completedInterviews.reduce(
      (sum, interview) => sum + interview.questions.length,
      0,
    );

    const averageScore =
      completedInterviews.length > 0
        ? Number(
            (
              completedInterviews.reduce(
                (sum, interview) => sum + interview.overallScore,
                0,
              ) / completedInterviews.length
            ).toFixed(1),
          )
        : 0;

    /*
    1. toFixed(1):formats a number to 1 digit after the decimal point. ->    (87.666).toFixed(1) // "87.7"
   2.  But toFixed() returns a string, not a number. So Number(...) converts that formatted string back into a numbe
        */

    const stats = {
      totalInterviews: interviews.length,
      totalQuestions,
      completed: completedInterviews.length,
      averageScore,
    };

    // 5. create a helper function that calculates average feedback scores for a list (techincal , hr) of interviews.
    const getAverageData = (list) => {
      // - generate defaultFeedbackScore
      const defaultFeedbackScore = [
        { skill: "Correctness", score: 0 },
        { skill: "Clarity", score: 0 },
        { skill: "Relevance", score: 0 },
        { skill: "Detail", score: 0 },
        { skill: "Efficiency", score: 0 },
        { skill: "Communication", score: 0 },
        { skill: "Problem solving", score: 0 },
        { skill: "Creativity", score: 0 },
      ];

      // - If the list is empty, return all skill scores as 0.
      if (list.length < 0) {
        return defaultFeedbackScore;
      }

      // - Otherwise, add up each feedback category across the questions.

      // default total score values
      const totalScore = {
        correctness: 0,
        clarity: 0,
        relevance: 0,
        detail: 0,
        efficiency: 0,
        communication: 0,
        problemSolving: 0,
        creativity: 0,
      };

      list.forEach((interview) => {
        interview.questions.forEach((q) => {
          totalScore.correctness += q.feedback.correctness || 0;
          totalScore.clarity += q.feedback.clarity || 0;
          totalScore.relevance += q.feedback.relevance || 0;
          totalScore.detail += q.feedback.detail || 0;
          totalScore.efficiency += q.feedback.efficiency || 0;
          totalScore.communication += q.feedback.communication || 0;
          totalScore.problemSolving += q.feedback.problemSolving || 0;
          totalScore.creativity += q.feedback.creativity || 0;
        });
      });

      // - for cal avg -> count all questions length present in this list
      const count = list.reduce(
        (sum, interview) => sum + interview.questions.length,
        0,
      );

      if (count === 0) {
        return defaultFeedbackScore;
      }

      return [
        {
          skill: "Correctness",
          score: Math.round(totalScore.correctness / count),
        },
        {
          skill: "Clarity",
          score: Math.round(totalScore.clarity / count),
        },

        {
          skill: "Relevance",
          score: Math.round(totalScore.relevance / count),
        },

        {
          skill: "Detail",
          score: Math.round(totalScore.detail / count),
        },

        {
          skill: "Efficiency",
          score: Math.round(totalScore.efficiency / count),
        },

        {
          skill: "Communication",
          score: Math.round(totalScore.communication / count),
        },

        {
          skill: "Problem solving",
          score: Math.round(totalScore.problemSolving / count),
        },

        {
          skill: "Creativity",
          score: Math.round(totalScore.creativity / count),
        },
      ];
    };

    // 6. create payload -> technicalInterviews, hrInterviews, technicalData, hrData, technicalCount, hrCount

    const technicalInterviews = completedInterviews.filter(
      (interview) => interview.type === "technical",
    );

    const hrInterviews = completedInterviews.filter(
      (interview) => interview.type === "hr",
    );

    const technicalData = getAverageData(technicalInterviews);
    const hrData = getAverageData(hrInterviews);

    const technicalCount = technicalInterviews.length;
    const hrCount = hrInterviews.length;

    const payload = {
      success: true,
      interviews,
      stats,
      technicalData,
      hrData,
      technicalCount,
      hrCount,
    };

    await redis.set(`interviews:${userId}`, JSON.stringify(payload), "EX", 600);

    return res.status(200).json(payload);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
