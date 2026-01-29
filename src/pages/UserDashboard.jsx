import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    BarChart, Bar,
    PieChart, Pie, Cell,
    XAxis, YAxis,
    Tooltip, ResponsiveContainer,
    CartesianGrid, Legend
} from "recharts";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/UserDashboard.css";
import revenueData from "../data/revenueData";

/* ================= COLORS ================= */
const COLORS = {
    Approved: "#22c55e",
    Rejected: "#ef4444",
    Safe: "#16a34a",
    Risk: "#f59e0b"
};

/* ================= PLANS ================= */
const PLANS = {
    monthly: { label: "Monthly Plan", amount: 12000 * 100 }, // ₹12,000
    yearly: { label: "Yearly Plan", amount: 40000 * 100 }   // ✅ ₹15,000
};



/* ================= COUPONS ================= */
const COUPONS = {
    YEARLY4000: {
        type: "FLAT",
        discountAmount: 4000 * 100, // ₹4,000 in paise
        expiresInSeconds: 300
    },

    FINDRIVE50: {
        type: "PERCENT",
        discountPercent: 50,
        expiresInSeconds: 120
    }
};


const DATA_URL =
    "https://raw.githubusercontent.com/Surya-461/users/refs/heads/main/users_data.json";

/* ================= RAZORPAY ================= */
const loadRazorpay = () =>
    new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

