import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle, DollarSign, Target, Clock, Shield, Users, Link as LinkIcon } from 'lucide-react';

const PublishTask = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward: '',
    email: '',
    telegram: '',
    website: '',
    instructions: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          title: '',
          description: '',
          reward: '',
          email: '',
          telegram: '',
          website: '',
          instructions: ''
        });
      }, 5000);
    }, 1500);
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Publish a Task</h1>
        <p className="text-xl text-gray-400">Create engaging tasks for the Sonavo community</p>
      </motion.div>

      {submitted ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative overflow-hidden rounded-2xl"
        >
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-neon-green/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          </div>
          
          <div className="relative bg-gradient-to-br from-dark-gray to-background p-12 rounded-2xl text-center border border-neon-green/20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-20 h-20 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-neon-green" />
            </motion.div>
            
            <h2 className="text-3xl font-bold mb-4">Task Submitted!</h2>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">
              Thank you for submitting your task. Our team will review it and get back to you shortly.
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card bg-gradient-to-br from-dark-gray to-background border-light-gray/50"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input w-full"
                    placeholder="e.g., Complete Layer3 Quest"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="input w-full"
                    placeholder="Brief description of what users need to do"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Reward Amount ($)
                    </label>
                    <input
                      type="number"
                      name="reward"
                      value={formData.reward}
                      onChange={handleChange}
                      className="input w-full"
                      placeholder="e.g., 5.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Website Link
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="input w-full"
                      placeholder="https://"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Task Instructions
                  </label>
                  <textarea
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    rows={4}
                    className="input w-full"
                    placeholder="Detailed step-by-step instructions for completing the task"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input w-full"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Telegram Username
                    </label>
                    <input
                      type="text"
                      name="telegram"
                      value={formData.telegram}
                      onChange={handleChange}
                      className="input w-full"
                      placeholder="@username"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-neon-green to-[#00E5FF] text-background rounded-xl py-4 font-semibold flex items-center justify-center relative overflow-hidden group hover:shadow-[0_0_20px_rgba(0,255,178,0.3)] transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/10"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Publish Task
                      </>
                    )}
                  </div>
                </button>
              </form>
            </motion.div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card bg-gradient-to-br from-purple-900/20 to-dark-gray border-purple-800/30"
            >
              <h3 className="text-lg font-bold mb-4">Why Publish on Sonavo?</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-purple-900/30 rounded-lg p-2 mr-3">
                    <Target className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Reach Active Users</h4>
                    <p className="text-sm text-gray-400">Connect with engaged Web3 enthusiasts ready to complete tasks</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-900/30 rounded-lg p-2 mr-3">
                    <Shield className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Verified Submissions</h4>
                    <p className="text-sm text-gray-400">All task completions are manually verified for quality</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-900/30 rounded-lg p-2 mr-3">
                    <Clock className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Quick Turnaround</h4>
                    <p className="text-sm text-gray-400">Tasks are typically completed within 24-48 hours</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card bg-gradient-to-br from-blue-900/20 to-dark-gray border-blue-800/30"
            >
              <h3 className="text-lg font-bold mb-4">Task Requirements</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-green mr-2"></div>
                  Clear, actionable instructions
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-green mr-2"></div>
                  Reasonable completion time
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-green mr-2"></div>
                  Fair reward amount
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-green mr-2"></div>
                  Verifiable completion criteria
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublishTask;