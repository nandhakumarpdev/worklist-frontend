import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TaskList from "./pages/TaskList";
import AddTask from "./pages/AddTask";
import CompletedTask from "./pages/CompletedTask";

function App() {

  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/add" element={<AddTask />} />
          <Route path="/completed-task" element={<CompletedTask />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;
