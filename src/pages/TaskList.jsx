import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";


function TaskList() {
    const [tasklist, setTaskList] = useState([]);
    const [status, setStatus] = useState("T");
    const [holdOn, setHoldOn] = useState({
        "show_popup": false,
        "id": "",
        "reason": ""
    });
    const [taskView, setTaskView] = useState({});
    const navigate = useNavigate();
    const priority = {
        L: "LOW",
        M: "MEDIUM",
        H: "HIGH"
    }

    const localhost = "http://127.0.0.1:8000"
    //const localhost = "http://10.199.211.181:8000" // for mobile

    useEffect(() => {
        axios.get(localhost + "/get-tasks/")
            .then((response) => {
                console.log(response.data);
                setTaskList(response.data);
            })
            .catch((err) => {
                console.log("Error in get request")
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
            alert("You didn't finish the current task yet");
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
                                <td className="d-flex justify-content-center align-items-center" >
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
        </>
    )
}

export default TaskList;
