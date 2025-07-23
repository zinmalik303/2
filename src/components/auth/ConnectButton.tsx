import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ConnectButton = () => {
  const navigate = useNavigate();
  const { isConnected, userWallet, disconnectWallet } = useAuth();

  const handleClick = () => {
    if (isConnected) {
      disconnectWallet();
    } else {
      navigate('/connect');
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
     className={`hidden sm:inline-flex items-center px-4 py-2 rounded-md font-medium transition-all duration-300 ${

        isConnected 
          ? 'bg-dark-gray text-gray-300 hover:text-white' 
          : 'bg-neon-green text-background hover:bg-opacity-90'
      }`}
    >
      <Wallet className="w-4 h-4 mr-2" />
      {isConnected ? (
        <span>
          {userWallet?.slice(0, 6)}...{userWallet?.slice(-4)}
        </span>
      ) : (
        'Connect Wallet'
      )}
    </motion.button>
  );
};

export default ConnectButton;