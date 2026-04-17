import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutDashboard, LineChart, Briefcase, Settings, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/market', label: 'Market', icon: LineChart },
  { path: '/portfolio', label: 'Portfolio', icon: Briefcase },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <motion.aside
      animate={{ width: isOpen ? 260 : 80 }}
      className="h-screen glass-panel relative left-0 top-0 border-r border-white/5 flex flex-col pt-6 z-20"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-4 top-8 bg-surface border border-white/10 rounded-full p-1.5 hover:text-accent transition-colors shadow-lg z-30"
      >
        {isOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      <div className="flex items-center gap-3 px-6 mb-12">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
          <span className="font-bold text-white">F</span>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
            >
              Finlay
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden ${
                isActive 
                  ? 'text-white glass-panel border-accent/30 shadow-[0_0_15px_rgba(34,211,238,0.15)] bg-surface/80' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute left-0 top-0 w-1 h-full bg-accent rounded-r-full"
                  />
                )}
                <item.icon size={20} className={`shrink-0 z-10 hover:scale-110 transition-transform ${isActive ? 'text-accent' : ''}`} />
                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-medium whitespace-nowrap z-10"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto mb-4">
        <button className="flex items-center gap-4 px-3 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all w-full">
          <Settings size={20} className="shrink-0" />
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-medium whitespace-nowrap"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
