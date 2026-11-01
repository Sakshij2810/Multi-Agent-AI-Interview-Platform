import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import resumeRouter from "./router/resume.route.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 6002;

app.get("/", (req, res) => {
  res.send("Hello from resume-service");
});

// resume routes
app.use("/", resumeRouter);

app.listen(PORT, () => {
  console.log(`Resume service is running on ${PORT}`);
  connectDB();
});
