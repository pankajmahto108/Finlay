import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Chatbot from '../components/chatbot/Chatbot';

export default function MainLayout() {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const isDashboard = location.pathname === '/dashboard' || isLanding;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 overflow-y-auto relative">
        <main className={`min-h-screen ${isLanding ? '' : 'p-6 pb-24'}`}>
          <Outlet />
        </main>
        {isDashboard && <Chatbot />}
      </div>
    </div>
  );
}
