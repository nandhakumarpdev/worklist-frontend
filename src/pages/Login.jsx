import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/css/login.css"

function Login() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        "email": null,
        "password": null
    });
    const [errorMsg, setErrorMsg] = useState(null);
    const handleChange = (e) => {
        setCredentials(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        })
        )
    }
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setErrorMsg(null);
            const response = await axios.post("https://worklist-backend-rbu0.onrender.com/account/login/", credentials);
            if (response.data.message == "User Login successfully") {
                localStorage.setItem("user_id", response.data.user_id);
                localStorage.setItem("access_token", response.data.access_token);
                localStorage.setItem("refresh_token", response.data.refresh_token);
                navigate("/worklist");
            }

        }
        catch (error) {
            if (error.response.status === 401) {
                console.log(error.response.data);
                setErrorMsg(error.response.data.error);
                console.log("Login error");
            }
            if (error.response.status === 400) {
                console.log(error.response.data);
                setErrorMsg(error.response.data.error);
                console.log("Login error");
            }
            console.log("Error: ", error);
        }
        finally {
            setLoading(false);
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
                    <button type="submit" className="btn btn-primary me-3">Login</button>
                    <button className="btn btn-danger" onClick={() => navigate("/register")}>Register</button>
                </form>
                {loading && (
                    <div className="text-center">
                        <div className="spinner-border" role="status"></div>
                        <p className="mt-2" style={{ color: "brown" }}>Please wait while we validate your credentials...</p>
                    </div>
                )}
                {errorMsg && (<div>
                    <h5 className="mt-3 text-danger text-center">
                        {errorMsg}
                    </h5>
                </div>)}
            </div>
            <div className="d-flex justify-content-center align-items-center flex-column mt-5">
                <h3>Worklist</h3>
                <p>Stay organized and manage your tasks efficiently.</p>
                <h4>Features</h4>
                <ul>
                    <li>Create and manage your daily tasks.</li>
                    <li>Set deadlines for each task.</li>
                    <li>Edit task details anytime.</li>
                    <li>Track pending and completed tasks.</li>
                    <li>Simple and user-friendly interface to improve productivity.</li>
                </ul>
            </div>
        </>
    )
}

export default Login;