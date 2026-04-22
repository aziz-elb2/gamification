import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2 } from 'lucide-react';
import { Task, Reward } from '../types';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onDelete?: () => void;
  type: 'task' | 'reward';
  initialData?: any;
}

const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose, onSave, onDelete, type, initialData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setValue(String(initialData.points || initialData.cost || ''));
    } else {
      setTitle('');
      setDescription('');
      setValue('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !value) return;

    if (type === 'task') {
      onSave({ title, description, points: parseInt(value) });
    } else {
      onSave({ title, cost: parseInt(value) });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            <h2 id="modal-title" className="text-2xl font-bold text-slate-800 mb-6">
              {initialData ? 'Edit' : 'Add New'} {type === 'task' ? 'Task' : 'Reward'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label id="label-title" className="block text-sm font-semibold text-slate-600 mb-2">Title</label>
                <input
                  type="text"
                  id="input-title"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-0 outline-none transition-all"
                  placeholder={type === 'task' ? "e.g. Read for 20 mins" : "e.g. 1 hour of Video Games"}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {type === 'task' && (
                <div>
                  <label id="label-desc" className="block text-sm font-semibold text-slate-600 mb-2">Description (Optional)</label>
                  <textarea
                    id="input-desc"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-0 outline-none transition-all resize-none"
                    placeholder="Briefly describe the task..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                  />
                </div>
              )}

              <div>
                <label id="label-value" className="block text-sm font-semibold text-slate-600 mb-2">
                  {type === 'task' ? 'Points Reward' : 'Points Cost'}
                </label>
                <input
                  type="number"
                  id="input-value"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-0 outline-none transition-all"
                  placeholder="0"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                />
              </div>

              {/* Delete Section - Placed before the action buttons */}
              {initialData && onDelete && (
                <div className="flex justify-start px-1">
                  <button
                    type="button"
                    id="btn-delete"
                    onClick={() => {
                      onDelete();
                      onClose();
                    }}
                    className="flex items-center gap-2 text-sm font-semibold text-rose-500 hover:text-rose-600 transition-all hover:scale-105 active:scale-95"
                  >
                    <Trash2 size={16} />
                    <span>Delete {type === 'task' ? 'Quest' : 'Reward'}</span>
                  </button>
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  id="btn-cancel"
                  onClick={onClose}
                  className="flex-1 px-3 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-save"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
                >
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FormModal;
