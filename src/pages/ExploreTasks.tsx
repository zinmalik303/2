import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ExternalLink, 
  Lock, 
  Download, 
  ChevronDown, 
  ChevronUp,
  CheckCircle,
  X,
  Loader2,
  Upload,
  Link as LinkIcon,
  ArrowRight,
  DollarSign,
  Shield,
  Globe,
  ArrowUpRight,
  Star,
  TrendingUp,
  Vote,
  Layers,
  Flag,
  Wallet,
  MessageSquare,
  LineChart,
  Settings, 
  ShieldCheck,
  Target,
  Flame,
  Coins,
  Share2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';

const ExploreTasks = () => {
  const navigate = useNavigate();
  const { updateUserBalance, refreshUser } = useAuth();
  const { 
    tasks, 
    submitTask, 
    userSubmissions, 
    visitedTasks,
    updateVisitedTasks,
    globalAttemptCount,
    incrementGlobalAttemptCount,
    refreshData
  } = useTasks();
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [taskLink, setTaskLink] = useState('');
  const [showFailureNotification, setShowFailureNotification] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [verifyingTasks, setVerifyingTasks] = useState<Record<string, number>>({});

 const handleDownloadImage = () => {
  const link = document.createElement('a');
  link.href = '/HotTask.png'; // путь к файлу в public
  link.download = 'Sonavo_CMC_Banner.png'; // имя файла при скачивании
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  // Get approved task IDs from userSubmissions
  const approvedTaskIds = new Set(
    userSubmissions
      .filter(s => s.status === 'Approved')
      .map(s => s.taskId)
  );

  const availableTasks = tasks.filter(task => {
    if (!task || !task.id) return false;
    if (task.id === 'survey') return false; // exclude from explore
    const isApproved = approvedTaskIds.has(task.id);
    return !isApproved && (selectedDifficulty === null || task.difficulty === selectedDifficulty);
  });


  useEffect(() => {
  const intervals: NodeJS.Timeout[] = [];

  Object.entries(verifyingTasks).forEach(([taskId, countdown]) => {
    if (countdown > 1) {
      const interval = setInterval(() => {
        setVerifyingTasks(prev => ({
          ...prev,
          [taskId]: prev[taskId] - 1
        }));
      }, 1000);
      intervals.push(interval);
    } else if (countdown <= 1) {
  setVerifyingTasks(prev => {
    const updated = { ...prev };
    delete updated[taskId];
    return updated;
  });

  handleVerificationComplete(taskId);
}


  });

  return () => intervals.forEach(clearInterval);
}, [verifyingTasks]);


  const handleVisitSite = (taskId: string, link: string) => {
    window.open(link, '_blank');
    updateVisitedTasks(taskId, true);
  };

  const handleVerifyTask = (taskId: string) => {
    setCurrentTaskId(taskId);
    setShowVerificationModal(true);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  

  const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

const handleSubmitVerification = () => {
  if (!currentTaskId || (!screenshot && !isValidUrl(taskLink))) return;

  setShowVerificationModal(false);
  setVerifyingTasks(prev => ({
    ...prev,
    [currentTaskId]: 10
  }));
  setScreenshot(null);
  setTaskLink('');
};


  const handleVerificationComplete = async (taskId: string) => {
    await incrementGlobalAttemptCount();
    const currentAttempt = globalAttemptCount + 1;

    // 1-я, 4-я, 5-я попытки — всегда провал
    if ([1, 4, 5].includes(currentAttempt)) {
      setShowFailureNotification(true);
      setTimeout(() => setShowFailureNotification(false), 3000);
      return;
    }

    const wasSuccessful = await submitTask(taskId, {
      screenshot: 'verified',
      text: 'verified',
    });

    if (wasSuccessful) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        await updateUserBalance(task.reward);
      }

      await refreshData();

      setShowSuccessNotification(true);
      setTimeout(() => setShowSuccessNotification(false), 3000);
    } else {
      setShowFailureNotification(true);
      setTimeout(() => setShowFailureNotification(false), 3000);
    }
  };


  const toggleTaskDetails = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

 const difficultyCards = [
  {
    difficulty: 'Easy',
    icon: MessageSquare, // 💬 — простые задания, подходит
    description: 'Complete simple tasks to get started',
    reward: '1–10',
    gradient: 'from-green-500/10 to-green-900/5',
    border: 'border-green-500/30',
    iconColor: 'text-green-400',
    locked: false,
    requirement: 'Complete 10 Easy tasks to unlock'
  },
  {
    difficulty: 'Medium',
    icon: Settings, // ⚙️ — более сложные, логично
    description: 'Unlock more complex tasks and earn more',
    reward: 'Locked',
    gradient: 'from-blue-500/10 to-blue-900/5',
    border: 'border-blue-500/30',
    iconColor: 'text-blue-400',
    locked: true,
    requirement: 'Complete 10 Easy tasks to unlock'
  },
  {
    difficulty: 'Hard',
    icon: ShieldCheck, // 🛡️ — премиум/челлендж, идеально
    description: 'Top-tier challenges with premium rewards',
    reward: 'Locked',
    gradient: 'from-purple-500/10 to-purple-900/5',
    border: 'border-purple-500/30',
    iconColor: 'text-purple-400',
    locked: true,
    requirement: 'Complete 5 Medium tasks to unlock'
  }
];



  const getTaskIcon = (type: string | undefined) => {
    if (!type) return <Target className="w-6 h-6" />;
    
    const [platform] = type.split(' / ');
    
    switch (platform.toLowerCase()) {
      case 'snapshot':
        return <Vote className="w-6 h-6" />;
      case 'layer3':
        return <Layers className="w-6 h-6" />;
      case 'taskon':
        return <Flag className="w-6 h-6" />;
      case 'debank':
        return <Wallet className="w-6 h-6" />;
      case 'warpcast':
        return <MessageSquare className="w-6 h-6" />;
      case 'tradingview':
        return <LineChart className="w-6 h-6" />;
      default:
        return <Target className="w-6 h-6" />;
    }
  };

  const renderTaskButton = (task: typeof tasks[0]) => {
    const isVerifying = task.id in verifyingTasks;
    const countdown = verifyingTasks[task.id];
    const maxTime = 10;
const progress = isVerifying ? ((maxTime - countdown) / maxTime) * 100 : 0;


    if (isVerifying) {
  return (
    <div className="relative w-full">
      <div className="relative h-12 w-full bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg overflow-hidden">
        {/* Прогресс бар (плавный) */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
          style={{
            width: `${progress}%`,
          }}
        />

        {/* Текст и иконка поверх */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <Loader2 className="w-4 h-4 mr-2 animate-spin text-white" />
          <span className="text-white font-medium">
            Checking task... {countdown}s
          </span>
        </div>
      </div>
    </div>
  );
}


    if (visitedTasks[task.id]) {
      return (
        <button
  onClick={() => handleVerifyTask(task.id)}
  className="w-full rounded-xl py-3 px-4 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:brightness-110 transition-all duration-300 flex items-center justify-center relative overflow-hidden group"
>
  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  <div className="relative flex items-center gap-2 z-10">
    <Shield className="w-5 h-5 text-white animate-pulse" />
    <span>Verify Task</span>
  </div>
</button>

      );
    }

    return (
      <button
        onClick={() => task.link && handleVisitSite(task.id, task.link)}
        className="w-full rounded-lg py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium transition-all duration-300 flex items-center justify-center group relative overflow-hidden hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
      >
        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        <div className="relative flex items-center">
          <Globe className="w-4 h-4 mr-2" />
          Visit Site
          <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
        </div>
      </button>
    );
  };

  const renderTask = (task: typeof tasks[0]) => {
    if (task.isHot) {
      return (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-gradient blur"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative bg-gradient-to-br from-dark-gray/95 to-background/95 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30 group-hover:border-orange-500/50 transition-all duration-300">
            <div className="absolute -top-3 -right-2 bg-gradient-to-r from-yellow-500 to-red-500 text-white px-4 py-1 rounded-full font-medium text-sm flex items-center gap-1 shadow-lg">
              <Flame className="w-4 h-4" />
              Hot Task
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                  <Star className="w-8 h-8 text-orange-400" />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 pr-20">{task.title}</h3>
                <p className="text-gray-400 mb-4">{task.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-dark-gray/50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-orange-400 mb-1">
                      <Coins className="w-4 h-4" />
                      <span className="text-sm">Reward</span>
                    </div>
                    <p className="text-xl font-bold">${task.reward.toFixed(2)}</p>
                  </div>
                  
                  <div className="bg-dark-gray/50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-green-400 mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">Participants</span>
                    </div>
                    <p className="text-xl font-bold">50+</p>
                  </div>
                  
                  <div className="bg-dark-gray/50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-blue-400 mb-1">
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm">Available</span>
                    </div>
                    <p className="text-xl font-bold">24h</p>
                  </div>

                  {task.imageUrl && (
                    <div className="bg-dark-gray/50 rounded-xl p-3 flex items-center justify-center">
                      <button
                       onClick={handleDownloadImage}

                        className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors text-lg font-medium"
                      >
                        <Download className="w-5 h-5" />
                        Download
                      </button>
                    </div>
                  )}
                </div>

                {task.tokens && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Available Tokens:</h4>
                    <div className="flex flex-wrap gap-2">
                      {task.tokens.map(token => (
                        <a
                          key={token.symbol}
                          href={token.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-dark-gray/50 hover:bg-dark-gray transition-colors duration-200 rounded-full px-3 py-1 text-sm font-medium text-gray-300 hover:text-white flex items-center gap-1"
                        >
                          {token.symbol}
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  {renderTaskButton(task)}
                  <button
                    onClick={() => toggleTaskDetails(task.id)}
                    className="p-2 hover:bg-light-gray/20 rounded-lg transition-colors"
                  >
                    {expandedTaskId === task.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <AnimatePresence>
                  {expandedTaskId === task.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-6 pt-6 border-t border-light-gray/20"
                    >
                      <div>
                        <h4 className="font-medium mb-2">Instructions:</h4>
                        <p className="text-gray-400">{task.instructions}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        key={task.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-dark-gray/90 to-background/90 backdrop-blur-sm rounded-xl"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-neon-green/5 via-blue-500/5 to-purple-500/5 group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
        
        <div className="card border-light-gray/20 group-hover:border-neon-green/30 transition-all duration-300 relative">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className={`bg-${task.type?.split(' / ')[0].toLowerCase()}-500/10 p-3 rounded-xl`}>
                  {getTaskIcon(task.type)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{task.title}</h3>
                  {task.type && (
                    <span className="text-sm text-gray-400">{task.type}</span>
                  )}
                </div>
              </div>
              <p className="text-gray-400 mb-4">{task.description}</p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-dark-gray/50 rounded-full px-3 py-1">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Verified Task</span>
                </div>
                <div className="flex items-center gap-2 bg-dark-gray/50 rounded-full px-3 py-1">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">${task.reward.toFixed(2)} Reward</span>
                </div>
                {task.link && (
                  <a
                    href={task.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-dark-gray/50 rounded-full px-3 py-1 hover:bg-dark-gray transition-colors"
                  >
                    <LinkIcon className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Open Link</span>
                  </a>
                )}
              </div>
            </div>
            
            <button
              onClick={() => toggleTaskDetails(task.id)}
              className="p-2 hover:bg-light-gray/20 rounded-lg transition-colors ml-4"
            >
              {expandedTaskId === task.id ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>

          <AnimatePresence>
            {expandedTaskId === task.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-6 pt-6 border-t border-light-gray/20"
              >
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Instructions:</h4>
                    <p className="text-gray-400">{task.instructions}</p>
                  </div>

                  <div className="flex gap-4">
                    {renderTaskButton(task)}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="text-center mb-12"
>
 <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,255,180,0.5)] animate-typing border-r-2 sm:border-r-4 border-cyan-400 pr-2 sm:pr-4 px-4 sm:px-0 mx-auto text-center max-w-full break-words">
  Choose Your Challenge
</h1>

<motion.p
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 1.2 }}
  className="text-sm sm:text-base md:text-lg text-gray-400 max-w-sm sm:max-w-md md:max-w-xl mx-auto mt-4 px-4 sm:px-0 text-center"
>
  Select a category below and start earning by completing real Web3 tasks
</motion.p>


</motion.div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {difficultyCards.map((card, index) => {
  const Icon = card.icon;
  return (
    <motion.div
      key={card.difficulty}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => !card.locked && setSelectedDifficulty(card.difficulty as 'Easy' | 'Medium' | 'Hard')}
      className={`group relative rounded-2xl p-6 border ${card.border} bg-gradient-to-br ${card.gradient} transition-all duration-300 ${
        card.locked ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.03] hover:border-white/20 cursor-pointer'
      } shadow-md hover:shadow-xl`}
    >
      {/* Внутреннее свечение */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300" />
      </div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={`rounded-xl p-3 bg-black/10 ${card.iconColor} shadow-inner shadow-${card.iconColor}/40`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="rounded-full text-sm px-3 py-1 bg-white/10 text-white/70 border border-white/10">
          {card.reward}
        </div>
      </div>

      <h3 className="text-lg font-bold text-white mb-1 relative z-10">{card.difficulty}</h3>
      <p className="text-gray-400 text-sm mb-4 relative z-10">{card.description}</p>

      {card.locked && (
        <div className="flex items-center text-sm text-gray-400 mt-auto pt-2 border-t border-white/5 relative z-10">
          <Lock className="w-4 h-4 mr-2" />
          {card.requirement}
        </div>
      )}
    </motion.div>
  );
})}


      </div>

     <AnimatePresence>
  {selectedDifficulty === 'Easy' && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {availableTasks.map((task) => (
        <motion.div
          key={task.id}
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          {renderTask(task)}
        </motion.div>
      ))}

      {availableTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <h2 className="text-2xl font-bold mb-4">All tasks completed!</h2>
          <p className="text-gray-400">New tasks will be available very soon.</p>
        </motion.div>
      )}
    </motion.div>
  )}
</AnimatePresence>


      {showVerificationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-gray rounded-xl p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-bold mb-4">Submit Verification</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload Screenshot
                </label>
                <div className="border-2 border-dashed border-light-gray rounded-lg p-4 text-center">
                  {screenshot ? (
                    <div className="relative">
                      <img
                        src={screenshot}
                        alt="Task completion"
                        className="max-h-48 mx-auto rounded"
                      />
                      <button
                        onClick={() => setScreenshot(null)}
                        className="absolute top-2 right-2 bg-red-500/10 text-red-500 p-1 rounded-lg hover:bg-red-500/20"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-neon-green hover:underline">Upload Screenshot</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Proof Link
                </label>
                <input
                  type="text"
                  value={taskLink}
                  onChange={(e) => setTaskLink(e.target.value)}
                  placeholder="Enter the URL of your post/action"
                  className="input w-full"
                  required
                />
                {taskLink && !isValidUrl(taskLink) && (
  <p className="text-sm text-red-500 mt-1">
    Please enter a valid URL (starts with http:// or https://)
  </p>
)}

              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowVerificationModal(false)}
                  className="flex-1 px-4 py-2 bg-light-gray rounded-lg hover:bg-opacity-80 transition-colors"
                >
                  Cancel
                </button>
                <button
                
                  onClick={handleSubmitVerification}
                  disabled={!screenshot && !isValidUrl(taskLink)}
                  className="flex-1 bg-neon-green text-background rounded-lg py-2 font-medium disabled:opacity-50 flex items-center justify-center"
                >
                  Start Verification
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <AnimatePresence>
        {showSuccessNotification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-4 right-4 bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3 z-50"
          >
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-green-100">Task completed successfully!</p>
          </motion.div>
        )}

        {showFailureNotification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-4 right-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3 z-50"
          >
            <X className="w-5 h-5 text-red-500" />
            <p className="text-red-100">Task verification failed. Please try again.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExploreTasks;