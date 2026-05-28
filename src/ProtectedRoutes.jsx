import { Navigate, Outlet, useNavigate } from "react-router-dom";

function ProtectedRoutes() {
    const userId = localStorage.getItem("user_id");
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");
    if (userId == null || access_token == null || refresh_token == null) {
        return <Navigate to="/auth-error" />;
    }
    return <Outlet />;
}

export default ProtectedRoutes;