import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import api from "./api";
import * as XLSX from "xlsx";
import { Download } from "lucide-react";

export default function Reports({ projectId, members }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get(`/tasks/${projectId}`).then(res => setTasks(res.data)).catch(console.error);
  }, [projectId]);

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "completed").length,
    inProgress: tasks.filter(t => t.status === "in-progress").length,
    pending: tasks.filter(t => t.status === "pending").length,
  };

  const pieData = [
    { name: 'Completed', value: stats.completed, color: '#10b981' },
    { name: 'In Progress', value: stats.inProgress, color: '#3b82f6' },
    { name: 'Pending', value: stats.pending, color: '#ef4444' },
  ].filter(d => d.value > 0);

  // Calculate member contributions
  const contributionMap = {};
  members.forEach(m => {
    if(m.userId) contributionMap[m.userId.name] = 0;
  });
  tasks.filter(t => t.status === "completed").forEach(t => {
    if (t.assignedTo && t.assignedTo.name) {
      contributionMap[t.assignedTo.name] = (contributionMap[t.assignedTo.name] || 0) + 1;
    }
  });

  const barData = Object.keys(contributionMap).map(name => ({
    name,
    tasksCompleted: contributionMap[name]
  })).filter(d => d.tasksCompleted > 0);

  const handleDownload = () => {
    const wsData = tasks.map(t => ({
      Title: t.title,
      Description: t.description,
      Status: t.status,
      Priority: t.priority || "Medium",
      AssignedTo: t.assignedTo?.name || "Unassigned",
      Deadline: t.deadline ? new Date(t.deadline).toLocaleDateString() : "N/A"
    }));
    
    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tasks Report");
    XLSX.writeFile(wb, "Project_Report.xlsx");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button onClick={handleDownload} className="btn-primary">
          <Download className="w-4 h-4 mr-2" /> Export to Excel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center border-b-4 border-b-gray-400">
           <p className="text-gray-500 text-sm font-medium">Total Tasks</p>
           <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</p>
        </div>
        <div className="card text-center border-b-4 border-b-green-500">
           <p className="text-gray-500 text-sm font-medium">Completed</p>
           <p className="text-3xl font-bold text-gray-800 mt-2">{stats.completed}</p>
        </div>
        <div className="card text-center border-b-4 border-b-blue-500">
           <p className="text-gray-500 text-sm font-medium">In Progress</p>
           <p className="text-3xl font-bold text-gray-800 mt-2">{stats.inProgress}</p>
        </div>
        <div className="card text-center border-b-4 border-b-red-500">
           <p className="text-gray-500 text-sm font-medium">Pending</p>
           <p className="text-3xl font-bold text-gray-800 mt-2">{stats.pending}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-80">
        <div className="card flex flex-col">
          <h3 className="font-bold text-gray-800 mb-4">Task Distribution</h3>
          {tasks.length === 0 ? <p className="text-gray-400">No tasks data available</p> : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card flex flex-col">
          <h3 className="font-bold text-gray-800 mb-4">Top Contributors (Completed Tasks)</h3>
          {barData.length === 0 ? <p className="text-gray-400">No completed tasks yet</p> : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip cursor={{fill: 'transparent'}}/>
                <Bar dataKey="tasksCompleted" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
