import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db.js";
import billingRouter from "./routes/billing.route.js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 6004;

app.get("/", (req, res) => {
  res.send("Hello from Billing-service");
});

app.use("/", billingRouter);

app.listen(PORT, () => {
  console.log(`Billing service is running on PORT ${PORT}`);
  connectDB();
});
