import mongoose from "mongoose";

const billingSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    interviewCoins: {
      type: Number,
      required: true,
    },

    razorpayOrderId: String, // The order ID returned by Razorpay when the backend creates an order.
    razorpayPaymentId: String, // The payment ID returned by Razorpay Checkout after the customer completes payment.
    razorpaySignature: String, // The signature returned by Razorpay Checkout, used by the backend to verify the payment.
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      required: true,
      default: "created",
    },
  },
  { timestamps: true },
);

const Billing = mongoose.model("Billing", billingSchema);
export default Billing;
