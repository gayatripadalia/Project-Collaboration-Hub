import { useEffect, useState } from "react";
import api from "./api";
import { Users, Search, Calendar, Star } from "lucide-react";

export default function ExploreProjects() {
  const [allProjects, setAllProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    try {
      const res = await api.get("/projects");
      setAllProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleJoin = async (projectId) => {
    try {
      const res = await api.post(`/projects/join/${projectId}`);
      alert(res.data.msg || "Join request sent");
    } catch (err) {
      alert("Failed to send join request");
    }
  };

  const filteredProjects = allProjects.filter(p => {
    if (!searchQuery) return true;
    const lowerQ = searchQuery.toLowerCase();
    return (p.title && p.title.toLowerCase().includes(lowerQ)) || 
           (p.createdBy?.name && p.createdBy.name.toLowerCase().includes(lowerQ));
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Explore Projects</h2>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by title or creator..." 
            className="input-field pl-10 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <p className="text-gray-500">No projects found.</p>
        ) : filteredProjects.map((p) => {
          const spaceLeft = (p.capacity || 10) - (p.acceptedCount || 1);
          return (
            <div key={p._id} className="card flex flex-col md:flex-row justify-between items-start md:items-center transition-transform hover:-translate-y-1 hover:shadow-md">
              <div className="flex-1 mr-4 mb-4 md:mb-0">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{p.title}</h3>
                <p className="text-gray-500 text-sm mb-3">{p.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1 text-indigo-500" /> 
                    Created by {p.createdBy?.name || 'Unknown'}
                  </span>
                  <span className="flex items-center">
                    Teammates: <span className="ml-1 font-bold">{p.acceptedCount || 1}</span>
                  </span>
                  <span className="flex items-center font-medium">
                    Space Left: <span className={`ml-1 ${spaceLeft > 0 ? 'text-green-600' : 'text-red-600'}`}>{Math.max(0, spaceLeft)} / {p.capacity || 10}</span>
                  </span>
                  {p.deadline && (
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                      Deadline: {new Date(p.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {p.requiredSkills && p.requiredSkills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 items-center">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs font-bold text-gray-400 mr-1 uppercase">Required:</span>
                    {p.requiredSkills.map((s, i) => <span key={i} className="badge-info text-[10px]" style={{fontSize: "0.6rem", padding: "2px 6px"}}>{s}</span>)}
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => handleJoin(p._id)} 
                disabled={spaceLeft <= 0}
                className={`btn-primary whitespace-nowrap ${spaceLeft <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {spaceLeft <= 0 ? 'Project Full' : 'Request to Join'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
