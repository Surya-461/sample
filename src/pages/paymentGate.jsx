import { useState } from "react";

/* Example configs */
const PLANS = {
    monthly: { label: "Monthly", amount: 12000 * 100 }, // paise
    yearly: { label: "Yearly", amount: 140000 * 100 }   // paise
};

const COUPONS = {
    YEARLY4000: {
        type: "FLAT",
        discountAmount: 4000 * 100
    }
};

const loadRazorpay = () =>
    new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

const PaymentGate = ({ onSuccess }) => {
    const [plan, setPlan] = useState("monthly");
    const [coupon, setCoupon] = useState("");
    const [discount, setDiscount] = useState(null);

    /* FINAL AMOUNT (PAISE) */
    const getFinalAmount = () => {
        if (plan === "monthly") return PLANS.monthly.amount;

        if (!discount) return PLANS.yearly.amount;

        if (discount.type === "FLAT") {
            return PLANS.yearly.amount - discount.discountAmount;
        }

        return PLANS.yearly.amount;
    };

    const handlePayment = async () => {
        const ok = await loadRazorpay();
        if (!ok) {
            alert("Razorpay SDK failed");
            return;
        }

        const finalAmount = getFinalAmount(); // ✅ PAISE

        /* 1️⃣ CREATE ORDER */
        const orderRes = await fetch("http://localhost:5000/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: finalAmount   // ✅ paise only
            })
        });

        const order = await orderRes.json();

        /* 2️⃣ OPEN RAZORPAY (ORDER MODE) */
        const options = {
            key: "rzp_test_S6sD4S2wH7VHNE",
            order_id: order.id,   // ✅ REQUIRED
            currency: "INR",
            name: "Findrive Insurance",
            description: `${PLANS[plan].label} Dashboard Access`,

            handler: async function (response) {
                await fetch("http://localhost:5000/verify-payment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(response)
                });

                localStorage.setItem("dashboard_paid", "true");
                onSuccess?.();
            },

            theme: { color: "#16a34a" }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    return (
        <div className="payment-card">
            <h2>Subscription Required</h2>

            <select value={plan} onChange={e => {
                setPlan(e.target.value);
                setDiscount(null);
                setCoupon("");
            }}>
                <option value="monthly">Monthly – ₹12,000</option>
                <option value="yearly">Yearly – ₹1,40,000</option>
            </select>

            {plan === "yearly" && (
                <>
                    <input
                        placeholder="Coupon Code"
                        value={coupon}
                        onChange={e => setCoupon(e.target.value)}
                    />

                    <button onClick={() => {
                        const c = COUPONS[coupon.toUpperCase()];
                        if (!c) return alert("Invalid coupon");
                        setDiscount(c);
                    }}>
                        Apply Coupon
                    </button>
                </>
            )}

            <h3>Pay ₹{(getFinalAmount() / 100).toFixed(0)}</h3>

            <button className="btn btn-success" onClick={handlePayment}>
                Pay & Unlock Dashboard
            </button>
        </div>
    );
};

export default PaymentGate;
