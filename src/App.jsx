import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TaskList from "./pages/TaskList";
import AddTask from "./pages/AddTask";
import CompletedTask from "./pages/CompletedTask";
import Login from "./pages/Login";
import Register from './pages/Register';

function App() {

  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route path="/worklist" element={<TaskList />} />
          <Route path="/add" element={<AddTask />} />
          <Route path="/completed-task" element={<CompletedTask />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;
