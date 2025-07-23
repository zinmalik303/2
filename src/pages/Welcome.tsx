import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showEnter, setShowEnter] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEnter(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
  navigate('/dashboard');
};


  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute h-40 w-40 rounded-full bg-neon-green/5 blur-3xl top-1/4 -left-20"></div>
        <div className="absolute h-60 w-60 rounded-full bg-neon-green/5 blur-3xl bottom-1/4 -right-20"></div>
      </div>
      
      <div className="z-10 text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <Clock className="w-16 h-16 text-neon-green mx-auto mb-4" />
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl md:text-6xl font-bold mb-4 text-white"
        >
          Welcome to <span className="text-neon-green">Sonavo</span>
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl text-gray-300 mb-8 max-w-lg mx-auto"
        >
          Complete crypto tasks. Earn real rewards.
        </motion.p>
        
        {showEnter && (
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            onClick={handleEnter}
            className="btn btn-primary text-lg px-12 py-3 animate-glow"
          >
            Enter
          </motion.button>
        )}
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 text-sm text-gray-500"
      >
        © 2025 Sonavo | The Future of Web3 Tasks
      </motion.div>
    </motion.div>
  );
};

export default Welcome;