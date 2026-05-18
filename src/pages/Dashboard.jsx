import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../axiosInstance';

function Dashboard() {
    const [tasklist, setTaskList] = useState([]);

    useEffect(() => {
        axiosInstance.get("/get-tasks/" + localStorage.getItem("user_id"))
            .then((response) => {
                console.log("Data flow on dashboard");
                console.log(response.data);
                setTaskList(response.data);
            })
            .catch((error) => {
                console.log("Error in get request in dashboard component, " + error);
            })
    }, []);
    return (<>
    </>);
}

export default Dashboard;