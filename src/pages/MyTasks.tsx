import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react';
import { useTasks } from '../contexts/TaskContext';
import { useAuth } from '../contexts/AuthContext';
import { TaskStatus } from '../types';

const MyTasksPage: React.FC = () => {
  const { tasks, userSubmissions } = useTasks();
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading tasks...</p>
        </div>
      </div>
    );
  }

  const myTasks = userSubmissions
    .map(submission => {
      const task = tasks.find(t => t.id === submission.taskId);
      return {
        ...submission,
        task,
      };
    })
    .filter(item =>
      item.status === 'Approved' &&
      item.taskId !== 'telegram' &&
      item.taskId !== 'instagram'
    );




  
  // Helper function to render status icon and color
  const getStatusInfo = (status: TaskStatus) => {
    switch (status) {
      case 'Approved':
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          color: 'text-green-500 bg-green-500/10',
          textColor: 'text-green-500'
        };
      case 'Pending':
        return {
          icon: <Clock className="h-5 w-5" />,
          color: 'text-yellow-500 bg-yellow-500/10',
          textColor: 'text-yellow-500'
        };
      case 'Rejected':
        return {
          icon: <XCircle className="h-5 w-5" />,
          color: 'text-red-500 bg-red-500/10',
          textColor: 'text-red-500'
        };
      default:
        return {
          icon: null,
          color: '',
          textColor: ''
        };
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold"
        >
          My Tasks
        </motion.h1>
      </div>
      
      {myTasks.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {myTasks.map((item) => {
            const statusInfo = getStatusInfo(item.status);
            
            return (
              <motion.div
                key={item.taskId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card bg-gradient-to-br from-dark-gray to-background hover:border-light-gray/50 transition-all duration-300"
              >
               <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                  {/* Task Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <div className={`rounded-lg p-2 ${statusInfo.color}`}>
                        {statusInfo.icon}
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">{item.task?.title || item.taskId}</h3>
<p className="text-sm text-gray-400 line-clamp-1">
  {item.task?.description || 'No description available'}
</p>

                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Status</p>
                        <span className={`font-medium ${statusInfo.textColor}`}>
                          {item.status}
                        </span>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Reward</p>
                        <span className={item.status === 'Approved' ? 'text-neon-green font-medium' : 'text-gray-400'}>
                          ${item.task?.reward.toFixed(2)}
                        </span>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Submitted</p>
                        <span className="text-gray-300">
                          {new Date(item.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <Link 
                      to={`/tasks/${item.taskId}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-light-gray hover:bg-opacity-80 transition-colors text-sm font-medium"
                    >
                      View Details
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="card bg-gradient-to-br from-dark-gray to-background text-center py-12"
        >
          <p className="text-gray-400 mb-6">You haven't submitted any tasks yet.</p>
          <Link 
            to="/explore" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-neon-green to-[#00E5FF] text-background px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-colors"
          >
            Find New Tasks
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default MyTasksPage;
