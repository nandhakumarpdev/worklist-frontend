import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import axiosInstance from '../axiosInstance';

function TaskList() {
    const [tasklist, setTaskList] = useState([]);
    const status = {
        T: "TODO",
        I: "IN PROGRESS",
        O: "ON HOLD",
        D: "DONE"
    }
    const navigate = useNavigate();
    const priority = {
        L: "LOW",
        M: "MEDIUM",
        H: "HIGH"
    }

    const localhost = "http://127.0.0.1:8000"
    //const localhost = "http://10.199.211.181:5173" // for mobile

    useEffect(() => {
        axiosInstance.get("/get-tasks/")
            .then((response) => {
                console.log(response.data);
                setTaskList(response.data);
            })
            .catch((err) => {
                console.log("Error in get request: ", err);
            })
    }, []);

    tasklist.map((task) => {
        console.log(task.status)
    })

    const returnHome = () => {
        navigate("/")
    }

    return (
        <>
            <div className="navbar">
                <h1>Task Manager</h1>
                <button type="button" className="btn btn-primary btn-lg mt-3 mb-3" onClick={returnHome}>Home</button>
            </div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th className="table-primary text-center">Title</th>
                        <th className="table-primary text-center">Assignee</th>
                        <th className="table-primary text-center">Priority</th>
                        <th className="table-primary text-center">Reported Time</th>
                        <th className="table-primary text-center">Status</th>
                    </tr>
                </thead>
                <tbody className="">
                    {tasklist
                        .filter(task => task.status === "D")
                        .map((task, index) =>
                        (
                            <tr key={index}>
                                <td className="text-center">{task.title}</td>
                                <td className="text-center">{task.assignee}</td>
                                <td className="text-center">{priority[task.priority]}</td>
                                <td className="text-center">  {task.reported_time
                                    ? new Date(task.reported_time).toLocaleDateString('en-IN', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    })
                                    : "—"}</td>
                                <td className="text-center" >
                                    {status[task.status]}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </>
    )
}

export default TaskList;
