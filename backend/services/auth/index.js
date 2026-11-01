import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js";
import authRouter from "./router/auth.route.js";

const app = express();

app.use(express.json()); // express.json() parses incoming JSON request bodies and makes the data available through req.body.
app.use(cookieParser()); // cookieParser() → reads cookies

const PORT = process.env.PORT || 6001;

app.get("/", (req, res) => {
  res.send("Hello from Auth service");
});

app.use("/", authRouter);

app.listen(PORT, () => {
  console.log(`Auth service is running on ${PORT}`);
  connectDB();
});
