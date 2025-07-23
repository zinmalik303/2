import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import WalletOption from '../components/auth/WalletOption';

const Connect = () => {
  const navigate = useNavigate();
  const { connectWallet } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const handleConnect = async (walletType: 'MetaMask' | 'TrustWallet' | 'WalletConnect') => {
    try {
      setIsConnecting(true);
      setSelectedWallet(walletType);
      await connectWallet(walletType);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to connect wallet', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute h-40 w-40 rounded-full bg-neon-green/5 blur-3xl top-1/4 -left-20"></div>
        <div className="absolute h-60 w-60 rounded-full bg-neon-green/5 blur-3xl bottom-1/4 -right-20"></div>
      </div>
      
      <div className="z-10 text-center max-w-md w-full">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Wallet className="w-16 h-16 text-neon-green mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold mb-2 text-white">Connect Wallet</h1>
          <p className="text-gray-400 mb-8">Connect your wallet to get started with Sonavo</p>
          
          <div className="space-y-4">
            <WalletOption 
              name="MetaMask" 
              onClick={() => handleConnect('MetaMask')}
              isLoading={isConnecting && selectedWallet === 'MetaMask'}
            />
            
            <WalletOption 
              name="Trust Wallet" 
              onClick={() => handleConnect('TrustWallet')}
              isLoading={isConnecting && selectedWallet === 'TrustWallet'} 
            />
            
            <WalletOption 
              name="WalletConnect" 
              onClick={() => handleConnect('WalletConnect')}
              isLoading={isConnecting && selectedWallet === 'WalletConnect'} 
            />
          </div>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 text-sm text-gray-500"
      >
        © 2025 Sonavo | The Future of Web3 Tasks
      </motion.div>
    </motion.div>
  );
};

export default Connect;