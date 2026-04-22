import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  CheckCircle2, 
  Gift, 
  Trash2, 
  Coins, 
  LayoutDashboard, 
  Trophy,
  User,
  Pencil
} from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import FormModal from './components/FormModal';
import { Task, Reward } from './types';

const Dashboard = () => {
  const { 
    points, tasks, rewards, 
    addTask, updateTask, deleteTask, completeTask,
    addReward, updateReward, deleteReward, redeemReward 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'tasks' | 'rewards'>('tasks');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ type: 'task' | 'reward'; data: any } | null>(null);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (type: 'task' | 'reward', data: any) => {
    setEditingItem({ type, data });
    setIsModalOpen(true);
  };

  const handleSave = (data: any) => {
    if (editingItem) {
      if (editingItem.type === 'task') {
        updateTask(editingItem.data.id, data);
      } else {
        updateReward(editingItem.data.id, data);
      }
    } else {
      if (activeTab === 'tasks') {
        addTask(data);
      } else {
        addReward(data);
      }
    }
  };

  const handleDelete = () => {
    if (editingItem) {
      if (editingItem.type === 'task') {
        deleteTask(editingItem.data.id);
      } else {
        deleteReward(editingItem.data.id);
      }
      setEditingItem(null); // Ensure we clear the item after deleting
      setIsModalOpen(false); // Double-ensure modal closes
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col relative max-w-2xl mx-auto shadow-2xl border-x border-slate-200/50">
      {/* Header */}
      <header className="glass-sleek px-6 pt-8 pb-5 flex justify-between items-center z-10 shrink-0 sticky top-0 border-b border-slate-200/50">
        <div className="flex flex-col">
          <h1 id="app-title" className="text-xl font-black text-slate-800 tracking-tighter leading-none uppercase">QuestLog</h1>
          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Level 1 Adventurer</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.div 
            key={points}
            initial={{ scale: 1.1, y: -5 }}
            animate={{ scale: 1, y: 0 }}
            className="points-badge-sleek flex items-center gap-2 py-2 px-4 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-100"
          >
            <Coins size={14} className="text-yellow-300" />
            <span id="points-display" className="text-sm font-black tracking-tighter tabular-nums">
              {points.toLocaleString()}
            </span>
          </motion.div>
          <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
            <User size={18} />
          </div> 
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="px-6 pt-6 shrink-0 bg-slate-50">
        <div className="flex gap-2 p-1.5 bg-slate-200/50 rounded-[1.25rem] border border-slate-200">
          <button
            id="tab-tasks"
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'tasks' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400'
            }`}
          >
            Quests
          </button>
          <button
            id="tab-rewards"
            onClick={() => setActiveTab('rewards')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'rewards' ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' : 'text-slate-400'
            }`}
          >
            Bazaar
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-6 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'tasks' ? (
            <motion.div
              key="tasks-section"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col h-full space-y-4"
            >
              <div className="flex justify-between items-center shrink-0">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Quests</h2>
              </div>
              
              <div className="flex-grow overflow-y-auto no-scrollbar space-y-3 pb-32">
                {tasks.length === 0 ? (
                  <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center px-10">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-indigo-100 blur-3xl opacity-50 rounded-full" />
                      <CheckCircle2 size={64} className="relative text-indigo-200" />
                    </div>
                    <p className="text-lg font-black text-slate-800 tracking-tight mb-2">All Clear!</p>
                    <p className="text-sm font-medium text-slate-400 leading-relaxed">Your quest log is empty. Time to forge some new goals or enjoy your spoils.</p>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      className="card-sleek p-5 flex items-center justify-between border-l-4 border-l-emerald-500 group relative transition-all active:scale-[0.98]"
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <h3 className="font-bold text-slate-800 text-base tracking-tight truncate">{task.title}</h3>
                        <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-black text-emerald-600 tracking-wider uppercase">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Earn {task.points} Points
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit('task', task)}
                          className="p-2.5 text-slate-300 hover:text-indigo-500 transition-all"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => completeTask(task)}
                          className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                        >
                          <CheckCircle2 size={24} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="rewards-section"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full space-y-4"
            >
              <div className="flex justify-between items-center shrink-0">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">The Great Bazaar</h2>
              </div>

              <div className="flex-grow overflow-y-auto no-scrollbar space-y-3 pb-32">
                {rewards.length === 0 ? (
                  <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center px-10">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-emerald-100 blur-3xl opacity-50 rounded-full" />
                      <Gift size={64} className="relative text-emerald-200" />
                    </div>
                    <p className="text-lg font-black text-slate-800 tracking-tight mb-2">Bazaar is Closed</p>
                    <p className="text-sm font-medium text-slate-400 leading-relaxed">No rewards available. Add some high-tier items to keep your ambition alive.</p>
                  </div>
                ) : (
                  rewards.map((reward) => (
                    <motion.div
                      key={reward.id}
                      layout
                      className="card-sleek p-5 flex items-center justify-between group relative transition-all active:scale-[0.98]"
                    >
                      <div className="flex items-center flex-1 min-w-0 pr-4">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mr-4 shrink-0 border border-indigo-100 shadow-inner">
                          <Gift size={24} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-slate-800 text-base tracking-tight truncate">{reward.title}</h3>
                          <div className="mt-1 flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                            Cost: {reward.cost} pts
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit('reward', reward)}
                          className="p-2.5 text-slate-300 hover:text-indigo-500 transition-all"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          disabled={points < reward.cost}
                          onClick={() => redeemReward(reward)}
                          className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-md ${
                            points >= reward.cost
                              ? 'bg-indigo-600 text-white hover:bg-slate-900'
                              : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200'
                          }`}
                        >
                          Redeem
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Persistent Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-20 pointer-events-none md:max-w-2xl md:mx-auto">
        <motion.button
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenAdd}
          className={`w-full py-5 rounded-[1.5rem] flex items-center justify-center gap-3 text-white font-black uppercase tracking-[0.25em] shadow-2xl pointer-events-auto transition-all text-xs border border-white/20 ${
            activeTab === 'tasks' ? 'bg-indigo-600' : 'bg-emerald-600'
          }`}
        >
          <Plus size={20} strokeWidth={4} />
          Create New {activeTab === 'tasks' ? 'Quest' : 'Reward'}
        </motion.button>
      </div>

      {/* Modals */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={editingItem ? editingItem.type : activeTab === 'tasks' ? 'task' : 'reward'}
        initialData={editingItem?.data}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-200 flex items-center justify-center p-0 sm:p-4">
        <Dashboard />
      </div>
    </AppProvider>
  );
}
