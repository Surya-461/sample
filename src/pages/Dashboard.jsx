import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem("auth");
        const role = localStorage.getItem("role"); // user | admin

        if (auth !== "true") {
            navigate("/login");
            return;
        }

        if (role === "admin") {
            navigate("/admin-dashboard");
        } else {
            navigate("/user-dashboard");
        }
    }, [navigate]);

    return null; // No UI needed (redirect-only page)
};

export default Dashboard;
