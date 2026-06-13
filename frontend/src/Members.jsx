import { useState } from "react";
import api from "./api";
import { Trash2 } from "lucide-react";

export default function Members({ members, isAdmin, projectId, onRefresh }) {
  const [selectedProfile, setSelectedProfile] = useState(null);

  const handleRemove = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      await api.delete(`/projects/members/${projectId}/${userId}`);
      setSelectedProfile(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to remove member");
    }
  };

  if (members.length === 0) return <p className="text-gray-500">No members yet.</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Team Members</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map(m => (
          <div 
            key={m._id} 
            className="card flex items-center space-x-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setSelectedProfile(m)}
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-lg">
              {m.userId?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 truncate">
              <h4 className="font-bold text-gray-900 truncate">{m.userId?.name}</h4>
              <p className="text-xs text-gray-500 truncate">{m.userId?.email}</p>
              <span className={`inline-block mt-2 ${m.role === 'admin' ? 'badge-info' : 'badge-success'}`}>
                {m.role.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProfile(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">User Profile</h3>
              <button onClick={() => setSelectedProfile(null)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>
            <div className="space-y-3 mb-6">
              <p><strong>Name:</strong> {selectedProfile.userId?.name}</p>
              <p><strong>Email:</strong> {selectedProfile.userId?.email}</p>
              {selectedProfile.userId?.bio && <p><strong>Bio:</strong> {selectedProfile.userId?.bio}</p>}
              {selectedProfile.userId?.skills && selectedProfile.userId.skills.length > 0 && (
                <div>
                  <strong>Skills:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedProfile.userId.skills.map((s, i) => <span key={i} className="badge-info text-[10px]" style={{fontSize: "0.6rem", padding: "2px 6px"}}>{s}</span>)}
                  </div>
                </div>
              )}
            </div>
            
            {isAdmin && selectedProfile.role !== 'admin' && (
              <button 
                onClick={() => handleRemove(selectedProfile.userId?._id)} 
                className="w-full py-2 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Remove Teammate
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}