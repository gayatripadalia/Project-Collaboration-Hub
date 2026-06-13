import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);
      window.location.href = "/dashboard";
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-12 lg:px-24">
        <div className="max-w-md w-full mx-auto">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold mb-8">S</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-500 mb-8">Please enter your details to sign in.</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all" placeholder="Enter your email" onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input type="password" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all" placeholder="••••••••" onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white font-medium py-3 rounded-lg hover:bg-indigo-700 transition-colors flex justify-center items-center">
              <LogIn className="w-5 h-5 mr-2" />
              Sign In
            </button>
          </form>
          <p className="mt-8 text-center text-gray-600">
            Don't have an account? <Link to="/signup" className="text-indigo-600 font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:block w-1/2 relative">
        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Team Collaboration" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-indigo-900/40 mix-blend-multiply"></div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-lg text-center backdrop-blur-md bg-white/10 p-12 rounded-3xl border border-white/20 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-6">Build the Future Together</h2>
            <p className="text-indigo-50 text-lg leading-relaxed">Join a dynamic collaboration platform designed to empower teams, streamline tasks, and drive productivity to new heights.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
