// pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

/* =========================
   AUTH CONFIG
========================= */
const ADMIN = {
    email: "admin@findrive.com",
    password: "admin123",
};

const CLIENT_EMAILS = {
    "client1@findrive.com": "CLIENT_1",
    "client2@findrive.com": "CLIENT_2",
    "client3@findrive.com": "CLIENT_3",
    "client4@findrive.com": "CLIENT_4",
};

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = () => {
        setError("");

        /* ADMIN */
        if (email === ADMIN.email && password === ADMIN.password) {
            localStorage.setItem("auth", "true");
            localStorage.setItem("role", "admin");
            navigate("/admin-dashboard");
            return;
        }

        /* CLIENT */
        if (CLIENT_EMAILS[email] && password === "client123") {
            localStorage.setItem("auth", "true");
            localStorage.setItem("role", "client");
            localStorage.setItem("client_id", CLIENT_EMAILS[email]);
            localStorage.setItem("email", email);
            navigate("/user-dashboard");
            return;
        }

        setError("Invalid email or password");
    };

    return (
        <div className="login-page">
            <div className="login-card">

                {/* BRAND */}
                <div className="login-brand">
                    <span className="brand-badge">FD</span>
                    <h3>FinDrive Analytics</h3>
                    <p>Secure dashboard access</p>
                </div>

                {/* ERROR */}
                {error && <div className="login-error">{error}</div>}

                {/* FORM */}
                <div className="login-form">
                    <label>Email address</label>
                    <input
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                        }}
                    />

                    <label>Password</label>

                    {/* PASSWORD WITH EYE ICON */}
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError("");
                            }}
                        />

                        <span
                            className="password-eye"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </span>
                    </div>

                    <button className="login-btn" onClick={handleLogin}>
                        Log In
                    </button>
                </div>

                {/* FOOTER */}
                <div className="login-footer">
                    <span>© {new Date().getFullYear()} FinDrive Analytics</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
