import express from "express";
import {
  getAllInterviews,
  getInterview,
  startInterview,
  submitAnswer,
} from "../controllers/interview.controller.js";

const interviewRouter = express.Router();

interviewRouter.post("/start", startInterview);
interviewRouter.post("/answer", submitAnswer);
interviewRouter.get("/all", getAllInterviews); // Keep this route before `/:id` so Express matches `/all` correctly instead of treating "all" as an ID.
interviewRouter.get("/:id", getInterview);

export default interviewRouter;
