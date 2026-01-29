import express from "express";
import Razorpay from "razorpay";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
import nodemailer from "nodemailer";

/* =========================
   EMAIL CONFIG
========================= */
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/* =========================
   CONTACT FORM API
========================= */
app.post("/send-message", async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "All fields required" });
    }

    try {
        await transporter.sendMail({
            from: `"FinDrive Contact" <${process.env.EMAIL_USER}>`,
            to: "padarthikirankumar8@gmail.com",
            subject: `📩 Contact Form: ${subject}`,
            html: `
                <h3>New Contact Message</h3>
                <p><b>Name:</b> ${name}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Subject:</b> ${subject}</p>
                <p><b>Message:</b><br/>${message}</p>
            `
        });

        res.json({ success: true });
    } catch (err) {
        console.error("Mail error:", err);
        res.status(500).json({ error: "Email failed" });
    }
});


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

/* =========================
   CREATE ORDER
========================= */
app.post("/create-order", async (req, res) => {
    try {
        const { amount } = req.body; // amount in paise

        const order = await razorpay.orders.create({
            amount,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        });

        res.json(order);
    } catch (err) {
        console.error("Order creation failed", err);
        res.status(500).json({ error: "Order creation failed" });
    }
});

/* =========================
   VERIFY PAYMENT
========================= */
app.post("/verify-payment", (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ status: "failure" });
    }

    // ✅ Payment verified successfully
    res.json({ status: "success" });
});

app.listen(5000, () => {
    console.log("✅ Backend running on http://localhost:5000");
});


console.log("Razorpay Key:", process.env.RAZORPAY_KEY_ID);
