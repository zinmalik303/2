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
    data: { screenshot?: string; text?: string },
    onFirstFail?: () => void
  ) => Promise<boolean>;
  updateCompletedTasks: (taskId: string, completed: boolean) => Promise<void>;
  updateCompletedFirstClick: (taskId: string, clicked: boolean) => Promise<void>;
  updateVisitedTasks: (taskId: string, visited: boolean) => Promise<void>;
  incrementGlobalAttemptCount: () => Promise<void>;
  incrementFailAttemptCount: () => Promise<void>;
  isVerifying: boolean;
  verificationCountdown: number;
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
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCountdown, setVerificationCountdown] = useState(10);

  const { supabaseUser, updateTasksCompleted, refreshUser } = useAuth();

  // Load user data when user changes
  useEffect(() => {
    if (supabaseUser) {
      loadAllUserData();
    } else {
      // Reset state when user logs out
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
      // Load submissions and progress in parallel
      const [submissions, progress] = await Promise.all([
        dbHelpers.getTaskSubmissions(supabaseUser.id),
        dbHelpers.getUserProgress(supabaseUser.id)
      ]);

      // Process submissions
      const formattedSubmissions: TaskSubmission[] = submissions.map((sub: DBTaskSubmission) => ({
        taskId: sub.task_id,
        userId: sub.user_id,
        status: sub.status as TaskStatus,
        submittedAt: sub.submitted_at,
        text: sub.text || undefined,
        screenshot: sub.screenshot || undefined,
      }));

      setUserSubmissions(formattedSubmissions);

      // Process progress
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
    data: { screenshot?: string; text?: string },
    onFirstFail?: () => void
  ): Promise<boolean> => {
    console.log('TaskContext submitTask called with:', { taskId, data, supabaseUser: !!supabaseUser });
    if (!supabaseUser) return false;

    // Special handling for telegram and instagram tasks
    if (['telegram', 'instagram'].includes(taskId)) {
      const failedKey = `${taskId}_failed`;
      const alreadyFailed = completedFirstClick[failedKey] || false;
      
      console.log('TaskContext submitTask - taskId:', taskId);
      console.log('TaskContext submitTask - failedKey:', failedKey);
      console.log('TaskContext submitTask - completedFirstClick:', completedFirstClick);
      console.log('TaskContext submitTask - alreadyFailed:', alreadyFailed);
      
      if (!alreadyFailed) {
        console.log('TaskContext submitTask - First attempt, setting failed flag');
        // First attempt - always fail
        await updateCompletedFirstClick(failedKey, true);
        if (onFirstFail) onFirstFail();
        return false;
      }
      
      // Second attempt - success
      console.log('TaskContext submitTask - Second attempt, completing task');
      try {
        console.log('Calling dbHelpers.submitTask with:', { userId: supabaseUser.id, taskId, data: { ...data, status: 'Approved' } });
        const submission = await dbHelpers.submitTask(supabaseUser.id, taskId, {
          ...data,
          status: 'Approved',
        });

        console.log('dbHelpers.submitTask returned:', submission);
        if (!submission) {
          console.log('TaskContext submitTask - No submission returned from dbHelpers');
          return false;
        }

        console.log('TaskContext submitTask - Submission successful:', submission);

        // Update local state
        const newSubmission: TaskSubmission = {
          taskId: submission.task_id,
          userId: submission.user_id,
          status: submission.status as TaskStatus,
          submittedAt: submission.submitted_at,
          text: submission.text || undefined,
          screenshot: submission.screenshot || undefined,
        };

        console.log('Adding new submission to local state:', newSubmission);
        setUserSubmissions(prev => {
          const filtered = prev.filter(sub => sub.taskId !== taskId);
          return [...filtered, newSubmission];
        });

        // Update tasks completed count
        const approvedCount = userSubmissions.filter(s => s.status === 'Approved').length + 1;
        console.log('TaskContext submitTask - Updating tasks completed to:', approvedCount);
        await updateTasksCompleted(approvedCount);

        console.log('TaskContext submitTask - Task completed successfully');
        return true;
      } catch (error) {
        console.error('Error submitting telegram/instagram task:', error);
        return false;
      }
    }

    return new Promise((resolve) => {
      const failAt = Date.now() + 10000; // 10 секунд
      setIsVerifying(true);
      setVerificationCountdown(10);

      const interval = setInterval(async () => {
        const timeLeft = Math.max(0, Math.floor((failAt - Date.now()) / 1000));
        setVerificationCountdown(timeLeft);

        if (timeLeft > 0) return;

        clearInterval(interval);
        setIsVerifying(false);

        const handleSuccess = async () => {
          try {
            // Submit to database
            const submission = await dbHelpers.submitTask(supabaseUser.id, taskId, {
              ...data,
              status: 'Approved',
            });

            if (!submission) {
              resolve(false);
              return;
            }

            // Update local state
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

            // Update tasks completed count if it's a real task
            if (!['telegram', 'instagram'].includes(taskId)) {
              const approvedCount = userSubmissions.filter(s => s.status === 'Approved').length + 1;
              await updateTasksCompleted(approvedCount);
            }

            resolve(true);
          } catch (error) {
            console.error('Error in handleSuccess:', error);
            resolve(false);
          }
        };

        if (taskId === 'survey') {
          await handleSuccess();
          return;
        }

        // Global attempt logic
        if ([1, 4, 5].includes(globalAttemptCount + 1)) {
          await incrementFailAttemptCount();
          if (onFirstFail) onFirstFail();
          window.dispatchEvent(new Event('task-verification-failed'));
          resolve(false);
          return;
        }

        await handleSuccess();
      }, 1000);
    });
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
        isVerifying,
        verificationCountdown,
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
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};