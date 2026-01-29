import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// TEMP DB (replace with Supabase later)
const payments = {};

/* ===============================
   HEALTH CHECK
=============================== */
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

/* ===============================
   CREATE ORDER
=============================== */
app.post("/create-order", async (req, res) => {
    const { amount } = req.body;

    try {
        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: "INR"
        });

        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ===============================
   VERIFY PAYMENT
=============================== */
app.post("/verify-payment", (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        clientId
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        payments[clientId] = true;
        res.json({ success: true });
    } else {
        res.status(400).json({ success: false });
    }
});

/* ===============================
   PAYMENT STATUS
=============================== */
app.get("/payment-status/:clientId", (req, res) => {
    res.json({ paid: payments[req.params.clientId] === true });
});

/* ===============================
   START SERVER
=============================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
