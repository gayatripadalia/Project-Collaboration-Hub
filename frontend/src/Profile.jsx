import { useEffect, useState } from "react";
import api from "./api";
import { Mail, Briefcase, Star, FolderGit2, Edit2, Check, X } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [myProjects, setMyProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: "", bio: "", experienceLevel: "Beginner", skills: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, projRes] = await Promise.all([
        api.get("/auth/me"),
        api.get("/projects/my-projects")
      ]);
      setUser(userRes.data);
      setForm({
        name: userRes.data.name || "",
        bio: userRes.data.bio || "",
        experienceLevel: userRes.data.experienceLevel || "Beginner",
        skills: userRes.data.skills?.join(", ") || ""
      });
      setMyProjects(projRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      const skillsArray = typeof form.skills === 'string' 
        ? form.skills.split(",").map(s => s.trim()).filter(Boolean) 
        : [];
        
      await api.put("/auth/me", {
        ...form,
        skills: skillsArray
      });
      setIsEditing(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.msg || err.message || "Failed to update profile");
    }
  };

  if (!user) return <div className="p-8 text-gray-500">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="card overflow-hidden relative p-0">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md">
              <div className="w-full h-full bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="btn-secondary">
                <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
              </button>
            ) : (
              <div className="flex space-x-2">
                <button onClick={() => setIsEditing(false)} className="btn-secondary">
                  <X className="w-4 h-4" />
                </button>
                <button onClick={handleSave} className="btn-primary">
                  <Check className="w-4 h-4 mr-2" /> Save
                </button>
              </div>
            )}
          </div>
          
          {isEditing ? (
            <div className="space-y-4 max-w-lg">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                <input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Bio</label>
                <textarea className="input-field" rows="3" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})}></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Experience Level</label>
                  <select className="input-field" value={form.experienceLevel} onChange={e => setForm({...form, experienceLevel: e.target.value})}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Skills (comma separated)</label>
                  <input className="input-field" value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-500 flex items-center mt-1">
                  <Mail className="w-4 h-4 mr-2" /> {user.email}
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center"><Briefcase className="w-4 h-4 mr-1 text-gray-400"/> {user.experienceLevel || "No"} Level</div>
                {user.bio && <div className="w-full mt-2 text-gray-700">{user.bio}</div>}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Skills & Projects */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center"><Star className="w-5 h-5 mr-2 text-yellow-500"/> Skills</h3>
          <div className="flex flex-wrap gap-2">
            {user.skills && user.skills.length > 0 ? user.skills.map((s, i) => (
              <span key={i} className="badge-info">{s}</span>
            )) : <span className="text-gray-400 text-sm">No skills added yet.</span>}
          </div>
        </div>

        <div className="md:col-span-2 card">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center"><FolderGit2 className="w-5 h-5 mr-2 text-indigo-500"/> Joined Projects</h3>
          <div className="space-y-4">
             {myProjects.length === 0 ? <p className="text-gray-400 text-sm">Not participating in any projects.</p> : myProjects.map(p => (
               <div key={p._id} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                 <h4 className="font-bold text-gray-800">{p.title}</h4>
                 <p className="text-sm text-gray-500 mt-1 line-clamp-1">{p.description}</p>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
