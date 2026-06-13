import { X, Check } from "lucide-react";

export default function NotificationDrawer({ isOpen, onClose, notifications, onMarkRead }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
      <div className="w-full max-w-sm bg-white h-full shadow-2xl relative flex flex-col z-10">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-lg text-gray-800">Notifications</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-white p-1 rounded-full shadow-sm">
            <X className="w-5 h-5"/>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">No new notifications.</p>
          ) : (
            notifications.map(n => (
              <div key={n._id} className={`p-4 rounded-xl border transition-all ${n.isRead ? 'bg-white border-gray-100 opacity-60' : 'bg-white border-indigo-200 shadow-sm'}`}>
                <p className={`text-sm ${n.isRead ? 'text-gray-500' : 'font-bold text-gray-900'}`}>{n.message}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-[10px] text-gray-400 font-medium uppercase">{new Date(n.timestamp).toLocaleTimeString()}</span>
                  {!n.isRead && (
                    <button onClick={() => onMarkRead(n._id)} className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center px-2 py-1 bg-indigo-50 rounded-md">
                      <Check className="w-3 h-3 mr-1"/> Mark read
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
