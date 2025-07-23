import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Check } from 'lucide-react';
import { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-light-gray last:border-b-0">
      <button
        className="w-full flex justify-between items-center py-4 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">{question}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-neon-green" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      
      {isOpen && (
        <div className="pb-4 text-gray-300">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const Help = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setFormData({ email: '', subject: '', message: '' });
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const faqs = [
    {
      question: "What is Sonavo?",
      answer: "Sonavo is a Web3 task-based earning platform where users can earn real money by completing crypto-related tasks. Users can earn by completing verified tasks from our partners."
    },
    {
      question: "How do I get started?",
      answer: "To get started, browse available tasks in the Explore section, complete tasks according to instructions, and submit proof. Once approved, rewards will be added to your balance."
    },
    {
      question: "When can I withdraw my earnings?",
      answer: "On Level 1, you are eligible to request a payout once your balance reaches a minimum of $30. After reaching the threshold, connect your wallet to receive your funds. Starting from Level 2, the minimum payout amount is reduced to just $1, allowing faster and more flexible withdrawals."
    },
    {
      question: "Why are some tasks locked?",
      answer: "Medium and Hard difficulty tasks require you to complete a certain number of Easy tasks first. This ensures users have the necessary experience before tackling more complex tasks."
    },
    {
      question: "How does the referral system work?",
      answer: "Referral rewards become available starting from Level 2. Share your unique referral link with friends — when they join and complete tasks, you'll earn 5% of their earnings as a bonus. They still receive 100% of their rewards."
    },
    {
      question: "How long does task approval take?",
      answer: "Task approvals typically take 30 seconds. Once approved, rewards are automatically added to your balance."
    },
  ];
  
  return (
    <div className="max-w-4xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-bold mb-8"
      >
        Help Center
      </motion.h1>
      
      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-12"
      >
        <div className="flex items-center mb-6">
          <HelpCircle className="w-5 h-5 text-neon-green mr-2" />
          <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
        </div>
        
        <div className="card">
          {faqs.map((faq, index) => (
            <FAQItem 
              key={index} 
              question={faq.question} 
              answer={faq.answer} 
            />
          ))}
        </div>
      </motion.div>
      
      {/* Contact Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center mb-6">
          <MessageCircle className="w-5 h-5 text-neon-green mr-2" />
          <h2 className="text-xl font-bold">Contact Support</h2>
        </div>
        
        <div className="card">
          <p className="text-gray-300 mb-6">
            Can't find the answer you're looking for? Reach out to our support team.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input w-full"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="input w-full"
                placeholder="What's your question about?"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="input w-full"
                placeholder="Describe your issue in detail..."
                required
              ></textarea>
            </div>
            
            <button type="submit" className="btn btn-primary w-full">
              Send Message
            </button>
          </form>
        </div>
      </motion.div>

      {/* Success Message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-4 right-4 bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3 z-50"
        >
          <Check className="w-5 h-5 text-green-500" />
          <p className="text-green-100">Message sent successfully!</p>
        </motion.div>
      )}
    </div>
  );
};

export default Help;