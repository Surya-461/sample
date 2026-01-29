import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Offcanvas } from "bootstrap";
import logo from "../assets/logo.png";
import "./Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const userEmail = localStorage.getItem("email");
    const role = localStorage.getItem("role"); // user | admin

    /* 🔄 SYNC AUTH STATE */
    useEffect(() => {
        const syncAuth = () => {
            setIsLoggedIn(localStorage.getItem("auth") === "true");
        };

        syncAuth(); // run on mount & route change
        window.addEventListener("storage", syncAuth);

        return () => window.removeEventListener("storage", syncAuth);
    }, [location.pathname]);

    /* 🚪 LOGOUT (FINAL FIXED) */
    const handleLogout = () => {
        localStorage.removeItem("auth");
        localStorage.removeItem("role");
        // ❌ DO NOT REMOVE client_id

        setIsLoggedIn(false);
        navigate("/login", { replace: true });
    };

    /* 📱 NAVIGATE + CLOSE MOBILE MENU */
    const navigateAndClose = (path) => {
        navigate(path);

        setTimeout(() => {
            const offcanvasEl = document.getElementById("mobileMenu");
            if (!offcanvasEl) return;

            const instance =
                Offcanvas.getInstance(offcanvasEl) ||
                new Offcanvas(offcanvasEl);

            instance.hide();
        }, 100);
    };

    /* 📌 DASHBOARD ROUTE */
    const dashboardPath =
        role === "admin" ? "/admin-dashboard" : "/user-dashboard";

    return (
        <>
            {/* ================= NAVBAR ================= */}
            <nav className="navbar navbar-expand-lg fixed-top fin-navbar shadow-lg px-4 py-3">
                <div className="container-fluid">

                    {/* BRAND */}
                    <NavLink to="/" className="navbar-brand d-flex align-items-center gap-2">
                        <img src={logo} alt="FinDrive Analytics" className="navbar-logo" />
                        <span className="text-info fs-4 fw-bold">
                            FinDrive Analytics
                        </span>
                    </NavLink>

                    {/* MOBILE TOGGLE */}
                    <button
                        className="navbar-toggler text-light border-0"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#mobileMenu"
                    >
                        ☰
                    </button>

                    {/* DESKTOP MENU */}
                    <div className="collapse navbar-collapse d-none d-lg-flex">
                        <ul className="navbar-nav mx-auto gap-lg-4">

                            {[
                                { path: "/", label: "Home" },
                                { path: "/about", label: "About" },
                                { path: "/contact", label: "Contact" },
                            ].map(item => (
                                <li className="nav-item" key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        end
                                        className={({ isActive }) =>
                                            `nav-link nav-underline ${isActive ? "active" : ""}`
                                        }
                                    >
                                        {item.label}
                                    </NavLink>
                                </li>
                            ))}

                            {isLoggedIn && (
                                <li className="nav-item">
                                    <NavLink
                                        to={dashboardPath}
                                        className={({ isActive }) =>
                                            `nav-link nav-underline fw-semibold ${isActive ? "active" : ""}`
                                        }
                                    >
                                        {role === "admin"
                                            ? "Analytics"
                                            : "Dashboard"}
                                    </NavLink>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* RIGHT SIDE */}
                    {!isLoggedIn ? (
                        <NavLink to="/login" className="btn-login desktop-only">
                            Login
                        </NavLink>
                    ) : (
                        <div className="d-flex align-items-center gap-3">

                            {/* USER INFO */}
                            <div className="d-flex align-items-center gap-2">
                                <FaUserCircle className="user-icon" />
                                <span className="fw-semibold text-white">
                                    {role === "admin"
                                        ? "Admin"
                                        : userEmail?.split("@")[0] || "User"}
                                </span>
                            </div>

                            {/* LOGOUT */}
                            <button
                                className="btn btn-outline-dark bg-white px-3"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* ================= MOBILE OFFCANVAS ================= */}
            <div className="offcanvas offcanvas-start text-bg-dark" id="mobileMenu">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title text-info fw-bold">
                        FinDrive Analytics
                    </h5>
                    <button
                        className="btn-close btn-close-white"
                        data-bs-dismiss="offcanvas"
                    />
                </div>

                <div className="offcanvas-body">
                    <ul className="navbar-nav gap-4 text-center">

                        <li>
                            <button
                                className="nav-link btn btn-link text-light w-100"
                                onClick={() => navigateAndClose("/")}
                            >
                                Home
                            </button>
                        </li>

                        <li>
                            <button
                                className="nav-link btn btn-link text-light w-100"
                                onClick={() => navigateAndClose("/about")}
                            >
                                About
                            </button>
                        </li>

                        <li>
                            <button
                                className="nav-link btn btn-link text-light w-100"
                                onClick={() => navigateAndClose("/contact")}
                            >
                                Contact
                            </button>
                        </li>

                        {isLoggedIn && (
                            <li>
                                <button
                                    className="nav-link btn btn-link fw-semibold text-light w-100"
                                    onClick={() => navigateAndClose(dashboardPath)}
                                >
                                    Dashboard
                                </button>
                            </li>
                        )}

                        <hr />

                        {!isLoggedIn ? (
                            <button
                                className="btn btn-outline-light w-100"
                                onClick={() => navigateAndClose("/login")}
                            >
                                Login
                            </button>
                        ) : (
                            <button
                                className="btn btn-danger w-100"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Navbar;
