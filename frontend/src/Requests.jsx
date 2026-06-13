import { useEffect, useState } from "react";
import api from "./api";
import { Check, X, Star } from "lucide-react";

export default function Requests({ projectId, onAccepted }) {
  const [requests, setRequests] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, [projectId]);

  const fetchRequests = async () => {
    try {
      const res = await api.get(`/projects/requests/${projectId}`);
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResponse = async (id, action) => {
    try {
      await api.post(`/projects/${action}/${id}`);
      fetchRequests();
      if (action === "accept" && onAccepted) onAccepted();
    } catch (err) {
      alert(`Failed to ${action}`);
    }
  };

  if (requests.length === 0) return <p className="text-gray-500">No pending join requests.</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Pending Requests</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requests.map(req => (
          <div key={req._id} className="card flex flex-col justify-between p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 
                  className="font-bold text-gray-900 cursor-pointer hover:underline"
                  onClick={() => setSelectedProfile(req.userId)}
                >
                  {req.userId?.name}
                </h4>
                <p className="text-sm text-gray-500">{req.userId?.email}</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleResponse(req._id, "accept")} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                  <Check className="w-5 h-5" />
                </button>
                <button onClick={() => handleResponse(req._id, "reject")} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {req.userId?.skills && req.userId.skills.length > 0 && (
              <div>
                <p className="text-xs font-bold text-gray-400 mb-2 flex items-center"><Star className="w-3 h-3 mr-1 text-yellow-500"/> SKILLS:</p>
                <div className="flex flex-wrap gap-1">
                  {req.userId.skills.map(s => <span key={s} className="badge-info text-[10px]" style={{fontSize: "0.6rem", padding: "2px 6px"}}>{s}</span>)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProfile(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">User Profile</h3>
              <button onClick={() => setSelectedProfile(null)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>
            <div className="space-y-3">
              <p><strong>Name:</strong> {selectedProfile.name}</p>
              <p><strong>Email:</strong> {selectedProfile.email}</p>
              {selectedProfile.bio && <p><strong>Bio:</strong> {selectedProfile.bio}</p>}
              {selectedProfile.skills && selectedProfile.skills.length > 0 && (
                <div>
                  <strong>Skills:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedProfile.skills.map((s, i) => <span key={i} className="badge-info text-[10px]" style={{fontSize: "0.6rem", padding: "2px 6px"}}>{s}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
