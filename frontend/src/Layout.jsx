import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import api from "./api";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import NotificationDrawer from "./NotificationDrawer";

const socket = io("http://localhost:5000");

export default function Layout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    api.get('/auth/me').then(res => {
      setUser(res.data);
      socket.emit("joinUserRoom", res.data._id);
    });

    fetchNotifications();

    socket.on("notification", (newNotif) => {
      setNotifications(prev => [newNotif, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.isRead).length);
    } catch (err) {}
  };

  const markAsRead = async (id) => {
    try {
      await api.post(`/notifications/read/${id}`);
      fetchNotifications();
    } catch (err) {}
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar 
          user={user} 
          unreadCount={unreadCount} 
          onOpenDrawer={() => setIsDrawerOpen(true)} 
        />

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>

        <NotificationDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          notifications={notifications} 
          onMarkRead={markAsRead} 
        />
      </div>
    </div>
  );
}
