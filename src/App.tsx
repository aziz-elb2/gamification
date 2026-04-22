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
    <div className="min-h-screen max-w-7xl mx-auto bg-slate-50 relative shadow-2xl min-[1024px]:my-6 min-[1024px]:rounded-[2rem] min-[1024px]:overflow-hidden min-[1024px]:h-[768px] min-[1024px]:flex min-[1024px]:flex-col border border-slate-200">
      {/* Header */}
      <header className="glass-sleek px-8 py-6 flex justify-between items-center z-10 shrink-0">
        <div className="flex flex-col">
          <h1 id="app-title" className="text-[18px] font-extrabold text-slate-800 tracking-tight leading-none">Gamification</h1>
        </div>
        <div className="flex items-center gap-4">
          <motion.div 
            key={points}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="points-badge-sleek flex items-center gap-2"
          >
            <Coins size={14} />
            <span id="points-display" className="text-sm font-bold tracking-tighter tabular-nums">
              {points.toLocaleString()}
            </span>
          </motion.div>
          <div className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center text-indigo-600 font-bold shrink-0 shadow-sm">
            <User size={14} />
          </div> 
        </div>
      </header>

      {/* Tab Switcher (Mobile Only) */}
      <div className="md:hidden px-6 pt-4">
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
          <button
            id="tab-tasks"
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'tasks' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Tasks
          </button>
          <button
            id="tab-rewards"
            onClick={() => setActiveTab('rewards')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'rewards' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Rewards
          </button>
        </div>
      </div>

      {/* Main Content: Grid on Desktop, Tabs on Mobile */}
      <main className="flex-grow p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto custom-scrollbar">
        {/* Tasks Section */}
        <section className={`flex flex-col space-y-4 ${activeTab !== 'tasks' ? 'hidden md:flex' : 'flex'}`}>
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-lg font-bold text-slate-700 flex items-center">
              <CheckCircle2 size={20} className="mr-2 text-indigo-500" />
              Tasks
            </h2>
            <button 
              onClick={() => { setActiveTab('tasks'); handleOpenAdd(); }}
              className="text-indigo-600 text-sm font-semibold hover:underline flex items-center"
            >
              <Plus size={16} className="mr-1" /> Add Task
            </button>
          </div>
          
          <div className="space-y-3 min-h-[300px]">
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-8 text-center text-slate-400 bg-white/50 rounded-2xl border-2 border-dashed border-slate-200">
                <CheckCircle2 size={40} className="mb-4 opacity-20" />
                <p className="font-medium">All clear!</p>
                <p className="text-xs">Time for a well-deserved break.</p>
              </div>
            ) : (
              tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  className="card-sleek p-4 flex items-center justify-between border-l-4 border-l-emerald-500 group"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="font-bold text-slate-800 truncate">{task.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-1">{task.description || "No description"}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-emerald-600 font-bold text-sm tracking-tight">+{task.points} pts</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit('task', task)}
                        className="p-1.5 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-indigo-500 transition-all"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => completeTask(task)}
                        className="p-2 bg-emerald-50 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all active:scale-90"
                      >
                        <CheckCircle2 size={24} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Rewards Section */}
        <section className={`flex flex-col space-y-4 ${activeTab !== 'rewards' ? 'hidden md:flex' : 'flex'}`}>
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-lg font-bold text-slate-700 flex items-center">
              <Gift size={20} className="mr-2 text-indigo-500" />
              Rewards
            </h2>
            <button 
              onClick={() => { setActiveTab('rewards'); handleOpenAdd(); }}
              className="text-indigo-600 text-sm font-semibold hover:underline flex items-center"
            >
              <Plus size={16} className="mr-1" /> Add Reward
            </button>
          </div>

          <div className="space-y-3 min-h-[300px]">
            {rewards.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-8 text-center text-slate-400 bg-white/50 rounded-2xl border-2 border-dashed border-slate-200">
                <Gift size={40} className="mb-4 opacity-20" />
                <p className="font-medium">The Bazaar is empty</p>
                <p className="text-xs">Add some rewards to stay motivated!</p>
              </div>
            ) : (
              rewards.map((reward) => (
                <motion.div
                  key={reward.id}
                  layout
                  className="card-sleek p-4 flex items-center justify-between group"
                >
                  <div className="flex items-center flex-1 min-w-0 pr-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mr-4 shrink-0 shadow-inner">
                      <Gift size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-800 truncate">{reward.title}</h3>
                      <p className="text-xs text-slate-400">Limited time offer</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-slate-600 font-bold text-sm mb-1">{reward.cost} pts</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit('reward', reward)}
                        className="p-1.5 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-indigo-500 transition-all"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        disabled={points < reward.cost}
                        onClick={() => redeemReward(reward)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                          points >= reward.cost
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {points >= reward.cost ? 'Redeem' : 'Locked'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>
      </main>

  
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
