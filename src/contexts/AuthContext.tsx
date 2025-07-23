import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, Profile, dbHelpers } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  username: string;
  avatar?: string;
  balance: number;
  tasksCompleted: number;
  totalEarned: number;
  level: number;
  referralCode: string;
  joinedAt: string;
  congratulated: boolean;
  hasGivenReward: boolean;
}

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  isConnected: boolean;
  userWallet: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username?: string) => Promise<void>;
  signOut: () => Promise<void>;
  connectWallet: (walletType: string) => Promise<void>;
  disconnectWallet: () => void;
  updateUserBalance: (amount: number) => Promise<void>;
  updateTasksCompleted: (count: number) => Promise<void>;
  updateProfile: (data: { username?: string; avatar?: string }) => Promise<void>;
  setUserAsCongratulated: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [userWallet, setUserWallet] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSupabaseUser(session?.user ?? null);
      
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setUserWallet(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      setLoading(true);
      const profile = await dbHelpers.getProfile(userId);

      if (profile) {
        setUser({
          id: profile.id,
          username: profile.username,
          avatar: profile.avatar || undefined,
          balance: Number(profile.balance) || 0,
          tasksCompleted: Number(profile.tasks_completed) || 0,
          totalEarned: Number(profile.total_earned) || 0,
          level: profile.level || 1,
          referralCode: profile.referral_code || '',
          joinedAt: profile.created_at,
          congratulated: profile.congratulated || false,
          hasGivenReward: profile.has_given_reward || false,
        });
        
        // Set wallet address from user ID (mock wallet connection)
        setUserWallet(userId.slice(0, 6) + '...' + userId.slice(-4));
      } else {
        // Create default profile if none exists
        const defaultProfile = {
          id: userId,
          username: 'Web3 User',
          balance: 0,
          tasks_completed: 0,
          total_earned: 0,
          level: 1,
          congratulated: false,
          has_given_reward: false,
        };
        
        const { error } = await supabase
          .from('profiles')
          .insert([defaultProfile]);
        
        const success = !error;
        if (success) {
          setUser({
            id: userId,
            username: 'Web3 User',
            avatar: undefined,
            balance: 0,
            tasksCompleted: 0,
            totalEarned: 0,
            level: 1,
            referralCode: '',
            joinedAt: new Date().toISOString(),
            congratulated: false,
            hasGivenReward: false,
          });
          setUserWallet(userId.slice(0, 6) + '...' + userId.slice(-4));
        } else {
          console.error('Error creating profile:', error);
        }
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (supabaseUser) {
      await loadUserProfile(supabaseUser.id);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, username = 'Web3 User') => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setUserWallet(null);
  };

  const connectWallet = async (walletType: string) => {
    // Generate unique wallet address
    const mockWallet = '0x' + Math.random().toString(16).substr(2, 40);
    
    // Create account with mock email
    const mockEmail = `${mockWallet}@wallet.local`;
    const mockPassword = 'wallet-password-123';
    
    try {
      await signUp(mockEmail, mockPassword, 'Web3 User');
    } catch (error) {
      // If user already exists, sign in
      try {
        await signIn(mockEmail, mockPassword);
      } catch (signInError) {
        console.error('Error connecting wallet:', signInError);
        throw signInError;
      }
    }
  };

  const disconnectWallet = () => {
    signOut();
  };

  const updateUserBalance = async (amount: number) => {
    if (!supabaseUser || !user) return;

    const success = await dbHelpers.updateBalanceAndEarnings(supabaseUser.id, amount);
    if (success) {
      setUser(prev => prev ? {
        ...prev,
        balance: prev.balance + amount,
        totalEarned: prev.totalEarned + amount,
      } : null);
    }
  };

  const updateTasksCompleted = async (count: number) => {
    if (!supabaseUser || !user) return;

    const success = await dbHelpers.updateProfile(supabaseUser.id, {
      tasks_completed: count,
    });

    if (success) {
      setUser(prev => prev ? { ...prev, tasksCompleted: count } : null);
    }
  };

  const updateProfile = async (data: { username?: string; avatar?: string }) => {
    if (!supabaseUser || !user) return;

    const success = await dbHelpers.updateProfile(supabaseUser.id, data);
    if (success) {
      setUser(prev => prev ? { ...prev, ...data } : null);
    }
  };

  const setUserAsCongratulated = async () => {
    if (!supabaseUser || !user) return;

    const success = await dbHelpers.updateProfile(supabaseUser.id, {
      congratulated: true,
      has_given_reward: true,
    });

    if (success) {
      setUser(prev => prev ? { 
        ...prev, 
        congratulated: true, 
        hasGivenReward: true 
      } : null);
    }
  };

  const isConnected = !!supabaseUser;

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        isConnected,
        userWallet,
        loading,
        signIn,
        signUp,
        signOut,
        connectWallet,
        disconnectWallet,
        updateUserBalance,
        updateTasksCompleted,
        updateProfile,
        setUserAsCongratulated,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};