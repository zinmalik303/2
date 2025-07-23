import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Shield, DollarSign } from 'lucide-react';
import { useTasks } from '../contexts/TaskContext';

const TaskDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { getTaskById } = useTasks();
  
  const task = id ? getTaskById(id) : undefined;

  if (!task) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Task Not Found</h1>
        <p className="text-gray-400 mb-6">The task you're looking for doesn't exist.</p>
        <Link 
          to="/explore" 
          className="inline-flex items-center gap-2 bg-neon-green text-background px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tasks
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Link 
          to="/explore" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tasks
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{task.title}</h1>
            <p className="text-gray-400">{task.description}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-green-500/10 rounded-full px-3 py-1">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-medium">${task.reward.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-500/10 rounded-full px-3 py-1">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-medium">{task.difficulty}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-3">Instructions</h2>
            <p className="text-gray-300">{task.instructions}</p>
          </div>

          {task.link && (
            <div>
              <h2 className="text-xl font-bold mb-3">Task Link</h2>
              <a
                href={task.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg transition-colors"
              >
                Open Task Link
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {task.tokens && (
            <div>
              <h2 className="text-xl font-bold mb-3">Available Tokens</h2>
              <div className="flex flex-wrap gap-2">
                {task.tokens.map(token => (
                  <a
                    key={token.symbol}
                    href={token.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-dark-gray hover:bg-light-gray transition-colors duration-200 rounded-full px-3 py-1 text-sm font-medium text-gray-300 hover:text-white flex items-center gap-1"
                  >
                    {token.symbol}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TaskDetails;