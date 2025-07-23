import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './contexts/AuthContext';

// Pages
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import ExploreTasks from './pages/ExploreTasks';
import TaskDetails from './pages/TaskDetails';
import MyTasks from './pages/MyTasks';
import Profile from './pages/Profile';
import Referrals from './pages/Referrals';
import Help from './pages/Help';
import PublishTask from './pages/PublishTask';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

function App() {
  const location = useLocation();
  const { isConnected } = useAuth();

  useEffect(() => {
    if (isConnected && location.pathname === '/') {
      window.location.href = '/dashboard';
    }
  }, [isConnected]);

  return (
    <>
      <div className="animated-bg" />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Welcome />} />
          <Route path="/explore" element={<DashboardLayout><ExploreTasks /></DashboardLayout>} />
          <Route path="/tasks/:id" element={<DashboardLayout><TaskDetails /></DashboardLayout>} />
          <Route path="/help" element={<DashboardLayout><Help /></DashboardLayout>} />
          <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
          <Route path="/my-tasks" element={<DashboardLayout><MyTasks /></DashboardLayout>} />
          <Route path="/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
          <Route path="/referrals" element={<DashboardLayout><Referrals /></DashboardLayout>} />
          <Route path="/publish" element={<DashboardLayout><PublishTask /></DashboardLayout>} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;