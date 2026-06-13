import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", skills: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = typeof form.skills === 'string' ? form.skills.split(",").map(s => s.trim()).filter(Boolean) : [];
      await axios.post("http://localhost:5000/api/auth/signup", { ...form, skills: skillsArray });
      alert("User created successfully! You can now log in.");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      <div className="hidden lg:block w-1/2 relative">
        <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Tech Workspace" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-indigo-900/40 mix-blend-multiply"></div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-lg text-center backdrop-blur-md bg-white/10 p-12 rounded-3xl border border-white/20 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-6">Start Your Journey</h2>
            <p className="text-indigo-50 text-lg leading-relaxed">Create an account and connect with top talent. Organize projects, delegate tasks, and achieve your goals.</p>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-12 lg:px-24">
        <div className="max-w-md w-full mx-auto">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold mb-8">S</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h2>
          <p className="text-gray-500 mb-8">Get started with SyncUp today.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" required value={form.name} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all" placeholder="John Doe" onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" required value={form.email} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all" placeholder="Enter your email" onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Skills (comma separated)</label>
              <input type="text" value={form.skills} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all" placeholder="React, Node.js, Design" onChange={e => setForm({...form, skills: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" required value={form.password} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all" placeholder="••••••••" onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white font-medium py-3 rounded-lg hover:bg-indigo-700 transition-colors flex justify-center items-center mt-4">
              <UserPlus className="w-5 h-5 mr-2" />
              Sign Up
            </button>
          </form>
          <p className="mt-8 text-center text-gray-600">
            Already have an account? <Link to="/" className="text-indigo-600 font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}