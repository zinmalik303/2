import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Compass, 
  CheckSquare, 
  User, 
  Users, 
  HelpCircle, 
  PlusCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { disconnectWallet } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { 
      name: 'Explore Tasks', 
      path: '/explore', 
      icon: <Compass className="w-5 h-5" /> 
    },
    { 
      name: 'My Tasks', 
      path: '/my-tasks', 
      icon: <CheckSquare className="w-5 h-5" /> 
    },
    { 
      name: 'Profile', 
      path: '/profile', 
      icon: <User className="w-5 h-5" /> 
    },
    { 
      name: 'Referrals', 
      path: '/referrals', 
      icon: <Users className="w-5 h-5" /> 
    },
    { 
      name: 'Help', 
      path: '/help', 
      icon: <HelpCircle className="w-5 h-5" /> 
    }
  ];

  return (
    <div className="bg-dark-gray h-full w-64 border-r border-light-gray flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-light-gray">
        <Link to="/dashboard" className="block">
          <div className="flex items-center">
            <Clock className="w-6 h-6 text-neon-green mr-2" />
            <span className="text-xl font-bold text-white">Sonavo</span>
          </div>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 pt-5 pb-5 overflow-y-auto hide-scrollbar">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path}
                className={`flex items-center px-3 py-2.5 rounded-md transition-all duration-200 ${
                  isActive(item.path) 
                    ? 'bg-neon-green bg-opacity-10 text-neon-green' 
                    : 'text-gray-300 hover:bg-light-gray active:bg-light-gray/50'
                }`}
              >
                {item.icon}
                <span className="ml-3 font-medium">{item.name}</span>
                
                {isActive(item.path) && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="ml-auto w-1.5 h-5 bg-neon-green rounded-full"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Publish Task Button */}
      <div className="px-4 pt-2 pb-5">
        <Link 
          to="/publish"
          className="group relative overflow-hidden w-full bg-gradient-to-r from-neon-green to-[#00E5FF] rounded-xl py-3 px-4 flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,178,0.3)] hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center">
            <div className="bg-white/20 rounded-full p-1 mr-2">
              <PlusCircle className="w-4 h-4 text-background" />
            </div>
            <span className="font-semibold text-background">Publish a Task</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;