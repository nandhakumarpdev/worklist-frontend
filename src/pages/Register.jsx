import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/css/login.css"

function Register() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        "username": null,
        "password": null,
        "email": null
    })
    const [registerMsg, setRegisterMsg] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        setData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    const hanldeSubmit = async (e) => {
        e.preventDefault();
        try {
            setErrorMsg(null);
            setLoading(true);
            const response = await axios.post("https://worklist-backend-rbu0.onrender.com/account/user-register/", data);
            console.log("Response", response.data.error);
            if (response.data.message === "User created successfully") {
                console.log("Success Response");
                setData({
                    "username": null,
                    "password": null,
                    "email": null
                });
                setRegisterMsg(response.data.message);
            }
        }
        catch (error) {
            if (error.response) {
                console.log("Status:", error.response.status);
                console.log("Data:", error.response.data);

                setErrorMsg(error.response.data.error);
            } else {
                setErrorMsg("Network error. Please try again.");
            }
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <>
            <div className="container mx-auto" id="login-form">
                <h1 className="d-flex justify-content-center mt-5">Register</h1>
                <form onSubmit={hanldeSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Username: </label>
                        <input type="username" name="username" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email address: </label>
                        <input type="email" name="email" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password: </label>
                        <input type="password" name="password" className="form-control" onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Register</button>
                </form>
            </div>
            {loading && (
                <div className="text-center">
                    <div className="spinner-border" role="status"></div>
                    <p className="mt-2" style={{ color: "brown" }}>Registration complete! Your account will be ready shortly.</p>
                </div>
            )}
            {errorMsg && (<div>
                <h5 className="mt-3 text-danger text-center">
                    {errorMsg}
                </h5>
            </div>)}
            {
                registerMsg &&
                <div className="d-flex align-items-center justify-content-center gap-2">
                    <p className="mb-0">{registerMsg}</p>
                    <button className="btn btn-danger" onClick={() => navigate("/")}>Login</button>
                </div>}
        </>);
}

export default Register;