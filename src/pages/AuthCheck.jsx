import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AuthCheck() {
    const navigate = useNavigate();
    return (
        <>
            <div className="container d-flex justify-content-center align-items-center" style={{ height: "75vh" }}>
                <div className="text-center">
                    <h5 className="mb-3">You are not Logged In, Kindly do login</h5>
                    <button type="button" className="btn btn-danger" onClick={() => navigate("/")}>Login</button>
                </div>
            </div>
        </>
    )
}

export default AuthCheck; 