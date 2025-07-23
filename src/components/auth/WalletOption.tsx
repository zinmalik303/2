import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface WalletOptionProps {
  name: string;
  onClick: () => void;
  isLoading?: boolean;
}

const WalletOption: React.FC<WalletOptionProps> = ({ name, onClick, isLoading = false }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={isLoading}
      className="w-full bg-dark-gray border border-light-gray hover:border-neon-green rounded-lg p-4 flex items-center justify-between transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,178,0.2)]"
    >
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-medium-gray flex items-center justify-center mr-3">
          {/* Different icon based on wallet type */}
          {name === 'MetaMask' && (
            <span className="text-lg font-bold text-yellow-400">M</span>
          )}
          {name === 'Trust Wallet' && (
            <span className="text-lg font-bold text-blue-400">T</span>
          )}
          {name === 'WalletConnect' && (
            <span className="text-lg font-bold text-blue-500">W</span>
          )}
        </div>
        <span className="font-medium">{name}</span>
      </div>
      
      {isLoading ? (
        <Loader2 className="h-5 w-5 text-neon-green animate-spin" />
      ) : (
        <div className="w-6 h-6 rounded-full border border-neon-green flex items-center justify-center text-neon-green">
          →
        </div>
      )}
    </motion.button>
  );
};

export default WalletOption;