const ClientDashboard = () => {
    const navigate = useNavigate();

    /* ================= AUTH ================= */
    useEffect(() => {
        if (
            localStorage.getItem("auth") !== "true" ||
            localStorage.getItem("role") !== "client"
        ) {
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    const clientId = String(localStorage.getItem("client_id"));


    /* ================= STATE ================= */
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    /* ===== PAYMENT ===== */
    const [plan, setPlan] = useState("monthly");
    const [coupon, setCoupon] = useState("");
    const [couponValid, setCouponValid] = useState(false);
    const [discount, setDiscount] = useState(null);
    const [couponTimer, setCouponTimer] = useState(0);

    const [hasPaid, setHasPaid] = useState(
        false
    );

    /* ================= FETCH ================= */
    useEffect(() => {
        fetch(DATA_URL)
            .then(res => res.json())
            .then(json => {
                setData(json || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    /* ================= FILTER DATA ================= */
    const clientUsers = useMemo(
        () => data.filter(u => String(u.client_id) === String(clientId)),
        [data, clientId]
    );

    const searchedUsers = useMemo(() => {
        if (!searchId.trim()) return clientUsers;
        return clientUsers.filter(u =>
            String(u.id).includes(searchId.trim())
        );
    }, [clientUsers, searchId]);

    const filteredUsers = useMemo(() => {
        if (statusFilter === "All") return searchedUsers;
        return searchedUsers.filter(
            u => u.Approval_Status === statusFilter
        );
    }, [searchedUsers, statusFilter]);

   //* ================= PAYMENT STATUS CHECK ================= */
    useEffect(() => {
        const checkPaymentStatus = async () => {
            useEffect(() => {
                if (!clientId) return;

                const paid = localStorage.getItem(`paid_${clientId}`) === "true";
                setHasPaid(paid);
            }, [clientId]);

            try {
                // ✅ 2️⃣ BACKEND CHECK (SOURCE OF TRUTH)
                const res = await fetch(
                    `http://localhost:5000/payment-status/${clientId}`
                );
                const data = await res.json();

                if (data.paid) {
                    setHasPaid(true);

                    // cache locally
                    localStorage.setItem(`paid_${clientId}`, "true");
                    localStorage.setItem("dashboard_paid", "true");
                }
            } catch (err) {
                console.error("Payment status check failed", err);
            }
        };

        checkPaymentStatus();
    }, [clientId]);



    /* ================= CLIENT INFO ================= */
    const clientInfo = useMemo(() => {
        const records = revenueData.filter(
            r => String(r.client_id) === String(clientId)
        );
        if (!records.length) return null;
        return records.sort(
            (a, b) =>
                new Date(b.subscription_end_date) -
                new Date(a.subscription_end_date)
        )[0];
    }, [clientId]);

    /* ================= KPI ================= */
    const approvedCount = filteredUsers.filter(u => u.Approval_Status === "Approved").length;
    const rejectedCount = filteredUsers.filter(u => u.Approval_Status === "Rejected").length;
    const highRiskCount = filteredUsers.filter(u => u.risk_category === "High Risk").length;

    const approvalRate = filteredUsers.length
        ? ((approvedCount / filteredUsers.length) * 100).toFixed(1)
        : 0;

    /* ================= CHART DATA ================= */
    const approvalData = [
        { name: "Approved", value: approvedCount },
        { name: "Rejected", value: rejectedCount }
    ];

    const safeDrivingData = [
        { name: "Safe Driving", value: filteredUsers.filter(u => u.safe_driving_flag === "Safe Driving").length },
        { name: "Risk Factors", value: filteredUsers.filter(u => u.safe_driving_flag !== "Safe Driving").length }
    ];

    const creditScoreBins = useMemo(() => {
        const bins = [
            { r: "300-399", min: 300, max: 399 },
            { r: "400-499", min: 400, max: 499 },
            { r: "500-599", min: 500, max: 599 },
            { r: "600-699", min: 600, max: 699 },
            { r: "700-799", min: 700, max: 799 },
            { r: "800-899", min: 800, max: 899 },
            { r: "900+", min: 900, max: 1000 }
        ];

        return bins.map(b => ({
            credit_range: b.r,
            count: filteredUsers.filter(
                u => u.credit_score >= b.min && u.credit_score <= b.max
            ).length
        }));
    }, [filteredUsers]);

    const drivingExperienceInsight = useMemo(() => {
        const groups = ["0-9y", "10-19y", "20-29y", "30y+"];
        return groups.map(exp => {
            const users = filteredUsers.filter(u => u.driving_experience === exp);
            return {
                experience: exp,
                past_accidents: users.length
                    ? +(users.reduce((s, u) => s + Number(u.past_accidents || 0), 0) / users.length).toFixed(2)
                    : 0,
                speeding_violations: users.length
                    ? +(users.reduce((s, u) => s + Number(u.speeding_violations || 0), 0) / users.length).toFixed(2)
                    : 0
            };
        });
    }, [filteredUsers]);

    const getFinalAmount = () => {
        if (plan === "monthly") return PLANS.monthly.amount;

        if (!couponValid || !discount) return PLANS.yearly.amount;

        if (discount.type === "FLAT") {
            return PLANS.yearly.amount - discount.discountAmount;
        }

        if (discount.type === "PERCENT") {
            return PLANS.yearly.amount - (PLANS.yearly.amount * discount.discountPercent) / 100;
        }

        return PLANS.yearly.amount;
    };


    const riskApprovalPercentData = useMemo(() => {
        const risks = ["Low Risk", "Medium Risk", "High Risk"];
        return risks.map(risk => {
            const a = filteredUsers.filter(u => u.risk_category === risk && u.Approval_Status === "Approved").length;
            const r = filteredUsers.filter(u => u.risk_category === risk && u.Approval_Status === "Rejected").length;
            const t = a + r || 1;
            return { risk, Approved: +(a / t * 100).toFixed(1), Rejected: +(r / t * 100).toFixed(1) };
        });
    }, [filteredUsers]);

    /* ================= COUPON TIMER ================= */
    useEffect(() => {
        if (!couponTimer) return;
        const i = setInterval(() => {
            setCouponTimer(p => {
                if (p <= 1) {
                    setCouponValid(false);
                    setDiscount(0);
                    setCoupon("");
                    return 0;
                }
                return p - 1;
            });
        }, 1000);
        return () => clearInterval(i);
    }, [couponTimer]);

    const applyCoupon = () => {
        if (plan !== "yearly") {
            alert("Coupon applicable only for Yearly plan");
            return;
        }

        const code = coupon.trim().toUpperCase();
        const c = COUPONS[code];

        if (!c) {
            alert("Invalid coupon code");
            return;
        }

        setCouponValid(true);
        setDiscount(c);              // object stored here ✔️
        setCouponTimer(c.expiresInSeconds);
    };


    const handlePayment = async () => {
        if (!(await loadRazorpay())) {
            alert("Razorpay SDK failed");
            return;
        }

        const finalAmount = getFinalAmount(); // paise

        // 1️⃣ CREATE ORDER
        const orderRes = await fetch("http://localhost:5000/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: finalAmount })
        });

        const order = await orderRes.json();

        // 2️⃣ OPEN RAZORPAY WITH ORDER ID
        const options = {
            key: "rzp_test_S6sD4S2wH7VHNE",
            order_id: order.id,
            amount: finalAmount,
            currency: "INR",
            name: "Findrive Insurance",
            description: `${plan} Subscription`,

            method: {
                card: true,        // ✅ ALLOW
                netbanking: true, // ❌ BLOCK
                upi: true,        // ❌ BLOCK
                wallet: true,     // ❌ BLOCK
            },

            handler: async (response) => {
                await fetch("http://localhost:5000/verify-payment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(response)
                });

                // ✅ SAVE PAYMENT PER CLIENT
                localStorage.setItem(`paid_${clientId}`, "true");

                setHasPaid(true);
            },

            theme: { color: "#16a34a" }
        };

        new window.Razorpay(options).open();
    };

    if (loading) return <p className="loading-text">Loading…</p>;

    return (
        <div className="dashboard-page">

            {/* ===== PAYMENT LOCK ===== */}
            {!hasPaid && (
                <div className="lock-wrapper">
                    <div className="lock-card">

                        <h2 className="lock-title">🔒 Dashboard Locked</h2>
                        <p className="lock-subtitle">Select subscription plan</p>

                        {/* PLAN SELECT */}
                        <div className="plan-group">
                            <label className="plan-option">
                                <input
                                    type="radio"
                                    checked={plan === "monthly"}
                                    onChange={() => {
                                        setPlan("monthly");
                                        setCoupon("");
                                        setCouponValid(false);
                                        setDiscount(0);
                                    }}
                                />
                                Monthly – ₹12,000
                            </label>

                            <label className="plan-option">
                                <input
                                    type="radio"
                                    checked={plan === "yearly"}
                                    onChange={() => setPlan("yearly")}
                                />
                                Yearly – ₹40,000
                            </label>
                        </div>

                        {/* COUPON (YEARLY ONLY) */}
                        <input
                            className="lock-input"
                            placeholder={
                                plan === "monthly"
                                    ? "Coupon not available for Monthly plan"
                                    : "Enter Coupon Code"
                            }
                            value={coupon}
                            onChange={e => setCoupon(e.target.value)}
                            disabled={plan === "monthly" || couponValid}
                        />

                        {plan === "yearly" && !couponValid && (
                            <button className="btn-green" onClick={applyCoupon}>
                                Apply Coupon
                            </button>
                        )}

                        {plan === "yearly" && couponValid && discount && (
                            <p className="coupon-success">
                                Coupon Applied —
                                {discount.type === "FLAT" && (
                                    <> You saved ₹{(discount.discountAmount / 100).toFixed(0)}</>
                                )}
                                {discount.type === "PERCENT" && (
                                    <> {discount.discountPercent}% OFF</>
                                )}
                                {" "}• expires in {couponTimer}s
                            </p>
                        )}


                        {/* FINAL AMOUNT */}
                        <div className="final-price">
                            ₹{(getFinalAmount() / 100).toFixed(0)}
                        </div>


                        <button className="btn-green" onClick={handlePayment}>
                            Pay & Unlock Dashboard
                        </button>

                    </div>
                </div>
            )}


            {/* ===== DASHBOARD ===== */}
            <div className={`dashboard-content ${!hasPaid ? "blurred" : ""}`}>

                <div className="dashboard-header">
                    <h2>📊 Client Risk Dashboard</h2>
                    <p>
                        Client ID: <b>{clientId}</b>
                        {clientInfo && <> • {clientInfo.insurance_company_name}</>}
                    </p>
                </div>

                {/* STATUS FILTER */}
                <select
                    className="filter-input"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Applications</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>

                {/* KPI */}
                <div className="kpi-grid">
                    <div className="kpi-card"><span>Total</span><h3>{filteredUsers.length}</h3></div>
                    <div className="kpi-card"><span>Approved</span><h3>{approvedCount}</h3></div>
                    <div className="kpi-card"><span>Rejected</span><h3>{rejectedCount}</h3></div>
                    <div className="kpi-card"><span>Approval Rate</span><h3>{approvalRate}%</h3></div>
                    <div className="kpi-card"><span>High Risk</span><h3>{highRiskCount}</h3></div>
                </div>

                {/* === CHART GRID + TABLE (UNCHANGED LOGIC) === */}
                {/* Your existing charts & table rendering remain exactly same */}
                 {/* CHART GRID */}
                                <div className="chart-grid">
                
                                    <div className="chart-card">
                                        <h5>Approval Distribution</h5>
                                        <ResponsiveContainer width="100%" height={280}>
                                            <BarChart data={approvalData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="value">
                                                    {approvalData.map((e, i) => (
                                                        <Cell key={i} fill={COLORS[e.name]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                
                                    <div className="chart-card">
                                        <h5>Approval Distribution (Share)</h5>
                                        <ResponsiveContainer width="100%" height={280}>
                                            <PieChart>
                                                <Pie data={approvalData} dataKey="value" label>
                                                    {approvalData.map((e, i) => (
                                                        <Cell key={i} fill={COLORS[e.name]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                
                                    <div className="chart-card">
                                        <h5>Safe Driving Analysis</h5>
                                        <ResponsiveContainer width="100%" height={280}>
                                            <PieChart>
                                                <Pie data={safeDrivingData} innerRadius={70} outerRadius={100} label>
                                                    <Cell fill={COLORS.Safe} />
                                                    <Cell fill={COLORS.Risk} />
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                
                                    <div className="chart-card">
                                        <h5>Credit Score Distribution</h5>
                                        <ResponsiveContainer width="100%" height={280}>
                                            <BarChart data={creditScoreBins}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="credit_range" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="count" fill="#3b82f6" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                
                                    <div className="chart-card">
                                        <h5>Approval Outcomes by Risk Category (%)</h5>
                                        <ResponsiveContainer width="100%" height={280}>
                                            <BarChart data={riskApprovalPercentData} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                                                <YAxis type="category" dataKey="risk" />
                                                <Tooltip formatter={(v) => `${v}%`} />
                                                <Legend />
                                                <Bar dataKey="Approved" stackId="a" fill={COLORS.Approved} />
                                                <Bar dataKey="Rejected" stackId="a" fill={COLORS.Rejected} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                
                                    <div className="chart-card">
                                        <h5>Driver Risk Behavior by Experience Level</h5>
                                        <ResponsiveContainer width="100%" height={280}>
                                            <BarChart data={drivingExperienceInsight}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="experience" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="past_accidents" fill="#3b82f6" />
                                                <Bar dataKey="speeding_violations" fill="#1e3a8a" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                
                                </div>
                
                                {/* TABLE */}
                                <div className="table-card">
                                    <h5>📋 Applications</h5>
                                    <input
                                        className="filter-input"
                                        placeholder="Search by Application ID"
                                        value={searchId}
                                        onChange={e => setSearchId(e.target.value)}
                                    />
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Credit</th>
                                                <th>Vehicle</th>
                                                <th>Risk</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.slice(0, 15).map(u => (
                                                <tr key={u.id}>
                                                    <td>{u.id}</td>
                                                    <td>{u.credit_score}</td>
                                                    <td>{u.vehicle_type}</td>
                                                    <td>{u.risk_category}</td>
                                                    <td>{u.Approval_Status}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
            </div>

            <ToastContainer />
        </div>
    );
};

export default ClientDashboard;
