import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Wallet, 
  Star,
  Flame,
  Sparkles,
  DollarSign,
  ExternalLink,
  Store,
  Users2,
  Network,
  Rocket,
  Trophy,
  Zap,
  MessageCircle,
  Code,
  Twitter,
  ArrowRight,
  Clock,
  Shield,
  Target,
  Send,
  Instagram,
  CheckCircle,
  X,
  Loader2,
  PartyPopper,
  AlertCircle,
  Hourglass,
  Smartphone,
  Coins,
  Building2,
  GraduationCap,
  Gamepad2,
  CircleDollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';

const Dashboard = () => {
  const { user, updateUserBalance, setUserAsCongratulated, loading, refreshUser } = useAuth();
  const { 
    submitTask, 
    isVerifying, 
    verificationCountdown, 
    completedTasks,
    updateCompletedTasks,
    completedFirstClick,
    updateCompletedFirstClick,
    refreshData
  } = useTasks();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
  console.log("USER DATA:", user);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

useEffect(() => {
  const failHandler = () => setShowFirstAttemptFailModal(true);
  window.addEventListener('task-verification-failed', failHandler);
  return () => window.removeEventListener('task-verification-failed', failHandler);
}, []);


  const [showMinBalanceModal, setShowMinBalanceModal] = useState(false);
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [showFirstAttemptFailModal, setShowFirstAttemptFailModal] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<'telegram' | 'instagram' | 'survey' | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [username, setUsername] = useState('');
  const [currentSurveyStep, setCurrentSurveyStep] = useState(0);
  const [surveyAnswers, setSurveyAnswers] = useState<string[]>([]);
  const [showFailureNotification, setShowFailureNotification] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [verifyingTasks, setVerifyingTasks] = useState<Record<string, number>>({});

  const handleVerificationComplete = async (taskId: string) => {
    console.log('handleVerificationComplete called for:', taskId);
    console.log('completedFirstClick:', completedFirstClick);
    
    const failedKey = `${taskId}_failed`;
    const alreadyFailed = completedFirstClick[failedKey] || false;
    
    console.log('alreadyFailed:', alreadyFailed);
    
    if (!alreadyFailed) {
      // Первая попытка - всегда провал (фейк проверка)
      console.log('First attempt - showing failure modal');
      await updateCompletedFirstClick(failedKey, true);
      setShowFirstAttemptFailModal(true);
      return;
    }
    
    // Вторая попытка - успех
    console.log('Second attempt - completing task');
    try {
      console.log('Calling submitTask with:', { taskId, data: { text: 'verified', screenshot: 'verified' } });
      const wasSuccessful = await submitTask(taskId, { 
        text: 'verified',
        screenshot: 'verified' 
      });
      
      console.log('submitTask result:', wasSuccessful);
      
      if (wasSuccessful) {
        console.log('Task successful, updating completed tasks');
        await updateCompletedTasks(taskId, true);
        
        // Обновляем счетчик выполненных заданий
        const newCount = (user?.tasksCompleted || 0) + 1;
        console.log('Updating tasks completed to:', newCount);
        // await updateTasksCompleted(newCount); // Это должно происходить в TaskContext
        
        await refreshData();
        
        console.log('Showing success notification');
        setShowSuccessNotification(true);
        setTimeout(() => setShowSuccessNotification(false), 3000);
      } else {
        console.log('Task submission failed');
        setShowFailureNotification(true);
        setTimeout(() => setShowFailureNotification(false), 3000);
      }
    } catch (error) {
      console.error('Error in handleVerificationComplete:', error);
      setShowFailureNotification(true);
      setTimeout(() => setShowFailureNotification(false), 3000);
    }
  };

  // Timer effect for dashboard tasks
  useEffect(() => {
    console.log('Timer effect triggered, verifyingTasks:', verifyingTasks);
    const intervals: NodeJS.Timeout[] = [];

    Object.entries(verifyingTasks).forEach(([taskId, countdown]) => {
      if (countdown > 0) {
        console.log(`Setting interval for ${taskId}, countdown: ${countdown}`);
        const interval = setInterval(() => {
          setVerifyingTasks(prev => {
            const newCountdown = prev[taskId] - 1;
            console.log(`${taskId} countdown: ${newCountdown}`);
            if (newCountdown <= 0) {
              console.log(`Timer finished for ${taskId}, calling handleVerificationComplete`);
              const updated = { ...prev };
              delete updated[taskId];
              // Вызываем проверку когда таймер заканчивается
              setTimeout(() => handleVerificationComplete(taskId), 100);
              return updated;
            }
            return {
              ...prev,
              [taskId]: newCountdown
            };
          });
        }, 1000);
        intervals.push(interval);
      }
    });

    return () => intervals.forEach(clearInterval);
  }, [verifyingTasks, completedFirstClick, user?.tasksCompleted]);

  const { scrollYProgress } = useScroll();

  const surveyQuestions = [
    {
      question: "How did you hear about Sonavo?",
      options: ["Social Media", "Friend", "Search", "Other"]
    },
    {
      question: "What interests you most about Web3?",
      options: ["Earning Opportunities", "Technology", "Community", "Innovation"]
    },
    {
      question: "How experienced are you with crypto?",
      options: ["Beginner", "Intermediate", "Advanced", "Expert"]
    },
    {
      question: "What type of tasks interest you most?",
      options: ["Social", "Technical", "Creative", "Educational"]
    },
    {
      question: "How much time can you dedicate weekly?",
      options: ["1-2 hours", "3-5 hours", "5-10 hours", "10+ hours"]
    }
  ];

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Check if all 3 dashboard tasks are completed
  const hasAllDashboardTasksCompleted = completedTasks.telegram && completedTasks.instagram && completedTasks.survey;

  // Check for reward eligibility when completed tasks change
  useEffect(() => {
    if (hasAllDashboardTasksCompleted && !user?.congratulated && !user?.hasGivenReward) {
      checkAndRewardIfEligible();
    }
  }, [hasAllDashboardTasksCompleted, user?.congratulated, user?.hasGivenReward]);

  const handleTaskClick = async (task: 'telegram' | 'instagram' | 'survey') => {
  if (isVerifying) return;

  // СБРОС username перед открытием нового задания
  setUsername('');

  if (task === 'survey') {
    setCurrentSurveyStep(0);
    setSurveyAnswers([]);
    setShowSurveyModal(true);
    return;
  }

  if (!completedFirstClick[task]) {
    await updateCompletedFirstClick(task, true);
    
    if (task === 'telegram') {
      window.open('https://t.me/+atUr8L_y6nJhMWVi', '_blank');
    } else if (task === 'instagram') {
      window.open('https://www.instagram.com/sonavo.web3?igsh=MzhpOTdrOHZ1YmRp/', '_blank');
    }
  } else {
    setCurrentTask(task);
    setShowUsernameModal(true);
  }
};

 const checkAndRewardIfEligible = async () => {
  if (hasAllDashboardTasksCompleted && !user?.congratulated && !user?.hasGivenReward) {
    await updateUserBalance(10);
    await setUserAsCongratulated();

    setShowCongratsModal(true);
  }
};




 const handleUsernameSubmit = async () => {
    console.log('handleUsernameSubmit called for:', currentTask, 'username:', username);
    if (!currentTask || !username.trim()) return;

    setShowUsernameModal(false);
    
    // Запускаем таймер проверки
    console.log('Starting timer for:', currentTask);
    setVerifyingTasks(prev => ({
      ...prev,
      [currentTask]: 10
    }));

    setUsername('');
    setCurrentTask(null);
  };

  const handleSurveyAnswer = async (answer: string) => {
    const newAnswers = [...surveyAnswers, answer];
    setSurveyAnswers(newAnswers);
    
    if (currentSurveyStep < surveyQuestions.length - 1) {
      setCurrentSurveyStep(prev => prev + 1);
    } else {
      await updateCompletedTasks('survey', true);
      await refreshData();

      setShowSurveyModal(false);
      await refreshData();
    }
  };

  const handleWithdrawClick = () => {
  if (user?.balance < 30) {
    setShowMinBalanceModal(true);
    return;
  }

  // Здесь позже можно добавить подключение кошелька
  setShowWithdrawModal(true);
};


  const renderTaskButton = (task: 'telegram' | 'instagram' | 'survey') => {
    const isVerifying = task in verifyingTasks;
    const countdown = verifyingTasks[task];
    const maxTime = 10;
    const progress = isVerifying ? ((maxTime - countdown) / maxTime) * 100 : 0;

    if (completedTasks[task]) {
      return (
        <div className="w-full rounded-lg py-2 px-4 bg-green-500/10 text-green-400 flex items-center justify-center">
          <CheckCircle className="w-4 h-4 mr-2" />
          <span className="font-medium">Completed</span>
        </div>
      );
    }

    if (isVerifying) {
      return (
        <div className="relative w-full">
          <div className="relative h-12 w-full bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
              style={{
                width: `${progress}%`,
              }}
            />
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

    const gradients = {
      telegram: 'from-blue-500 via-blue-400 to-blue-600',
      instagram: 'from-purple-500 via-pink-500 to-orange-500',
      survey: 'from-green-500 via-emerald-400 to-teal-500'
    };

    const baseColors = {
      telegram: 'text-blue-400',
      instagram: 'text-purple-400',
      survey: 'text-green-400'
    };

    return (
      <button
        onClick={() => handleTaskClick(task)}
        disabled={isVerifying}
        className={`w-full rounded-lg py-2 px-4 flex items-center justify-center font-medium transition-all duration-300 ${
          completedFirstClick[task]
            ? `bg-gradient-to-r ${gradients[task]} bg-opacity-10 hover:bg-opacity-20 relative overflow-hidden group`
            : `bg-${task}-500/10 hover:bg-${task}-500/20 ${baseColors[task]}`
        } ${isVerifying ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {completedFirstClick[task] ? (
          <>
            <span className="relative z-10 flex items-center">
              Verify Completion 
              <CheckCircle className="w-4 h-4 ml-2" />
            </span>
            <div className={`absolute inset-0 bg-gradient-to-r ${gradients[task]} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
          </>
        ) : (
          <>
            {task === 'telegram' && 'Join Telegram'}
            {task === 'instagram' && 'Go to Instagram'}
            {task === 'survey' && 'Start Survey'}
            <ExternalLink className="w-4 h-4 ml-2" />
          </>
        )}
      </button>
    );
  };


  return (
    <div className="relative min-h-screen">
      <motion.div 
        className="fixed inset-0 pointer-events-none"
        style={{ opacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-neon-green/5 via-transparent to-transparent" />
        <motion.div 
          className="absolute inset-0 bg-[url('https://images.pexels.com/photos/7130555/pexels-photo-7130555.jpeg')] bg-cover bg-center opacity-5"
          style={{ y: backgroundY }}
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 w-full overflow-hidden">

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-12 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                Welcome to <span className="text-neon-green">Sonavo</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-400 text-lg"
              >
                Your gateway to Web3 earnings
              </motion.p>
            </div>
            
            <div className="flex items-center gap-4">
              {hasAllDashboardTasksCompleted && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleWithdrawClick}
                  className="flex items-center gap-2 bg-gradient-to-r from-neon-green to-green-400 text-background px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-neon-green/20 transition-all duration-300"
                >
                  <Wallet className="w-5 h-5" />
                  Withdraw
                </motion.button>
              )}
              
              <motion.div 
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 0.4 }}
  className="flex items-center gap-3 bg-gradient-to-r from-[#00ffb2]/10 to-[#00ffb2]/5 rounded-full px-6 py-3 border border-[#00ffb2]/20 shadow-md"
>
  <Shield className="h-5 w-5 text-neon-green" />
  <span className="text-base font-semibold text-white">Level {user?.level}</span>
</motion.div>

            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12"
        >
          <div className="relative overflow-hidden rounded-2xl bg-[#1A2421] p-6 border border-[#2A3A35] group hover:border-[#00FFB2]/30 transition-all duration-300">
            <div className="absolute -right-8 -top-8 h-32 w-32 bg-[#00FFB2]/5 rounded-full blur-2xl group-hover:bg-[#00FFB2]/10 transition-all duration-300"></div>
            <div className="flex items-center gap-4">
              <div className="bg-[#00FFB2]/10 rounded-xl p-3">
                <CheckCircle className="h-6 w-6 text-[#00FFB2]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Tasks Completed</p>
                <p className="text-2xl font-bold">{user?.tasksCompleted ?? 0}</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-[#1A1F35] p-6 border border-[#2A3A55] group hover:border-[#3B82F6]/30 transition-all duration-300">
            <div className="absolute -right-8 -top-8 h-32 w-32 bg-[#3B82F6]/5 rounded-full blur-2xl group-hover:bg-[#3B82F6]/10 transition-all duration-300"></div>
            <div className="flex items-center gap-4">
              <div className="bg-[#3B82F6]/10 rounded-xl p-3">
                <Wallet className="h-6 w-6 text-[#3B82F6]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Current Balance</p>
                <p className="text-2xl font-bold">${user?.balance?.toFixed(2) ?? "0.00"}</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-[#2A1A35] p-6 border border-[#3A2A55] group hover:border-[#8B5CF6]/30 transition-all duration-300">
            <div className="absolute -right-8 -top-8 h-32 w-32 bg-[#8B5CF6]/5 rounded-full blur-2xl group-hover:bg-[#8B5CF6]/10 transition-all duration-300"></div>
            <div className="flex items-center gap-4">
              <div className="bg-[#8B5CF6]/10 rounded-xl p-3">
                <CircleDollarSign className="h-6 w-6 text-[#8B5CF6]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Earned</p>
                <p className="text-2xl font-bold">${user?.totalEarned?.toFixed(2) ?? "0.00"}</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-[#351A1A] p-6 border border-[#552A2A] group hover:border-[#F6745C]/30 transition-all duration-300">
            <div className="absolute -right-8 -top-8 h-32 w-32 bg-[#F6745C]/5 rounded-full blur-2xl group-hover:bg-[#F6745C]/10 transition-all duration-300"></div>
            <div className="flex items-center gap-4">
              <div className="bg-[#F6745C]/10 rounded-xl p-3">
                <Users className="h-6 w-6 text-[#F6745C]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Referral Earnings</p>
                <p className="text-2xl font-bold">$0.00</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Earn Your First $10</h2>
              <p className="text-gray-400 mt-1">Complete these 3 simple tasks below and get your first reward. It takes less than 5 minutes.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative group overflow-hidden">
              <div className="card bg-gradient-to-br from-blue-900/20 to-dark-gray border-blue-800/50 hover:border-blue-500/50 min-h-[240px]">
                <div className="absolute -right-8 -top-8 h-32 w-32 bg-gradient-to-br from-blue-500/20 to-transparent blur-2xl group-hover:animate-pulse"></div>
                <div className="relative h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
  <div className="flex items-center gap-3">
    <div className="bg-blue-900/30 rounded-xl p-2">
      <MessageCircle className="h-5 w-5 text-blue-400" />
    </div>
    <span className="text-blue-400 font-medium">Step 1</span>
  </div>

                    <a
  href="https://t.me/+atUr8L_y6nJhMWVi"
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-400 hover:underline"
>
  <ExternalLink className="w-5 h-5" />
</a>
                  </div>

                  <h3 className="font-bold text-lg mb-2">Join Our Telegram</h3>
                  <p className="text-gray-400 text-sm mb-4">Join the Sonavo community on Telegram to stay updated.</p>
                  
                  <div className="mt-auto">
                    {renderTaskButton('telegram')}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group overflow-hidden">
              <div className="card bg-gradient-to-br from-purple-900/20 to-dark-gray border-purple-800/50 hover:border-purple-500/50 min-h-[240px]">
                <div className="absolute -right-8 -top-8 h-32 w-32 bg-gradient-to-br from-purple-500/20 to-transparent blur-2xl group-hover:animate-pulse"></div>
                <div className="relative h-full flex flex-col">
  <a
    href="https://www.instagram.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="absolute top-3 right-3 text-purple-400 hover:text-purple-300 transition-colors"
  >
    <ExternalLink className="w-5 h-5" />
  </a>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-purple-900/30 rounded-xl p-2">
                      <Instagram className="h-5 w-5 text-purple-400" />
                    </div>
                    <span className="text-purple-400 font-medium">Step 2</span>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2">Follow Us on Instagram</h3>
                  <p className="text-gray-400 text-sm mb-4">Follow us on Instagram for updates, highlights, and tips.</p>
                  
                  <div className="mt-auto">
                    {renderTaskButton('instagram')}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group overflow-hidden">
              <div className="card bg-gradient-to-br from-green-900/20 to-dark-gray border-green-800/50 hover:border-green-500/50 min-h-[240px]">
                <div className="absolute -right-8 -top-8 h-32 w-32 bg-gradient-to-br from-green-500/20 to-transparent blur-2xl group-hover:animate-pulse"></div>
                <div className="relative h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-900/30 rounded-xl p-2">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <span className="text-green-400 font-medium">Step 3</span>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2">Answer 5 Quick Questions</h3>
                  <p className="text-gray-400 text-sm mb-4">Help us understand you better. Answer a few questions.</p>
                  
                  <div className="mt-auto">
                    {renderTaskButton('survey')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 shadow-lg"
            >
              Start Earning
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 mb-24"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#009dff]/5 via-[#2d6bff]/5 to-[#6600ff]/5 rounded-2xl blur-xl"></div>
            
            <div className="relative p-0">
              <div className="flex items-center gap-3 mb-8">
                <Rocket className="h-6 w-6 text-[#009dff]" />
                <h2 className="text-2xl font-bold text-white">
                  Coming Soon
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Leaderboard */}
  <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-900/20 to-[#111827] p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
    <div className="absolute -right-8 -top-8 h-32 w-32 bg-gradient-to-br from-purple-500/20 to-transparent blur-2xl group-hover:animate-pulse"></div>
    <div className="flex justify-center">
      <Trophy className="h-8 w-8 text-purple-400 mb-4 transform transition-transform duration-300 group-hover:scale-110" />
    </div>
    <h3 className="text-lg font-bold mb-2">Leaderboard & Weekly Prizes</h3>
    <p className="text-sm text-gray-400">Compete with other users and win exclusive rewards every week.</p>
  </div>

  {/* Mobile App */}
  <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-900/20 to-[#111827] p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
    <div className="absolute -right-8 -top-8 h-32 w-32 bg-gradient-to-br from-blue-500/20 to-transparent blur-2xl group-hover:animate-pulse"></div>
    <div className="flex justify-center">
      <Smartphone className="h-8 w-8 text-blue-400 mb-4 transform transition-transform duration-300 group-hover:scale-110" />
    </div>
    <h3 className="text-lg font-bold mb-2">Mobile App</h3>
    <p className="text-sm text-gray-400">Complete tasks and track earnings on the go with our mobile app.</p>
  </div>

  {/* Solana Token */}
  <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-900/20 to-[#111827] p-6 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
    <div className="absolute -right-8 -top-8 h-32 w-32 bg-gradient-to-br from-orange-500/20 to-transparent blur-2xl group-hover:animate-pulse"></div>
    <div className="flex justify-center">
      <Coins className="h-8 w-8 text-orange-400 mb-4 transform transition-transform duration-300 group-hover:scale-110" />
    </div>
    <h3 className="text-lg font-bold mb-2">Solana Token</h3>
    <p className="text-sm text-gray-400">Native token on Solana for rewards, governance, and exclusive features.</p>
  </div>

  {/* Employer Dashboard */}
  <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-900/20 to-[#111827] p-6 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300">
    <div className="absolute -right-8 -top-8 h-32 w-32 bg-gradient-to-br from-emerald-500/20 to-transparent blur-2xl group-hover:animate-pulse"></div>
    <div className="flex justify-center">
      <Building2 className="h-8 w-8 text-emerald-400 mb-4 transform transition-transform duration-300 group-hover:scale-110" />
    </div>
    <h3 className="text-lg font-bold mb-2">Employer Dashboard</h3>
    <p className="text-sm text-gray-400">Post tasks, manage submissions, and find top talent in Web3.</p>
  </div>

  {/* Learn & Earn Quests */}
  <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-yellow-900/20 to-[#111827] p-6 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
    <div className="absolute -right-8 -top-8 h-32 w-32 bg-gradient-to-br from-yellow-500/20 to-transparent blur-2xl group-hover:animate-pulse"></div>
    <div className="flex justify-center">
      <GraduationCap className="h-8 w-8 text-yellow-400 mb-4 transform transition-transform duration-300 group-hover:scale-110" />
    </div>
    <h3 className="text-lg font-bold mb-2">Learn & Earn Quests</h3>
    <p className="text-sm text-gray-400">Master Web3 skills while earning rewards through interactive courses.</p>
  </div>

  {/* Play & Earn Games */}
  <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-pink-900/20 to-[#111827] p-6 border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300">
    <div className="absolute -right-8 -top-8 h-32 w-32 bg-gradient-to-br from-pink-500/20 to-transparent blur-2xl group-hover:animate-pulse"></div>
    <div className="flex justify-center">
      <Gamepad2 className="h-8 w-8 text-pink-400 mb-4 transform transition-transform duration-300 group-hover:scale-110" />
    </div>
    <h3 className="text-lg font-bold mb-2">Play & Earn Games</h3>
    <p className="text-sm text-gray-400">Earn tokens while playing exciting Web3 games and challenges.</p>
  </div>
</div>
              
              <div className="mt-8 text-center">
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#009dff] to-[#6600ff] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-300"
                >
                  Explore Available Tasks
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {showSurveyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-gray rounded-xl p-8 max-w-md w-full mx-4 relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-700 rounded-t-xl overflow-hidden">
              <div 
                className="h-full bg-neon-green transition-all duration-300"
                style={{ width: `${((currentSurveyStep + 1) / surveyQuestions.length) * 100}%` }}
              ></div>
            </div>

            <button 
              onClick={() => setShowSurveyModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-8 text-center">
              <h3 className="text-xl font-bold mb-2">Question {currentSurveyStep + 1} of {surveyQuestions.length}</h3>
              <p className="text-gray-300">{surveyQuestions[currentSurveyStep].question}</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {surveyQuestions[currentSurveyStep].options.map((option, index) => (
                <motion.button
                  key={option}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSurveyAnswer(option)}
                  className="w-full p-4 rounded-lg bg-medium-gray hover:bg-light-gray border border-light-gray transition-all duration-200 text-left relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">{option}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {showUsernameModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-gray rounded-xl p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-bold mb-4">
              Enter your {currentTask === 'telegram' ? 'Telegram' : 'Instagram'} username
            </h3>
            
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={`@${currentTask === 'telegram' ? 'telegram' : 'instagram'}_username`}
              className="input w-full mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowUsernameModal(false);
                  setUsername('');
                }}
                className="flex-1 px-4 py-2 bg-light-gray rounded-lg hover:bg-opacity-80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUsernameSubmit}
                disabled={!username.trim()}
                className="flex-1 bg-neon-green text-background rounded-lg py-2 font-medium disabled:opacity-50"
              >
                Verify
              </button>
            </div>
          </motion.div>
        </div>
      )}

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

      {showMinBalanceModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  className="bg-dark-gray text-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl border border-gray-700 text-center flex flex-col items-center"
>

      <div className="flex items-center gap-3 mb-4">
        <AlertCircle className="w-6 h-6 text-yellow-400" />
        <h3 className="text-lg font-semibold">Minimum Withdrawal</h3>
      </div>
      <p className="text-gray-300 mb-6">
        The minimum amount required for withdrawal is <span className="text-yellow-400 font-semibold">$30.</span>
      </p>
      <button
        onClick={() => setShowMinBalanceModal(false)}
        className="w-full py-2 px-4 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-semibold transition-all duration-200"
      >
        Got it!
      </button>
    </motion.div>
  </div>
)}

{showFirstAttemptFailModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-[#1c1c1c] text-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl border border-red-500/20"
    >
      <div className="flex items-center gap-3 mb-4">
        <AlertCircle className="w-6 h-6 text-red-400" />
        <h3 className="text-lg font-semibold">Verification Failed</h3>
      </div>
      <p className="text-gray-300 mb-6">
        You haven't completed the task yet. Please complete it and try again.
      </p>
      <button
        onClick={() => setShowFirstAttemptFailModal(false)}
        className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-black rounded-lg font-semibold transition-all duration-200"
      >
        Try Again
      </button>
    </motion.div>
  </div>
)}


{showCongratsModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-dark-gray text-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl border border-green-500/30"
    >
      <div className="flex items-center gap-3 mb-4">
        <PartyPopper className="w-6 h-6 text-green-400" />
        <h3 className="text-lg font-semibold">Congratulations!</h3>
      </div>
      <p className="text-gray-300 mb-6">
        You've completed your first 3 tasks and earned <span className="text-green-400 font-semibold">$10</span>!
      </p>
      <button
        onClick={() => setShowCongratsModal(false)}
        className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-black rounded-lg font-semibold transition-all duration-200"
      >
        Awesome!
      </button>
    </motion.div>
  </div>
)}
    </div>
  );
};

export default Dashboard;