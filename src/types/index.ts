// Auth Types
export type Wallet = 'MetaMask' | 'TrustWallet' | 'WalletConnect';

export interface User {
  address: string;
  username: string;
  avatar: string | null;
  balance: number;
  tasksCompleted: number;
  totalEarned: number;
  level: number;
  referralCode: string;
  joinedAt: string;
}

// Task Types
export type TaskDifficulty = 'Easy' | 'Medium' | 'Hard';
export type TaskStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: TaskDifficulty;
  reward: number;
  link?: string;
  instructions: string;
  requirements?: {
    easyTasksCompleted?: number;
  };
  createdAt: string;
  imageUrl?: string;
  isHot?: boolean;
  type?: string;
  tokens?: {
    symbol: string;
    url: string;
  }[];
}

export interface TaskSubmission {
  taskId: string;
  userId: string;
  screenshot?: string;
  text?: string;
  status: TaskStatus;
  submittedAt: string;
}

// Form Types
export interface PublishTaskForm {
  email: string;
  telegram: string;
  description: string;
}