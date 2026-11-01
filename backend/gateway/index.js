import express from "express";
import dotenv from "dotenv";
dotenv.config();
import proxy from "express-http-proxy";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

import { isAuth } from "./middleware/isAuth.js";
import { getCurrentUser } from "./controllers/user.controller.js";
import { proxyWithHeaders } from "./utils/proxyWithHeaders.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

// Cross-Origin Resource Sharing : CORS controls which frontend origins can access the backend. credentials: true allows cookies/credentials to be used in cross-origin requests.
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(morgan("dev")); // Middleware that logs HTTP requests and responses in the server console, mainly useful for debugging and monitoring.

const PORT = process.env.PORT || 6000;

app.get("/", (req, res) => {
  res.send("Hello from Gatway");
});

// proxy usage
/*  proxy(...) → the actual middleware --- Middleware is basically a function that sits between the incoming request and the final response. 
// proxyWithHeaders creates and returns a proxy middleware that forwards the incoming request to another service, while adding the authenticated user's ID to the forwarded request headers.
*/

app.use("/api/auth", proxy(process.env.AUTH_SERVICE_URL));
app.use(
  "/api/resume",
  isAuth,
  proxyWithHeaders(process.env.RESUME_SERVICE_URL),
);
app.use(
  "/api/interview",
  isAuth,
  proxyWithHeaders(process.env.INTERVIEW_SERVICE_URL),
);
app.use(
  "/api/billing",
  isAuth,
  proxyWithHeaders(process.env.BILLING_SERVICE_URL),
);

// user routes
app.get("/api/me", isAuth, getCurrentUser);

app.listen(PORT, () => {
  console.log(`Gatway is running on ${PORT}`);
});
