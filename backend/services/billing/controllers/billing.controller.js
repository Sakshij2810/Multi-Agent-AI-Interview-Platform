import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Billing from "../models/billing.model.js";

// create plans -> Free, starter
const PLANS = {
  starter: {
    amount: 199,
    interviewCoins: 300,
  },
};

// create order
export const createOrder = async (req, res) => {
  try {
    // 1. Get planId from req.body | userId from req.headers  -> get plan -> validate plan

    const { planId } = req.body;

    const userId = req.headers["x-user-id"];
    const plan = PLANS[planId];

    if (!plan) {
      return res.status(400).json({ success: false, message: "Invalid plan" });
    }

    // 2. Create an order through Razorpay
    const order = await razorpay.orders.create({
      amount: plan.amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // 3. Save a billing record in MongoDB
    await Billing.create({
      userId,
      amount: plan.amount,
      interviewCoins: plan.interviewCoins,
      razorpayOrderId: order.id,
      status: "created",
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// verify Payment
/* 1. The backend creates a Razorpay order and returns the order details to the frontend.
2. The frontend opens Razorpay Checkout using the order ID.
3. After the customer completes payment, Razorpay Checkout returns:
   → razorpay_payment_id
   → razorpay_order_id
   → razorpay_signature
4. The frontend sends these values to the backend's verify-payment endpoint.
5. The backend verifies the payment signature using the Razorpay key secret.
6. If the signature is valid, mark the billing record as paid and credit the user's interview coins.
7. If verification fails, return an error.
*/

export const verifyPayment = async (req, res) => {
  try {
    // 1. get frontend fields and find payment using razorpay_order_id, if not found return
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const payment = await Billing.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });
    }

    //  2. Generate the expected payment signature
    const genSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // 3.Compare the generated signature with the signature received from Razorpay.
    if (genSign !== razorpay_signature) {
      payment.status = "failed";
      payment.save();

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // 4. Check whether the payment is already marked as paid.
    if (payment.status === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
      });
    }

    // 5. now update payment
    payment.status = "paid";
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;

    await payment.save();

    return res.status(200).json({
      success: true,
      message: "Payment successful",
    });
  } catch (error) {
    console.log(error);

    // if an order ID is available, attempt to mark its billing record as failed
    if (req.body?.razorpay_order_id) {
      await Billing.findOneAndUpdate(
        { razorpayOrderId: req.body.razorpay_order_id },
        { status: "failed" },
      );
    }

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};
