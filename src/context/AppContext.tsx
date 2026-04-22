import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, Reward } from '../types';

interface AppContextType {
  points: number;
  tasks: Task[];
  rewards: Reward[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (task: Task) => void;
  addReward: (reward: Omit<Reward, 'id'>) => void;
  updateReward: (id: string, reward: Partial<Reward>) => void;
  deleteReward: (id: string) => void;
  redeemReward: (reward: Reward) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from localStorage or use defaults
  const [points, setPoints] = useState<number>(() => {
    const saved = localStorage.getItem('ql_points');
    return saved ? parseInt(saved) : 0;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('ql_tasks');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Plan the week', description: 'Map out major goals', points: 50 },
      { id: '2', title: 'Morning Workout', description: '30 mins of activity', points: 30 },
    ];
  });

  const [rewards, setRewards] = useState<Reward[]>(() => {
    const saved = localStorage.getItem('ql_rewards');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Gaming Session', cost: 100 },
      { id: '2', title: 'Favorite Coffee', cost: 50 },
    ];
  });

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem('ql_points', points.toString());
  }, [points]);

  useEffect(() => {
    localStorage.setItem('ql_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('ql_rewards', JSON.stringify(rewards));
  }, [rewards]);

  // Task Actions
  const addTask = (task: Omit<Task, 'id'>) => {
    setTasks(prev => [...prev, { ...task, id: crypto.randomUUID() }]);
  };

  const updateTask = (id: string, updatedFields: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const completeTask = (task: Task) => {
    setPoints(prev => prev + task.points);
  };

  // Reward Actions
  const addReward = (reward: Omit<Reward, 'id'>) => {
    setRewards(prev => [...prev, { ...reward, id: crypto.randomUUID() }]);
  };

  const updateReward = (id: string, updatedFields: Partial<Reward>) => {
    setRewards(prev => prev.map(r => r.id === id ? { ...r, ...updatedFields } : r));
  };

  const deleteReward = (id: string) => {
    setRewards(prev => prev.filter(r => r.id !== id));
  };

  const redeemReward = (reward: Reward): boolean => {
    if (points >= reward.cost) {
      setPoints(prev => prev - reward.cost);
      return true;
    }
    return false;
  };

  return (
    <AppContext.Provider value={{
      points, tasks, rewards,
      addTask, updateTask, deleteTask, completeTask,
      addReward, updateReward, deleteReward, redeemReward
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
