import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";

export default function Navbar({ user, unreadCount, onOpenDrawer }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-end px-4 md:px-8 z-10 sticky top-0">
      <div className="flex items-center space-x-4 md:space-x-6 relative">
        <button 
          onClick={onOpenDrawer}
          className="relative p-2 text-gray-400 hover:text-indigo-600 transition-colors bg-gray-50 hover:bg-indigo-50 rounded-full"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          )}
        </button>

        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md cursor-pointer hover:shadow-lg transition-all"
          >
            {user ? user.name.charAt(0).toUpperCase() : 'U'}
          </button>
          
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100 mb-2">
                <p className="text-sm font-bold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium transition-colors">
                Edit Profile
              </Link>
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
