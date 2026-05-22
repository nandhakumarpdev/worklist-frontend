import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../axiosInstance';

function Dashboard() {
    const [tasklist, setTaskList] = useState([]);
    const navigate = useNavigate();

    const stats = [
        { label: 'Total Tasks', value: tasklist.total_tasks },
        { label: 'Completed', value: tasklist.completed_tasks },
        { label: 'Todo', value: tasklist.todo_tasks },
        { label: 'In Progress', value: tasklist.in_progress_tasks },
        { label: 'On Hold', value: tasklist.on_hold_tasks },
    ];

    const low = Math.round((tasklist.low_priority / tasklist.total_tasks) * 100);
    const medium = Math.round((tasklist.medium_priority / tasklist.total_tasks) * 100);
    const high = Math.round((tasklist.high_priority / tasklist.total_tasks) * 100);


    useEffect(() => {
        axiosInstance.get("/dashboard/" + localStorage.getItem("user_id"))
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
        <div className="container">
            <div className="navbar">
                <h1 className="mt-3">Dashboard</h1>
                <button type="button" className="btn btn-primary btn-lg mt-3 mb-3" onClick={() => navigate("/worklist")}>Home</button>
            </div>
            <div className="container d-flex justify-content-center gap-3 mt-5 mb-5">

                {stats.map((stat) => (
                    <div className="card flex-fill text-center" key={stat.label}>
                        <div className="card-header fw-semibold">
                            {stat.label}
                        </div>
                        <div className={`card-body fs-2 ${stat.color}`}>
                            {stat.value}
                        </div>
                    </div>
                ))}
            </div>
            <div className="container">
                <h3 className="text-center mb-3">Task Priorities</h3>
                <div className="container d-flex justify-content-center gap-5 mb-3">
                    <span className="badge rounded-pill bg-success">● Low</span>
                    <span className="badge rounded-pill bg-warning" style={{ color: '#000' }}>● Medium</span>
                    <span className="badge rounded-pill bg-danger">● High</span>
                </div>
                <div className="progress mb-3">
                    <div className="progress-bar bg-success" style={{ width: `${low}%` }}>{`${low}%`}</div>
                </div>
                <div className="progress mb-3">
                    <div className="progress-bar bg-warning" style={{ width: `${medium}%` }}>{`${medium}%`}</div>
                </div>
                <div className="progress mb-3">
                    <div className="progress-bar bg-danger" style={{ width: `${high}%` }}>{`${high}%`}</div>
                </div>
            </div>
        </div>
    </>);
}

export default Dashboard;