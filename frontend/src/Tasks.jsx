import { useEffect, useState } from "react";
import api from "./api";
import { Plus, Calendar } from "lucide-react";

export default function Tasks({ projectId, isAdmin, members }) {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", assignedTo: "", priority: "Medium", deadline: "" });

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks/${projectId}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    try {
      await api.post("/tasks/create", { ...form, projectId });
      fetchTasks();
      setShowForm(false);
      setForm({ title: "", description: "", assignedTo: "", priority: "Medium", deadline: "" });
    } catch (err) {
      alert("Failed to create task");
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      await api.post(`/tasks/update/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      alert("Not allowed to update or failed");
    }
  };

  const columns = [
    { id: "pending", label: "Pending", borderColor: "border-red-500" },
    { id: "in-progress", label: "In Progress", borderColor: "border-blue-500" },
    { id: "completed", label: "Completed", borderColor: "border-green-500" },
  ];

  const userId = localStorage.getItem("userId");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Task Board</h2>
        {isAdmin && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            <Plus className="w-5 h-5 mr-1" /> Add Task
          </button>
        )}
      </div>

      {showForm && (
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4">New Task Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Task Title" className="input-field" onChange={e => setForm({...form, title: e.target.value})} />
            <select className="input-field" onChange={e => setForm({...form, assignedTo: e.target.value})}>
              <option value="">Assign To...</option>
              {members.map(m => <option key={m.userId?._id} value={m.userId?._id}>{m.userId?.name}</option>)}
            </select>
            <input type="date" className="input-field" onChange={e => setForm({...form, deadline: e.target.value})} />
            <select className="input-field" onChange={e => setForm({...form, priority: e.target.value})}>
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
            <input placeholder="Task Description" className="md:col-span-2 input-field" onChange={e => setForm({...form, description: e.target.value})} />
            <button onClick={handleCreate} className="md:col-span-2 btn-primary">Create Task</button>
          </div>
        </div>
      )}

      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map(col => (
          <div key={col.id} className="flex-1 min-w-[300px] bg-gray-100/50 rounded-xl p-4 border border-gray-200 flex flex-col h-[600px]">
            <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${col.borderColor}`}>
              <h3 className="font-bold text-gray-800">{col.label}</h3>
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full font-bold">
                {tasks.filter(t => t.status === col.id).length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {tasks.filter(t => t.status === col.id).map(task => (
                <div key={task._id} className="card p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-900">{task.title}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      task.priority === 'High' ? 'badge-danger' :
                      task.priority === 'Medium' ? 'badge-warning' :
                      'badge-success'
                    }`}>{task.priority || 'Medium'}</span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{task.description}</p>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mr-2 border border-indigo-200">
                        {task.assignedTo?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate max-w-[80px]">{task.assignedTo?.name}</span>
                    </div>
                    {task.deadline && (
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(task.deadline).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  
                  {task.assignedTo?._id === userId && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <select 
                        value={task.status} 
                        onChange={e => updateStatus(task._id, e.target.value)}
                        className="w-full text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded py-1 px-2 focus:outline-none"
                      >
                        <option value="pending">Move to Pending</option>
                        <option value="in-progress">Move to In Progress</option>
                        <option value="completed">Move to Completed</option>
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}