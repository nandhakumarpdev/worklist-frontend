import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import axiosInstance from '../axiosInstance';
import "../assets/css/tasklist.css"

function TaskList() {
    const [tasklist, setTaskList] = useState([]);
    const [holdOn, setHoldOn] = useState({
        "show_popup": false,
        "id": "",
        "reason": ""
    });
    const [taskView, setTaskView] = useState(null);
    const navigate = useNavigate();
    const priority = {
        L: "LOW",
        M: "MEDIUM",
        H: "HIGH"
    }
    const [inProgress, setInProgress] = useState(null);

    const localhost = "http://127.0.0.1:8000"
    //const localhost = "http://10.199.211.181:8000" // for mobile

    useEffect(() => {
        axiosInstance.get("/get-tasks/")
            .then((response) => {
                console.log(response.data);
                setTaskList(response.data);
            })
            .catch((err) => {
                console.log("Error in get request: ", err)
            })
    }, []);

    const addTask = () => {
        navigate("/add")
    }

    const completedTask = () => {
        navigate("/completed-task")
    }

    const updateStatus = (task, newStatus) => ({
        ...task, status: newStatus
    });

    async function taskStatus(e, id) {
        const newstatus = e.target.value;
        //console.log("hold on", e.target.value);
        let count = 0;

        tasklist.map((task) => {
            if (task.status == 'I') {
                count++;
            }
        });
        console.log(count);
        if (count > 0 && newstatus === "I") {
            setInProgress("You didn't finish the current task yet");
            return;
        }

        if (newstatus === "O") {
            setHoldOn({
                "show_popup": true,
                "id": id
            });
            console.log("On hold", holdOn.show_popup);
        }

        try {
            await axios.put(localhost + `/update-task/${id}`, { status: newstatus });
            setTaskList(prevTasks =>
                prevTasks.map(task => {
                    if (task.id === id && task.status !== newstatus) {
                        return updateStatus(task, newstatus);
                    }
                    return task;
                }
                )
            )
        }
        catch (error) {
            console.log("Error updating status", error);
        }
    };

    async function handleSubmitForOnHold() {
        try {
            await axios.put(localhost + `/update-task/${holdOn.id}`, { hold_on_reason: holdOn.reason });
            setTaskList(prevTasks =>
                prevTasks.map(task => {
                    if (task.id === holdOn.id) {
                        return { ...task, hold_on_reason: holdOn.reason };
                    }
                    return task;
                }
                )
            )
            console.log("Hold reason: ", holdOn.reason);
            setHoldOn({
                "show_popup": false,
                "id": "",
                "reason": ""
            });
        }
        catch (error) {
            console.log("Error updating status", error);
        }
    };

    async function handleRowClick(task) {
        setTaskView(task);

    }

    async function handleChanges() {
        try {
            await axios.put(localhost + `/update-task/${taskView.id}`, taskView);
            const updatedTask = tasklist.map(
                (task) => {
                    if (task.id === taskView.id) {
                        return taskView;
                    }
                    return task;
                }
            )
            setTaskList(updatedTask);
            setTaskView(null);
            console.log("Handle changes save");

        }
        catch (error) {
            console.log("Error in update ", error);
        }
    }

    async function deleteTask() {
        try {
            await axios.delete(localhost + `/delete-task/${taskView.id}`);
            const updatedTask = tasklist.filter(
                (task) => task.id != taskView.id
            );
            setTaskList(updatedTask);
            setTaskView(null);
            console.log("Task deleted");
        }
        catch (error) {
            console.log("Error ", error);
        }
    }
    return (
        <>
            <div className="navbar">
                <h1>Task Manager</h1>
                <div className="d-flex gap-4">
                    <button type="button" className="btn btn-success btn-lg mt-3 mb-3" onClick={completedTask}>Completed Task</button>
                    <button type="button" className="btn btn-primary btn-lg mt-3 mb-3" onClick={addTask}>+ Add Task</button>
                </div>

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
                <tbody>
                    {tasklist
                        .filter(task => task.status !== "D")
                        .map((task) =>
                        (
                            <tr key={task.id}
                            >
                                <td className="text-center"
                                    id="task-title"
                                    onClick={() => handleRowClick(task)}
                                >{task.title}</td>
                                <td className="text-center">{task.assignee}</td>
                                <td className="text-center">{priority[task.priority]}</td>
                                <td className="text-center">  {task.reported_time
                                    ? new Date(task.reported_time).toLocaleDateString('en-IN', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    })
                                    : "—"}</td>
                                <td className="d-flex justify-content-center align-items-center" title={task.status == "O" ? "This task is on hold - reason: " + task.hold_on_reason : ""}>
                                    <select className="form-select w-50" value={task.status} onChange={(e) => taskStatus(e, task.id)}>
                                        <option className="text-center" value="T">TODO</option>
                                        <option className="text-center" value="I">IN PROGRESS</option>
                                        <option className="text-center" value="D">DONE</option>
                                        <option className="text-center" value="O">ON HOLD</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
            {inProgress && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">In progress Message</h5>
                            </div>
                            <div className="modal-body">
                                <p>{inProgress}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={() => setInProgress(null)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
            {holdOn.show_popup && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Enter Hold on Reason</h5>
                            </div>
                            <div className="modal-body">
                                <textarea type="text" className="w-75" value={holdOn.reason} onChange={(e) => setHoldOn(prev => ({ ...prev, reason: e.target.value }))}></textarea>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={handleSubmitForOnHold}>Save</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setHoldOn(prev => ({ ...prev, show_popup: false }))}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {
                taskView && (
                    <div className="modal show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Edit Task</h5>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-2">
                                        <input type="text" className="form-control" value={taskView.title} onChange={(e) => setTaskView({ ...taskView, title: e.target.value })} />
                                    </div>
                                    <div className="mb-2">
                                        <input type="text" className="form-control" value={taskView.assignee} onChange={(e) => setTaskView({ ...taskView, assignee: e.target.value })} />
                                    </div>
                                    <div className="mb-2">
                                        <select className="form-select" value={taskView.priority} onChange={(e) => setTaskView({ ...taskView, priority: e.target.value })}>
                                            <option value="L">LOW</option>
                                            <option value="M">MEDIUM</option>
                                            <option value="H">HIGH</option>
                                        </select>
                                    </div>
                                    <div className="mb-2">
                                        <input type="date" className="form-control" value={taskView.reported_time?.split("T")[0] || ""} onChange={(e) => setTaskView({ ...taskView, reported_time: e.target.value })} />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary" onClick={handleChanges}>Update</button>
                                    <button type="button" className="btn btn-danger" onClick={deleteTask}>Delete</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setTaskView(null)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>

    )
}

export default TaskList;
