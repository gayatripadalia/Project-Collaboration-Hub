import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Folder, User } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", path: "/projects", icon: Folder },
    { name: "Profile", path: "/profile", icon: User },
  ];

  return (
    <div className="w-64 bg-white/80 backdrop-blur-md border-r border-gray-200 flex flex-col hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-white font-bold mr-3 shadow-sm">
          S
        </div>
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">SyncUp</h1>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                active ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-white hover:shadow-sm"
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${active ? "text-white" : "text-gray-400"}`} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
