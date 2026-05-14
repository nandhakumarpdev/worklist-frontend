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
    const handleChange = (e) => {
        setData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    const hanldeSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/account/user-register/", data);
            console.log("Response", response.data);
            if (response.data.Message === "User created successfully") {
                setRegisterMsg(response.data.Message);
            }
        }
        catch (error) {
            console.log("Error: ", error);
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
            {
                registerMsg &&
                <div>
                    <p>{registerMsg}</p>
                    <button className="btn" onClick={() => navigate("/")}>Login</button>
                </div>}
        </>);
}

export default Register;