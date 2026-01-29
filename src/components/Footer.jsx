// components/Footer.jsx
import { NavLink } from "react-router-dom";
import "./Footer.css";
import logo from "../assets/logo.png"; // ✅ adjust path if needed

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="footer-wrapper">
            <div className="footer-container">

                {/* ================= TOP ================= */}
                <div className="footer-grid">

                    {/* BRAND */}
                    <div className="footer-brand">
                        <div className="brand-row">
                            <img
                                src={logo}
                                alt="FinDrive Analytics"
                                className="footer-logo"
                            />
                            <span className="brand-name">FinDrive Analytics</span>
                        </div>

                        <p className="footer-text">
                            Simplifying insurance analytics, claims intelligence,
                            and decision-making with secure, data-driven platforms.
                        </p>
                    </div>

                    {/* QUICK LINKS */}
                    <div>
                        <h6 className="footer-subtitle">Quick Links</h6>
                        <ul className="footer-links">
                            <li>
                                <NavLink to="/" onClick={scrollToTop} className="footer-link">
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/about" onClick={scrollToTop} className="footer-link">
                                    About
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/contact" onClick={scrollToTop} className="footer-link">
                                    Contact
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/login" onClick={scrollToTop} className="footer-link">
                                    Login
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    {/* SERVICES */}
                    <div>
                        <h6 className="footer-subtitle">Services</h6>
                        <ul className="footer-links muted">
                            <li>Risk Analytics</li>
                            <li>Claims Intelligence</li>
                            <li>Policy Insights</li>
                            <li>24×7 Support</li>
                        </ul>
                    </div>

                    {/* CONTACT */}
                    <div>
                        <h6 className="footer-subtitle">Contact</h6>
                        <p className="footer-contact">
                            📍 Financial Technology Park,<br />
                            Hyderabad, Telangana – 500081
                        </p>
                        <p className="footer-contact">📞 +91 98765 43210</p>
                        <p className="footer-contact">✉ support@findriveanalytics.com</p>
                    </div>

                </div>

                <hr className="footer-divider" />

                {/* ================= BOTTOM ================= */}
                <div className="footer-bottom">
                    © {new Date().getFullYear()} FinDrive Analytics. All rights reserved.
                </div>

            </div>
        </footer>
    );
};

export default Footer;
