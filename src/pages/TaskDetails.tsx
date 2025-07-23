import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ExternalLink,
  Info,
  Check,
  Upload,
  Loader2,
  Lock,
  Clock
} from 'lucide-react';
import { useTasks } from '../contexts/TaskContext';
import { useAuth } from '../contexts/AuthContext';
import { TaskStatus } from '../types';

const TaskDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTaskById, getUserTaskSubmission, submitTask } = useTasks();
  const { isConnected } = useAuth();

  const task = getTaskById(id || '');
  const submission = getUserTaskSubmission(id || '');

  const [screenshot, setScreenshot] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(20);

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

  const handleVerifyClick = () => {
    setIsVerifying(true);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsVerifying(false);
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            navigate('/my-tasks');
          }, 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !isConnected) return;

    try {
      setIsSubmitting(true);
      await submitTask(task.id, { screenshot, text });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/my-tasks');
      }, 3000);
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!task) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Task Not Found</h1>
        <button onClick={() => navigate('/explore')} className="btn btn-outline">
          Back to Tasks
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
      </div>

      <div className="card mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{task.title}</h1>
            <p className="text-gray-400">{task.description}</p>
          </div>
          <span className={`badge ${
            task.difficulty === 'Easy' ? 'badge-easy' :
            task.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard'
          }`}>
            {task.difficulty}
          </span>
        </div>

        {task.imageUrl && (
          <div className="mb-6 rounded-lg overflow-hidden">
            <img
              src={task.imageUrl}
              alt={task.title}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Info className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-gray-400">Reward:</span>
            <span className="text-neon-green font-bold ml-2">
              ${task.reward.toFixed(2)}
            </span>
          </div>

          {task.link && (
            <a
              href={task.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-neon-green hover:underline"
            >
              Visit Website
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          )}
        </div>
      </div>

      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-4">Instructions</h2>
        <p className="text-gray-300 whitespace-pre-wrap mb-6">
          {task.instructions}
        </p>

        {submission ? (
          <div>
            <div className="flex items-center mb-4">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                submission.status === 'Approved' ? 'bg-green-500' :
                submission.status === 'Rejected' ? 'bg-red-500' :
                'bg-yellow-500'
              }`} />
              <span className="font-medium">Status: {submission.status}</span>
            </div>

            {submission.status === 'Pending' && (
              <p className="text-gray-400">
                Your submission is being reviewed. We'll notify you once it's approved.
              </p>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Screenshot
              </label>
              <div className="border-2 border-dashed border-light-gray rounded-lg p-6 text-center">
                {screenshot ? (
                  <div className="relative">
                    <img
                      src={screenshot}
                      alt="Task completion"
                      className="max-h-64 mx-auto rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setScreenshot('')}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <label className="cursor-pointer">
                      <span className="text-neon-green hover:underline">
                        Upload a screenshot
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleScreenshotChange}
                      />
                    </label>
                    <p className="text-sm text-gray-400 mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Additional Information
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="input w-full h-32"
                placeholder="Add any relevant details about your task completion..."
              />
            </div>

            {isVerifying ? (
              <div className="relative">
                <button
                  type="button"
                  disabled
                  className="btn btn-primary w-full flex items-center justify-center relative overflow-hidden"
                >
                  <div 
                    className="absolute left-0 top-0 h-full bg-white/10"
                    style={{ 
                      width: `${((20 - countdown) / 20) * 100}%`,
                      transition: 'width 1s linear'
                    }}
                  />
                  <div className="relative flex items-center">
                    <Clock className="w-5 h-5 mr-2 animate-pulse" />
                    Verifying... {countdown}s
                  </div>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleVerifyClick}
                className="btn btn-primary w-full flex justify-center items-center"
              >
                Verify Task
              </button>
            )}
          </form>
        )}
      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-dark-gray rounded-xl p-6 flex items-center"
          >
            <Check className="w-6 h-6 text-green-500 mr-3" />
            <span>Task submitted successfully!</span>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;