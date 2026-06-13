import { useEffect, useState } from "react";
import api from "./api";
import { Check, Bell } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.post(`/notifications/read/${id}`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center">
        <Bell className="w-6 h-6 mr-2" /> Notifications
      </h2>
      
      {notifications.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
           <p className="text-gray-500">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map(n => (
            <div key={n._id} className={`bg-white p-5 rounded-xl shadow-sm border flex justify-between items-center ${n.isRead ? 'border-gray-100 opacity-60' : 'border-indigo-200 shadow-indigo-100/50'}`}>
              <div>
                <p className={`text-gray-800 ${n.isRead ? '' : 'font-bold'}`}>{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(n.timestamp).toLocaleString()}</p>
              </div>
              {!n.isRead && (
                <button onClick={() => markAsRead(n._id)} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100">
                  <Check className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}