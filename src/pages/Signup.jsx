// pages/Signup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "user",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        // 🔐 SAVE USER DATA (DEMO AUTH)
        const userData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role
        };

        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("auth", "true");
        localStorage.setItem("role", formData.role);

        alert("Account created successfully!");
        navigate("/login");
    };

    return (
        <div className="signup-page">
            <div className="signup-card shadow-lg">
                <h3 className="signup-title">Create Account</h3>
                <p className="signup-subtitle">
                    Join FinDrive Analytics and explore banking insights
                </p>

                <form onSubmit={handleSignup}>
                    <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            required
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Official Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            required
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Register As</label>
                        <select
                            name="role"
                            className="form-control"
                            onChange={handleChange}
                        >
                            <option value="user">User / Analyst</option>
                            <option value="admin">Admin / Manager</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            required
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="form-control"
                            required
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn btn-success w-100">
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
