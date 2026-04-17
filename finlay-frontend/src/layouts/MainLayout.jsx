import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Chatbot from '../components/chatbot/Chatbot';

export default function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 overflow-y-auto relative">
        <main className="min-h-screen p-6 pb-24">
          <Outlet />
        </main>
        <Chatbot />
      </div>
    </div>
  );
}
