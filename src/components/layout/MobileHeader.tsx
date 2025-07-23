import { Link } from 'react-router-dom';
import { Menu, Clock } from 'lucide-react';
import ConnectButton from '../auth/ConnectButton';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick }) => {
  return (
   <header className="fixed top-0 left-0 right-0 z-50 bg-dark-gray/95 backdrop-blur-md border-b border-light-gray py-3 px-4 flex items-center justify-center md:hidden relative">

     <button 
  onClick={onMenuClick}
  className="p-2 absolute left-4 rounded-md text-gray-400 hover:text-white active:bg-light-gray/20 touch-manipulation"
>

        <Menu className="w-6 h-6" />
      </button>
      
      <Link to="/dashboard" className="flex items-center">
        <Clock className="w-5 h-5 text-neon-green mr-2" />
        <span className="text-lg font-bold text-white">Sonavo</span>
      </Link>
      
      <ConnectButton />
    </header>
  );
}

export default MobileHeader;