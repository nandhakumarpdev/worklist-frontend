import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userLogo from "../assets/user-icon.png";
import axiosInstance from '../axiosInstance';

function UserDetails({ userDetails, setUserDetails }) {
    const [changeProfile, setChangeProfile] = useState("");
    const gender = {
        M: "MALE",
        F: "FEMALE"
    }
    const [userData, setUserData] = useState(null);
    const [needToPost, setNeedToPost] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        axiosInstance.get("/user-details/get/" + localStorage.getItem("user_id"))
            .then((response) => {
                if (response.data != null) {
                    console.log(response.data);
                    console.log("initialed");
                    setUserData(response.data);
                }
            }).catch((error) => {
                if (error.response.status == 404) {
                    console.log("404");
                    setNeedToPost(true);
                }
                console.log("Error in dashboard ", error);
            })
    }, []);

    function logout() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_id");
        navigate("/");
    }
    async function updateUserData() {
        try {
            const { profile_image, ...dataToSend } = userData;
            if (needToPost) {
                const response = await axiosInstance.post(`/user-details/creation/${localStorage.getItem("user_id")}`, dataToSend);
                console.log("user detail posted ", response.data);
                setUserData(response.data);
                setNeedToPost(false);
            }
            else {
                const response = await axiosInstance.put(`/user-details/updation/${userData.user_id}`, dataToSend);
                console.log("user detail puted ", response.data);
                setUserData(response.data);
            }
        }
        catch (error) {
            console.log("Error in update user detials ", error);
        }
    }

    function calculateAge(dob) {
        if (dob === "") {
            return dob;
        }
        const birthDate = new Date(dob);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();

        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    return (
        <>
            {userDetails && (<div className="modal show d-block" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header d-flex justify-content-center">
                            <h5 className="modal-title">User Details</h5>
                        </div>
                        <div className="modal-body h-100">
                            <div className="d-flex justify-content-center">
                                <img src={userLogo} alt="userLogo" className="w-25 h-25" />
                            </div>
                            {/* <div className="text-center">
                                <button type="button" className="btn">Change profile picture</button>
                            </div> */}
                            <div className="mb-2">
                                <label className="">DOB:</label>
                                <input type="date" className="form-control" value={userData?.dob?.split("T")[0] || ""} onChange={(e) => setUserData({ ...userData, dob: e.target.value })} />
                            </div>
                            <div className="mb-2">
                                <label>Age: </label>
                                <input type="text" className="form-control" value={calculateAge(userData?.dob?.split("T")[0] || "") || ""} onChange={(e) => setUserData({ ...userData, age: e.target.value })} />
                            </div>
                            <div className="mb-2">
                                <label>Gender: </label>
                                <select className="form-select" value={userData?.gender || ""} onChange={(e) => setUserData({ ...userData, gender: e.target.value })}>
                                    <option value="M">MALE</option>
                                    <option value="F">FEMALE</option>
                                </select>

                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={updateUserData}>Update</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setUserDetails(false)}>Close</button>
                            <button type="button" className="btn btn-danger" onClick={logout}>Logout</button>
                        </div>
                    </div>
                </div>
            </div>)}

        </>
    )
}

export default UserDetails;