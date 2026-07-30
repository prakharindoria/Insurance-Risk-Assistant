
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen, MessageSquare, LayoutDashboard } from 'lucide-react';
import SourcesPanel from '../components/SourcesPanel';
import ChatPanel from '../components/ChatPanel';
import StudioPanel from '../components/StudioPanel';

const DashboardLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden p-2 gap-2">
      {/* Sidebar / Sources (Left) */}
      <div className="w-1/4 h-full flex flex-col glass-panel overflow-hidden">
         <div className="p-4 border-b border-glassBorder flex items-center justify-between bg-white/10">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <BookOpen size={20} />
              <span>Sources</span>
            </div>
            <div className="text-xs text-gray-500 bg-white/30 px-2 py-1 rounded-full">
              {user?.username}
            </div>
         </div>
         <div className="flex-1 overflow-y-auto p-4">
            <SourcesPanel />
         </div>
      </div>

      {/* Main Chat / Interaction (Center) */}
      <div className="w-1/2 h-full flex flex-col glass-panel overflow-hidden">
         <div className="p-4 border-b border-glassBorder flex items-center justify-between bg-white/10">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <MessageSquare size={20} />
              <span>Chat / Orchestration</span>
            </div>
         </div>
         <div className="flex-1 overflow-y-auto p-4 relative">
            <ChatPanel />
         </div>
      </div>

      {/* Report section (Right) */}
      <div className="w-1/4 h-full flex flex-col glass-panel overflow-hidden">
         <div className="p-4 border-b border-glassBorder flex items-center justify-between bg-white/10">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <LayoutDashboard size={20} />
              <span>Report section</span>
            </div>
            <button onClick={logout} className="text-gray-500 hover:text-red-500" title="Logout">
              <LogOut size={18} />
            </button>
         </div>
         <div className="flex-1 overflow-y-auto p-4">
            <StudioPanel />
         </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
