import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/css/login.css"

function Login() {
    const localhost = "http://127.0.0.1:8000"
    const navigate = useNavigate();
    function loginSuccess() {
        navigate("/");
    }
    const [credentials, setCredentials] = useState({
        "email": null,
        "password": null
    });
    const handleChange = (e) => {
        setCredentials(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        })
        )
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(localhost + "/account/login/", credentials);
            console.log("Response: ", response.data);
            if (response.data.message == "User Login successfully") {
                navigate("/");
            }
        }
        catch (error) {
            console.log("Error: ", error);
        }
    }
    return (
        <>
            <div className="container mx-auto" id="login-form">
                <h1 className="d-flex justify-content-center mt-5">Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email address: </label>
                        <input type="email" name="email" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password: </label>
                        <input type="password" name="password" className="form-control" onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>

            </div>
        </>
    )
}

export default Login;