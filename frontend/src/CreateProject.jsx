import { useState } from "react";
import api from "./api";

export default function CreateProject({ onCreated }) {
  const [form, setForm] = useState({ title: "", description: "", requiredSkills: "", capacity: 10, deadline: "" });

  const handleCreate = async () => {
    try {
      const skills = form.requiredSkills.split(",").map(s => s.trim()).filter(Boolean);
      await api.post("/projects/create", { ...form, requiredSkills: skills });
      setForm({ title: "", description: "", requiredSkills: "", capacity: 10, deadline: "" });
      if (onCreated) onCreated();
    } catch (err) {
      alert("Failed to create project");
    }
  };

  return (
    <div className="card mb-6 bg-indigo-50/50 border-indigo-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Create New Project</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          placeholder="Project Title" 
          className="input-field" 
          value={form.title} 
          onChange={e => setForm({...form, title: e.target.value})} 
        />
        <input 
          placeholder="Required Skills (comma separated)" 
          className="input-field" 
          value={form.requiredSkills} 
          onChange={e => setForm({...form, requiredSkills: e.target.value})} 
        />
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-500 mb-1">Team Capacity</label>
          <input 
            type="number"
            min="1"
            className="input-field" 
            value={form.capacity} 
            onChange={e => setForm({...form, capacity: Number(e.target.value)})} 
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-500 mb-1">Project Deadline</label>
          <input 
            type="date"
            className="input-field" 
            value={form.deadline} 
            onChange={e => setForm({...form, deadline: e.target.value})} 
          />
        </div>
        <textarea 
          placeholder="Project Description" 
          className="md:col-span-2 input-field" 
          rows="3" 
          value={form.description} 
          onChange={e => setForm({...form, description: e.target.value})}
        ></textarea>
        <button onClick={handleCreate} className="md:col-span-2 btn-primary">
          Create Workspace
        </button>
      </div>
    </div>
  );
}