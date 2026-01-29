import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
    const isAuth = localStorage.getItem("auth") === "true";
    const role = localStorage.getItem("role");

    if (!isAuth) {
        return <Navigate to="/login" />;
    }

    if (allowedRole && role !== allowedRole) {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default ProtectedRoute;
