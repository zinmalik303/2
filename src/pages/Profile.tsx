import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCircle, 
  Shield, 
  Star, 
  Edit2, 
  Wallet, 
  X, 
  AlertCircle,
  Trophy,
  Clock,
  ArrowRight,
  ArrowLeft,
  Coins,
  Lock,
  Zap,
  Ghost,
  Flame,
  Bug,
  Moon,
  Wallet2,
  Footprints,
  UserX,
  Camera,
  Check,
  Sparkles,
  Users,
  Brain,
  Rocket
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const achievements = [
  {
    id: 'early_adopter',
    title: 'Early Adopter',
    description: 'Joined Sonavo in the early stages',
    icon: Star,
    unlocked: true,
    color: 'yellow'
  },
  {
    id: 'gas_surfer',
    title: 'Gas Surfer',
    description: 'Completed a task during network congestion',
    icon: Flame,
    unlocked: false,
    color: 'orange'
  },
  {
    id: 'task_sniper',
    title: 'Task Sniper',
    description: 'Completed a task within 60 seconds of publication',
    icon: Zap,
    unlocked: false,
    color: 'blue'
  },
  {
    id: 'muted_master',
    title: 'Muted Master',
    description: 'Completed 10 tasks without social media interaction',
    icon: UserX,
    unlocked: false,
    progress: 0,
    target: 10,
    color: 'slate'
  },
  {
    id: 'speedrunner',
    title: 'Speedrunner',
    description: 'Completed 5 tasks in 10 minutes',
    icon: Zap,
    unlocked: false,
    progress: 0,
    target: 5,
    color: 'cyan'
  },
  {
    id: 'back_from_dead',
    title: 'Back from Dead',
    description: 'Returned after 30+ days and completed 3 tasks',
    icon: Ghost,
    unlocked: false,
    progress: 0,
    target: 3,
    color: 'violet'
  },
  {
    id: 'anonymous_ape',
    title: 'Anonymous Ape',
    description: 'Never provided social media handles',
    icon: UserX,
    unlocked: false,
    color: 'emerald'
  },
  {
    id: 'bug_hunter',
    title: 'Bug Hunter',
    description: 'Helped find a platform bug',
    icon: Bug,
    unlocked: false,
    color: 'red'
  },
  {
    id: 'max_gas_holder',
    title: 'Max Gas Holder',
    description: 'Held earnings for over a month',
    icon: Wallet,
    unlocked: false,
    color: 'amber'
  },
  {
    id: 'tasks_3',
    title: 'Task Starter',
    description: 'Complete 3 tasks',
    icon: Trophy,
    unlocked: false,
    progress: 0,
    target: 3,
    color: 'blue'
  },
  {
    id: 'tasks_10',
    title: 'Task Enthusiast',
    description: 'Complete 10 tasks',
    icon: Trophy,
    unlocked: false,
    progress: 0,
    target: 10,
    color: 'green'
  },
  {
    id: 'tasks_50',
    title: 'Task Master',
    description: 'Complete 50 tasks',
    icon: Trophy,
    unlocked: false,
    progress: 0,
    target: 50,
    color: 'purple'
  }
];

