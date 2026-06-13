import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "./api";
import Members from "./Members";
import Requests from "./Requests";
import Tasks from "./Tasks";
import Reports from "./Reports";
import { Trash2 } from "lucide-react";

export default function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchProjectData = async () => {
    try {
      const [projRes, memRes] = await Promise.all([
        api.get(`/projects`), 
        api.get(`/projects/members/${id}`)
      ]);
      const p = projRes.data.find(x => x._id === id);
      setProject(p);
      setMembers(memRes.data);

      const userId = localStorage.getItem("userId");
      const me = memRes.data.find(m => m.userId?._id === userId);
      setIsAdmin(me?.role === "admin");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
    try {
      await api.delete(`/projects/${id}`);
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to delete project. Make sure you are the admin.");
    }
  };

  if (!project) return <div className="p-8 text-gray-500">Loading project workspace...</div>;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "tasks", label: "Tasks" },
    { id: "members", label: "Members" },
    ...(isAdmin ? [{ id: "requests", label: "Join Requests" }] : []),
    { id: "reports", label: "Reports" }
  ];

  return (
    <div className="card p-0 flex flex-col min-h-[80vh] overflow-hidden">
      <div className="p-8 border-b border-gray-200 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
          <p className="text-gray-500 max-w-3xl">{project.description}</p>
          {project.requiredSkills && project.requiredSkills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {project.requiredSkills.map((s, i) => <span key={i} className="badge-info">{s}</span>)}
            </div>
          )}
        </div>
        {isAdmin && (
          <button onClick={handleDelete} className="btn-danger">
            <Trash2 className="w-4 h-4 mr-2" /> Delete Project
          </button>
        )}
      </div>

      <div className="flex px-8 border-b border-gray-200 bg-gray-50/50">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 font-medium text-sm transition-colors border-b-2 -mb-px ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 p-8 bg-gray-50/30">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Project Overview</h2>
            <p className="text-gray-600">Welcome to the workspace. Use the tabs above to navigate between tasks, members, and analytics.</p>
          </div>
        )}
        {activeTab === "tasks" && <Tasks projectId={id} isAdmin={isAdmin} members={members} />}
        {activeTab === "members" && <Members members={members} projectId={id} isAdmin={isAdmin} onRefresh={fetchProjectData} />}
        {activeTab === "requests" && isAdmin && <Requests projectId={id} onAccepted={fetchProjectData} />}
        {activeTab === "reports" && <Reports projectId={id} members={members} />}
      </div>
    </div>
  );
}