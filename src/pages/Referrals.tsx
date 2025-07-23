import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Copy, Check, Share2, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Referrals = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  
  const referralLink = `sonavo.live/?ref=${user?.referralCode}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-bold mb-8"
      >
        Referrals
      </motion.h1>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-gradient-to-br from-yellow-900/20 to-dark-gray border-yellow-800/30 mb-8"
      >
        <div className="flex items-start gap-4">
          <div className="bg-yellow-900/30 p-3 rounded-xl">
            <AlertCircle className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold mb-2">Referral Program Locked</h2>
            <p className="text-gray-300">
              The referral program becomes available once you reach Level 2. Keep progressing and it’ll unlock automatically!
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* Referral Stats - Locked State */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="card bg-gradient-to-br from-gray-800/20 to-dark-gray border-gray-800/30">
          <div className="flex items-center">
            <div className="rounded-full bg-gray-800/30 p-3 mr-4">
              <Lock className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Referrals</p>
              <p className="text-2xl font-bold text-gray-500">Locked</p>
            </div>
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-gray-800/20 to-dark-gray border-gray-800/30">
          <div className="flex items-center">
            <div className="rounded-full bg-gray-800/30 p-3 mr-4">
              <Lock className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Active Referrals</p>
              <p className="text-2xl font-bold text-gray-500">Locked</p>
            </div>
          </div>
        </div>
        
        <div className="card bg-gradient-to-br from-gray-800/20 to-dark-gray border-gray-800/30">
          <div className="flex items-center">
            <div className="rounded-full bg-gray-800/30 p-3 mr-4">
              <Lock className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Earnings from Referrals</p>
              <p className="text-2xl font-bold text-gray-500">Locked</p>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Referral Link - Locked State */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card bg-gradient-to-br from-gray-800/20 to-dark-gray border-gray-800/30 mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Your Referral Link</h2>
          <div className="bg-gray-800/30 rounded-full px-3 py-1 text-sm text-gray-400 flex items-center">
            <Lock className="w-4 h-4 mr-1" />
            Locked
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 bg-dark-gray rounded-md p-2 flex items-center opacity-50">
            <input
              type="text"
              value="Reach Level 2 to unlock your referral link."
              readOnly
              disabled
              className="bg-transparent flex-1 border-none outline-none text-gray-500 px-2"
            />
            <button
              disabled
              className="p-2 rounded-md text-gray-500"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
          
          <button
            disabled
            className="btn bg-gray-800 text-gray-500 cursor-not-allowed flex items-center justify-center"
          >
            <Lock className="w-4 h-4 mr-2" />
            Locked
          </button>
        </div>
      </motion.div>
      
      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card bg-gradient-to-br from-gray-800/20 to-dark-gray border-gray-800/30"
      >
        <h2 className="font-bold text-lg mb-6">How Referrals Work</h2>
        
        <div className="space-y-6 opacity-50">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gray-800/30 text-gray-400 font-bold mr-4">
              1
            </div>
            <div>
              <h3 className="font-medium mb-1">Reach level 2</h3>
              <p className="text-gray-500 text-sm">
                The referral link becomes available at Level 2. Complete tasks to level up.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gray-800/30 text-gray-400 font-bold mr-4">
              2
            </div>
            <div>
              <h3 className="font-medium mb-1">Share Your Link</h3>
              <p className="text-gray-500 text-sm">
                Share your unique referral link with friends who might be interested in earning crypto.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gray-800/30 text-gray-400 font-bold mr-4">
              3
            </div>
            <div>
              <h3 className="font-medium mb-1">Earn Together</h3>
              <p className="text-gray-500 text-sm">
                You earn 5% of what your referrals make on their completed tasks. They still get 100% of their rewards!
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Referrals;