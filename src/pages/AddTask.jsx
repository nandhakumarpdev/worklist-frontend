import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

const AddTask = () => {
    const [task, setTask] = useState({
        "title": "",
        "description": "",
        "assignee": "",
        "priority": "M",
        "time_unit": "H",
        "estimate_time_to_complete": "",
        "user_id": localStorage.getItem("user_id")
    });

    const handleChange = (e) => {
        setTask(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };
    const [postSuccess, setPostSuccess] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(task);
        axiosInstance
            .post("/add-task/", task)
            .then((response) => {
                setPostSuccess("Task added successfully");
                console.log("Post created successfully", response);
                setTask({
                    title: "",
                    description: "",
                    assignee: "",
                    priority: "M",
                    time_unit: "H",
                    estimate_time_to_complete: "",
                    user_id: localStorage.getItem("user_id")
                });
            })
            .catch((err) => {
                console.log("Error creating post: ", err)
            })
    }

    const navigate = useNavigate();

    const returnHome = () => {
        navigate("/worklist")
    }

    return (
        <>
            <div className="container-fluid">
                <div className="navbar">
                    <h1 className="mt-3">Add Task</h1>
                    <button type="button" className="btn btn-primary btn-lg mt-3 mb-3" onClick={returnHome}>Home</button>
                </div>
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="mb-3">
                        <label className="form-label">Title: </label>
                        <input type="text" name="title" id="title" className="form-control" value={task.title} onChange={handleChange} required />
                    </div>
                    {/* <div className="mb-3">
                    <label className="form-label">Description: </label>
                    <textarea name="description" id="description" className="form-control" value={task.description} onChange={handleChange} required></textarea>
                </div> */}
                    <div className="mb-3">
                        <label className="form-label">Assignee: </label>
                        <input type="text" name="assignee" id="assignee" className="form-control" value={task.assignee} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Priority: </label>
                        {/* <input text="text" name="priority" id="priority" className="form-control" onChange={handleChange} /> */}
                        <select
                            name="priority"
                            className="form-select"
                            value={task.priority}
                            onChange={handleChange}
                        >
                            {/* <option value=""></option> */}
                            <option value="L">Low</option>
                            <option value="M">Medium</option>
                            <option value="H">High</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Time unit: </label>
                        {/* <input type="text" name="time_unit" id="time_unit" className="form-control" onChange={handleChange} /> */}
                        <select
                            name="time_unit"
                            className="form-select"
                            value={task.time_unit}
                            onChange={handleChange}
                        >
                            {/* <option value=""></option> */}
                            <option value="H">Hour</option>
                            <option value="D">Day</option>
                            <option value="W">Week</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Estimate time to complete: </label>
                        <input type="number" step="any" name="estimate_time_to_complete" id="estimate_time_to_complete" className="form-control" value={task.estimate_time_to_complete} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <button type="submit" className="btn btn-primary w-100">Add Task</button>
                    </div>
                </form>
            </div>
            {postSuccess && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Success</h5>
                            </div>
                            <div className="modal-body">
                                <h4>{postSuccess}</h4>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" onClick={() => setPostSuccess(null)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default AddTask