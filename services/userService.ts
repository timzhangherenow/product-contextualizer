import { User } from '../types';

const DB_KEY = 'pca_users_db';
export const ADMIN_EMAIL = 'timzhangherenow@gmail.com';

const DEFAULT_USERS: User[] = [
  {
    id: 'admin-user',
    name: 'Tim Zhang (Admin)',
    email: ADMIN_EMAIL,
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Tim',
    balance: 999
  },
  {
    id: 'demo-user-1',
    name: 'Alice Designer',
    email: 'alice@example.com',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Alice',
    balance: 3
  },
  {
    id: 'demo-user-2',
    name: 'Bob Marketer',
    email: 'bob@example.com',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Bob',
    balance: 0
  }
];

// Initialize DB if empty
const initDB = () => {
  const existing = localStorage.getItem(DB_KEY);
  if (!existing) {
    localStorage.setItem(DB_KEY, JSON.stringify(DEFAULT_USERS));
  }
};

export const userService = {
  // Get all users (Admin function)
  getUsers: (): User[] => {
    initDB();
    return JSON.parse(localStorage.getItem(DB_KEY) || '[]');
  },

  // Save full user list
  saveUsers: (users: User[]) => {
    localStorage.setItem(DB_KEY, JSON.stringify(users));
  },

  // Simulate login
  login: (email: string): User => {
    initDB();
    const users = userService.getUsers();
    let user = users.find(u => u.email === email);
    
    if (!user) {
      // Create new user if not exists
      user = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${email}`,
        balance: 5 // Default balance for new users
      };
      users.push(user);
      userService.saveUsers(users);
    }
    return user;
  },

  // Update specific user's balance
  updateBalance: (userId: string, newBalance: number): User | null => {
    const users = userService.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index].balance = newBalance;
      userService.saveUsers(users);
      return users[index];
    }
    return null;
  },

  // Deduct 1 credit from user
  deductBalance: (userId: string): User | null => {
    const users = userService.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1 && users[index].balance > 0) {
      users[index].balance -= 1;
      userService.saveUsers(users);
      return users[index];
    }
    return null;
  },
  
  // Check if email is admin
  isAdmin: (email: string) => email === ADMIN_EMAIL,

  // Reload current user data from DB to ensure UI is in sync
  refreshUser: (userId: string): User | null => {
    const users = userService.getUsers();
    return users.find(u => u.id === userId) || null;
  }
};