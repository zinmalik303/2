import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Profile {
  id: string;
  username: string;
  avatar?: string;
  balance: number;
  tasks_completed: number;
  total_earned: number;
  level: number;
  referral_code: string;
  congratulated: boolean;
  has_given_reward: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskSubmission {
  id: string;
  user_id: string;
  task_id: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  screenshot?: string;
  text?: string;
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  completed_tasks: Record<string, boolean>;
  completed_first_click: Record<string, boolean>;
  visited_tasks: Record<string, boolean>;
  global_attempt_count: number;
  fail_attempt_count: number;
  created_at: string;
  updated_at: string;
}

// Helper functions for database operations
export const dbHelpers = {
  // Profile operations
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data;
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating profile:', error);
      return false;
    }
    
    return true;
  },

  // Task submission operations
  async getTaskSubmissions(userId: string): Promise<TaskSubmission[]> {
    const { data, error } = await supabase
      .from('task_submissions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching submissions:', error);
      return [];
    }
    
    return data || [];
  },

  async submitTask(userId: string, taskId: string, submission: {
    screenshot?: string;
    text?: string;
    status?: 'Pending' | 'Approved' | 'Rejected';
  }): Promise<TaskSubmission | null> {
    const { data, error } = await supabase
      .from('task_submissions')
      .upsert({
        user_id: userId,
        task_id: taskId,
        screenshot: submission.screenshot,
        text: submission.text,
        status: submission.status || 'Pending',
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error submitting task:', error);
      return null;
    }
    
    return data;
  },

  // User progress operations
  async getUserProgress(userId: string): Promise<UserProgress | null> {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching progress:', error);
      return null;
    }
    
    return data;
  },

  async updateUserProgress(userId: string, updates: Partial<UserProgress>): Promise<boolean> {
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        ...updates,
      });
    
    if (error) {
      console.error('Error updating progress:', error);
      return false;
    }
    
    return true;
  },

  // Combined operations
  async updateBalanceAndEarnings(userId: string, amount: number): Promise<boolean> {
    // Get current profile
    const profile = await this.getProfile(userId);
    if (!profile) return false;

    const newBalance = parseFloat(profile.balance.toString()) + amount;
    const newTotalEarned = parseFloat(profile.total_earned.toString()) + amount;

    return await this.updateProfile(userId, {
      balance: newBalance,
      total_earned: newTotalEarned,
    });
  },

  async incrementTasksCompleted(userId: string): Promise<boolean> {
    const profile = await this.getProfile(userId);
    if (!profile) return false;

    return await this.updateProfile(userId, {
      tasks_completed: profile.tasks_completed + 1,
    });
  },
};