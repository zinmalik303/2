import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskStatus } from '../types';
import { mockTasks } from '../data/initialData';
import { useAuth } from './AuthContext';
import { TaskSubmission as DBTaskSubmission, UserProgress, dbHelpers } from '../lib/supabase';

interface TaskSubmission {
  taskId: string;
  userId: string;
  status: TaskStatus;
  submittedAt: string;
  text?: string;
  screenshot?: string;
}

interface TaskContextType {
  tasks: Task[];
  userSubmissions: TaskSubmission[];
  completedTasks: Record<string, boolean>;
  completedFirstClick: Record<string, boolean>;
  visitedTasks: Record<string, boolean>;
  globalAttemptCount: number;
  failAttemptCount: number;
  getTaskById: (id: string) => Task | undefined;
  getUserTaskSubmission: (taskId: string) => TaskSubmission | undefined;
  submitTask: (
    taskId: string,
    data: { screenshot?: string; text?: string }
  ) => Promise<boolean>;
  updateCompletedTasks: (taskId: string, completed: boolean) => Promise<void>;
  updateCompletedFirstClick: (taskId: string, clicked: boolean) => Promise<void>;
  updateVisitedTasks: (taskId: string, visited: boolean) => Promise<void>;
  incrementGlobalAttemptCount: () => Promise<void>;
  incrementFailAttemptCount: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks] = useState<Task[]>(mockTasks);
  const [userSubmissions, setUserSubmissions] = useState<TaskSubmission[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [completedFirstClick, setCompletedFirstClick] = useState<Record<string, boolean>>({});
  const [visitedTasks, setVisitedTasks] = useState<Record<string, boolean>>({});
  const [globalAttemptCount, setGlobalAttemptCount] = useState(0);
  const [failAttemptCount, setFailAttemptCount] = useState(0);

  const { supabaseUser, updateTasksCompleted, refreshUser } = useAuth();

  useEffect(() => {
    if (supabaseUser) {
      loadAllUserData();
    } else {
      resetState();
    }
  }, [supabaseUser]);

  const resetState = () => {
    setUserSubmissions([]);
    setCompletedTasks({});
    setCompletedFirstClick({});
    setVisitedTasks({});
    setGlobalAttemptCount(0);
    setFailAttemptCount(0);
  };

  const loadAllUserData = async () => {
    if (!supabaseUser) return;

    try {
      const [submissions, progress] = await Promise.all([
        dbHelpers.getTaskSubmissions(supabaseUser.id),
        dbHelpers.getUserProgress(supabaseUser.id)
      ]);

      const formattedSubmissions: TaskSubmission[] = submissions.map((sub: DBTaskSubmission) => ({
        taskId: sub.task_id,
        userId: sub.user_id,
        status: sub.status as TaskStatus,
        submittedAt: sub.submitted_at,
        text: sub.text || undefined,
        screenshot: sub.screenshot || undefined,
      }));

      setUserSubmissions(formattedSubmissions);

      if (progress) {
        setCompletedTasks(progress.completed_tasks || {});
        setCompletedFirstClick(progress.completed_first_click || {});
        setVisitedTasks(progress.visited_tasks || {});
        setGlobalAttemptCount(progress.global_attempt_count || 0);
        setFailAttemptCount(progress.fail_attempt_count || 0);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const refreshData = async () => {
    await loadAllUserData();
    await refreshUser();
  };

  const saveUserProgress = async (updates: Partial<UserProgress>) => {
    if (!supabaseUser) return;
    await dbHelpers.updateUserProgress(supabaseUser.id, updates);
  };

  const getTaskById = (id: string): Task | undefined => {
    return tasks.find((task) => task.id === id);
  };

  const getUserTaskSubmission = (taskId: string): TaskSubmission | undefined => {
    return userSubmissions.find((submission) => submission.taskId === taskId);
  };

  const submitTask = async (
    taskId: string,
    data: { screenshot?: string; text?: string }
  ): Promise<boolean> => {
    if (!supabaseUser) return false;

    try {
      const submission = await dbHelpers.submitTask(supabaseUser.id, taskId, {
        ...data,
        status: 'Approved',
      });

      if (!submission) {
        return false;
      }

      const newSubmission: TaskSubmission = {
        taskId: submission.task_id,
        userId: submission.user_id,
        status: submission.status as TaskStatus,
        submittedAt: submission.submitted_at,
        text: submission.text || undefined,
        screenshot: submission.screenshot || undefined,
      };

      setUserSubmissions(prev => {
        const filtered = prev.filter(sub => sub.taskId !== taskId);
        return [...filtered, newSubmission];
      });

      // Получаем актуальное количество выполненных заданий
      const updatedSubmissions = userSubmissions.filter(sub => sub.taskId !== taskId);
      updatedSubmissions.push(newSubmission);
      const newApprovedCount = updatedSubmissions.filter(s => s.status === 'Approved').length;
      
      await updateTasksCompleted(newApprovedCount);
      
      await updateCompletedTasks(taskId, true);

      return true;
    } catch (error) {
      console.error('Error submitting task:', error);
      return false;
    }
  };

  const updateCompletedTasks = async (taskId: string, completed: boolean) => {
    const newCompletedTasks = { ...completedTasks, [taskId]: completed };
    setCompletedTasks(newCompletedTasks);
    await saveUserProgress({ completed_tasks: newCompletedTasks });
  };

  const updateCompletedFirstClick = async (taskId: string, clicked: boolean) => {
    const newCompletedFirstClick = { ...completedFirstClick, [taskId]: clicked };
    setCompletedFirstClick(newCompletedFirstClick);
    await saveUserProgress({ completed_first_click: newCompletedFirstClick });
  };

  const updateVisitedTasks = async (taskId: string, visited: boolean) => {
    const newVisitedTasks = { ...visitedTasks, [taskId]: visited };
    setVisitedTasks(newVisitedTasks);
    await saveUserProgress({ visited_tasks: newVisitedTasks });
  };

  const incrementGlobalAttemptCount = async () => {
    const newCount = globalAttemptCount + 1;
    setGlobalAttemptCount(newCount);
    await saveUserProgress({ global_attempt_count: newCount });
  };

  const incrementFailAttemptCount = async () => {
    const newCount = failAttemptCount + 1;
    setFailAttemptCount(newCount);
    await saveUserProgress({ fail_attempt_count: newCount });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        userSubmissions,
        completedTasks,
        completedFirstClick,
        visitedTasks,
        globalAttemptCount,
        failAttemptCount,
        getTaskById,
        getUserTaskSubmission,
        submitTask,
        updateCompletedTasks,
        updateCompletedFirstClick,
        updateVisitedTasks,
        incrementGlobalAttemptCount,
        incrementFailAttemptCount,
        refreshData,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new error('useTasks must be used within a TaskProvider');
  }
  return context;
};