const level2Features = [
  {
    icon: Wallet,
    title: "Unlimited Withdrawals",
    description: "Withdraw your funds starting from $1 instead of the $30 limit on Level 1."
  },
  {
    icon: Trophy,
    title: "Achievements & Rewards",
    description: "Unlock the achievement system and earn $1–$10 for each milestone."
  },
  {
    icon: Star,
    title: "Premium Tasks",
    description: "Access higher-paying and more exclusive tasks."
  },
  {
    icon: Flame,
    title: "Daily Login Bonuses",
    description: "Get up to $0.50 just for showing up daily."
  },
  {
    icon: Users,
    title: "User Rankings",
    description: "Enter the global leaderboard and compete for weekly prizes."
  },
  {
    icon: Brain,
    title: "Custom Partner Quests",
    description: "Get access to exclusive missions from top crypto projects."
  },
  {
    icon: Shield,
    title: "Priority Task Verification",
    description: "Your task submissions are reviewed much faster."
  },
  {
    icon: Users,
    title: "+25% Referral Bonus",
    description: "Earn more from every invited friend."
  },
  {
    icon: Rocket,
    title: "Access to Solana / zkSync / LayerZero Quests",
    description: "Level 2 unlocks DeFi partner campaigns and special drops."
  }
];

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [showEditSuccess, setShowEditSuccess] = useState(false);
  const [showLevel2Preview, setShowLevel2Preview] = useState(false);
  const [showMoreAchievementsModal, setShowMoreAchievementsModal] = useState(false);
  
  const achievementsPerPage = 4;
  const totalPages = Math.ceil(achievements.length / achievementsPerPage);
  
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    } else {
      setShowMoreAchievementsModal(true);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  const visibleAchievements = achievements.slice(
    currentPage * achievementsPerPage,
    (currentPage + 1) * achievementsPerPage
  );

  const handleUsernameSubmit = () => {
    if (newUsername.trim() && newUsername.length <= 12) {
      updateProfile({ username: newUsername.trim() });
      setIsEditingUsername(false);
      setShowEditSuccess(true);
      setTimeout(() => setShowEditSuccess(false), 2000);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 12) {
      setNewUsername(value);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateProfile({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-green/5 via-blue-500/5 to-purple-500/5 rounded-2xl blur-xl"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative card bg-gradient-to-r from-[#1a1f35]/90 to-[#111827]/90 backdrop-blur-sm"
        >
          <div className="absolute top-8 right-8">

            <button
              onClick={() => setShowWithdrawModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-neon-green to-green-400 text-background px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-neon-green/20 transition-all duration-300"
            >
              <Wallet className="w-5 h-5" />
              Withdraw
            </button>
          </div>

         <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">


           <div className="relative w-24 h-24">
  <div className="w-full h-full rounded-full bg-gradient-to-br from-neon-green/20 to-blue-500/20 flex items-center justify-center overflow-hidden">
    {user?.avatar ? (
      <img 
        src={user.avatar} 
        alt={user.username} 
        className="w-full h-full object-cover"
      />
    ) : (
      <UserCircle className="w-16 h-16 text-white" />
    )}
  </div>

  <label className="absolute bottom-0 right-0 p-1.5 rounded-full bg-medium-gray border border-light-gray hover:bg-light-gray transition-colors cursor-pointer">
    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleAvatarChange}
    />
    <Camera className="w-4 h-4" />
  </label>
</div>

            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                {isEditingUsername ? (
                  <div className="flex items-center gap-2">
                   <input
  type="text"
  value={newUsername}
  onChange={handleUsernameChange}
  maxLength={12}
  className="w-full sm:w-auto bg-dark-gray border border-light-gray rounded-lg px-3 py-1 text-xl sm:text-2xl font-bold focus:outline-none focus:border-neon-green"
  autoFocus
/>

                    <div className="text-sm text-gray-400">
                      {newUsername.length}/12
                    </div>
                    <button
                      onClick={handleUsernameSubmit}
                      className="p-1 rounded-lg bg-neon-green/10 text-neon-green hover:bg-neon-green/20"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingUsername(false);
                        setNewUsername(user?.username || '');
                      }}
                      className="p-1 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">{user?.username}</h2>
                    <button
                      onClick={() => setIsEditingUsername(true)}
                      className="p-1 rounded-lg bg-medium-gray hover:bg-light-gray transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="bg-neon-green/20 text-neon-green px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Shield className="w-4 h-4 mr-1" /> Level {user?.level}
                  </span>
                </div>
              </div>
              
              <p className="font-mono text-gray-400 text-sm mb-6">
                {user?.joinedAt && ` • Joined ${formatDate(user.joinedAt)}`}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="bg-gradient-to-br from-white/5 to-dark-gray/10 backdrop-blur-lg border border-white/10 rounded-xl px-4 py-3 shadow-[0_0_10px_rgba(0,255,178,0.03)]">

                  <p className="text-sm text-gray-400">Tasks Completed</p>
                  <p className="text-xl font-bold">{user?.tasksCompleted || 0}</p>
                </div>
                
               <div className="bg-gradient-to-br from-white/5 to-dark-gray/10 backdrop-blur-lg border border-white/10 rounded-xl px-4 py-3 shadow-[0_0_10px_rgba(0,255,178,0.03)]">

                  <p className="text-sm text-gray-400">Total Earned</p>
                  <p className="text-xl font-bold">${(user?.totalEarned || 0).toFixed(2)}</p>
                </div>
                
               <div className="bg-gradient-to-br from-white/5 to-dark-gray/10 backdrop-blur-lg border border-white/10 rounded-xl px-4 py-3 shadow-[0_0_10px_rgba(0,255,178,0.03)]">

                  <p className="text-sm text-gray-400">Current Balance</p>
                  <p className="text-xl font-bold text-neon-green">${(user?.balance || 0).toFixed(2)}</p>
                </div>
                
               <div className="bg-gradient-to-br from-white/5 to-dark-gray/10 backdrop-blur-lg border border-white/10 rounded-xl px-4 py-3 shadow-[0_0_10px_rgba(0,255,178,0.03)]">

                  <p className="text-sm text-gray-400">Achievements</p>
                  <p className="text-xl font-bold">1/10</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {showEditSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-4 right-4 bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3 z-50"
          >
            <Check className="w-5 h-5 text-green-500" />
            <p className="text-green-100">Profile updated successfully!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievements Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Achievements</h2>
            <p className="text-sm text-gray-500 mt-1">
              Complete achievements to earn rewards from $1 to $10 based on difficulty.
              <br />
              
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`p-2 rounded-lg ${
                currentPage === 0
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-400 hover:text-white hover:bg-light-gray'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextPage}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-light-gray"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          <AnimatePresence mode="wait">
           {visibleAchievements.map((achievement, index) => (
  <motion.div
    key={achievement.id}
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
    className="relative group overflow-hidden rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-4 shadow-[0_0_10px_rgba(0,255,178,0.05)] transition-all duration-300 hover:border-neon-green/40"
  >
    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-3">
      <achievement.icon className={`w-6 h-6 ${achievement.id === 'early_adopter' && achievement.unlocked ? 'text-yellow-400' : 'text-neon-green'} group-hover:scale-110 transition-transform ${achievement.unlocked ? 'animate-pulse' : ''}`} />


    </div>

    <h3 className="font-bold mb-1 text-white">
      {achievement.title}
    </h3>

    <p className="text-sm text-gray-400 mb-3">
      {achievement.description}
    </p>

    {'progress' in achievement && achievement.progress !== undefined && (
      <div>
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <div
  className="h-full bg-gradient-to-r from-neon-green to-blue-500 rounded-full transition-all duration-500"
  style={{
    width: `${(achievement.progress / achievement.target) * 100}%`
  }}
></div>

        </div>
        <p className="text-xs text-gray-600 mt-1">
          {achievement.progress} / {achievement.target}
        </p>
      </div>
    )}

    {!achievement.unlocked && (
      <div className="absolute top-2 right-2">
       <Lock className="w-7 h-7 text-neon-green bg-dark-gray/60 p-1.5 rounded-full shadow-lg shadow-neon-green/30 animate-pulse" />


      </div>
    )}
  </motion.div>
))}

            
          </AnimatePresence>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-400">More achievements coming soon...</p>
        </div>

        {/* Level 2 Preview Button */}
        <motion.button
          onClick={() => setShowLevel2Preview(!showLevel2Preview)}
          className="w-full mt-8 relative group overflow-hidden"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-neon-green/20 blur-xl group-hover:opacity-75 transition-opacity duration-500"></div>
          <div className="absolute inset-0 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-green/10 via-blue-500/10 to-purple-500/10 blur-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-neon-green/10 blur-xl animate-pulse delay-75"></div>
          </div>
          <div className="relative bg-gradient-to-r from-dark-gray/90 to-background/90 border border-light-gray group-hover:border-neon-green/50 rounded-xl p-8 flex items-center justify-center gap-6 transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl group-hover:animate-pulse"></div>
            </div>
            <div className="relative flex items-center gap-6">
              <div className="bg-dark-gray p-4 rounded-xl group-hover:shadow-[0_0_15px_rgba(0,255,178,0.3)] transition-all duration-500">
                <Lock className="w-12 h-12 text-neon-green group-hover:animate-pulse" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-neon-green via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Level 2 Preview
                </h3>
                <p className="text-gray-400 text-lg">Click to discover what awaits at Level 2</p>
              </div>
            </div>
          </div>
        </motion.button>

        {/* Level 2 Preview Modal */}
        <AnimatePresence>
          {showLevel2Preview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowLevel2Preview(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gradient-to-br from-dark-gray to-background max-w-2xl w-full rounded-2xl p-8 relative overflow-hidden max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowLevel2Preview(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-lg hover:bg-light-gray/20 transition-colors z-50"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-neon-green/10 rounded-full blur-3xl animate-pulse"></div>
                </div>

                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-neon-green/20 p-3 rounded-xl">
                      <Trophy className="w-8 h-8 text-neon-green" />
                    </div>
                    <h2 className="text-2xl font-bold">Level 2 Features</h2>
                  </div>

                  <div className="space-y-6">
                    {level2Features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-4 bg-gradient-to-r from-dark-gray/50 to-transparent p-4 rounded-xl border border-light-gray/20 hover:border-neon-green/20 transition-all duration-300"
                      >
                        <div className="bg-neon-green/10 p-3 rounded-xl">
                          <feature.icon className="w-6 h-6 text-neon-green" />
                        </div>
                        <div>
                          <h3 className="font-bold mb-1">{feature.title}</h3>
                          <p className="text-gray-400">{feature.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-8 text-center">
                    <p className="text-gray-400 mb-4">Complete more tasks to reach Level 2</p>
                    <button
                      onClick={() => setShowLevel2Preview(false)}
                      className="bg-gradient-to-r from-neon-green to-blue-500 text-background px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                    >
                      Got it
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* More Achievements Modal */}
        <AnimatePresence>
          {showMoreAchievementsModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowMoreAchievementsModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gradient-to-br from-dark-gray to-background max-w-md w-full rounded-2xl p-8 relative text-center"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowMoreAchievementsModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-lg hover:bg-light-gray/20 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="w-16 h-16 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-neon-green" />
                </div>

                <h3 className="text-2xl font-bold mb-4">Level 2 Required</h3>
                <p className="text-gray-400 mb-6">
                  Reach Level 2 to unlock the full list of achievements and start earning rewards for each milestone!
                </p>

                <button
                  onClick={() => {
                    setShowMoreAchievementsModal(false);
                    setCurrentPage(0);
                  }}
                  className="w-full bg-neon-green text-background rounded-lg py-3 font-medium hover:bg-opacity-90 transition-colors"
                >
                  Got it
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Withdraw Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-dark-gray rounded-xl p-8 max-w-md w-full mx-4 relative"
            >
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Minimum Withdrawal Amount</h3>
                <p className="text-gray-300 mb-6">
                  The minimum amount required for withdrawal is $30.00. Continue completing tasks to reach the minimum withdrawal amount.
                </p>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="w-full bg-neon-green text-background rounded-lg py-3 font-medium hover:bg-opacity-90 transition-colors"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;