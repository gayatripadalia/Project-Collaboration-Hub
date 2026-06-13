import { useEffect, useState } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";
import CreateProject from "./CreateProject";
import { FolderGit2, Plus } from "lucide-react";

export default function Dashboard() {
  const [myProjects, setMyProjects] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const myRes = await api.get("/projects/my-projects");
      setMyProjects(myRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Active Projects</p>
            <h3 className="text-3xl font-bold text-gray-800">{myProjects.length}</h3>
          </div>
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 shadow-sm">
            <FolderGit2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">My Workspace</h2>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-primary">
          <Plus className="w-5 h-5 mr-1" /> New Project
        </button>
      </div>

      {showCreate && <CreateProject onCreated={() => { fetchData(); setShowCreate(false); }} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myProjects.length === 0 ? (
          <div className="col-span-full card flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <FolderGit2 className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">No Active Projects</h3>
            <p className="text-gray-500 mb-6">You aren't participating in any projects right now.</p>
            <button onClick={() => navigate("/projects")} className="btn-secondary">
              Explore Projects
            </button>
          </div>
        ) : myProjects.map((p) => (
          <div key={p._id} className="card flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md h-full">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">{p.title}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-3">{p.description}</p>
            </div>
            <button 
              onClick={() => navigate(`/project/${p._id}`)}
              className="w-full mt-auto py-2 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-100 transition-colors"
            >
              Open Workspace
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}