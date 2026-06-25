import React from 'react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { Trash2, Calendar, Bell, BellRing } from 'lucide-react';
import { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onUpdate: (task: Task) => void;
  layoutDependency: string;
}

const springConfig = { type: "spring", bounce: 0, duration: 0.3 };

function TaskCardComponent({ task, onToggleStatus, onDelete, onUpdate, layoutDependency }: TaskCardProps) {
  return (
    <motion.div
      layout
      layoutId={task.id}
      layoutDependency={layoutDependency}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
      transition={springConfig}
      style={{ willChange: "transform, opacity" }}
      className={`group px-4 py-3 hover:bg-[rgba(255,255,255,0.02)] transition-colors flex items-center gap-4 cursor-pointer ${task.status === 'Done' ? 'opacity-60' : ''}`}
    >
      <input 
        type="checkbox" 
        checked={task.status === 'Done'}
        onChange={() => onToggleStatus(task)}
        className="w-4 h-4 rounded border border-[rgba(255,255,255,0.1)] bg-[#09090B] checked:bg-blue-600 transition-all cursor-pointer appearance-none shrink-0 outline-none flex items-center justify-center relative before:content-[''] before:absolute before:inset-0 before:bg-blue-600 before:scale-0 checked:before:scale-100 before:transition-transform before:rounded after:content-['✓'] after:absolute after:text-white after:text-xs after:opacity-0 checked:after:opacity-100 after:transition-opacity"
      />
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium leading-none mb-1.5 truncate ${task.status === 'Done' ? 'line-through text-[#A1A1AA]' : 'text-white'}`}>
          {task.title}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#A1A1AA] flex items-center gap-1.5 border border-[rgba(255,255,255,0.08)] px-2 py-0.5 rounded bg-[#18181B] shrink-0">
            <div className={`w-1.5 h-1.5 rounded-full ${
               task.priority === 'High' ? 'bg-red-500' : 
               task.priority === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
            }`}></div>
            {task.priority} Priority
          </span>
          {task.tags.map((t, idx) => (
             <span key={idx} className="text-[10px] text-[#A1A1AA] px-2 py-0.5 rounded border border-[rgba(255,255,255,0.08)] shrink-0 truncate max-w-[100px]">{t}</span>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 text-[#A1A1AA] shrink-0">
        
        <label className="relative flex items-center justify-center cursor-pointer hover:text-white transition-colors h-6" onClick={e => e.stopPropagation()}>
          <input 
            type="date"
            value={task.dueDate ? task.dueDate.split('T')[0] : ''}
            onChange={(e) => {
              const newDate = e.target.value ? new Date(e.target.value).toISOString() : null;
              onUpdate({ ...task, dueDate: newDate });
            }}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="flex items-center gap-1.5" title="Set Due Date">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium hidden sm:block whitespace-nowrap">
              {task.dueDate ? format(new Date(task.dueDate), 'MMM dd') : 'Set Date'}
            </span>
          </div>
        </label>

        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            onUpdate({ ...task, hasNotification: !task.hasNotification });
          }} 
          className={`p-1 rounded transition-colors ${task.hasNotification ? 'text-amber-400 hover:text-amber-300' : 'hover:text-white hover:bg-[rgba(255,255,255,0.05)]'}`}
          title={task.hasNotification ? "Notifications On" : "Notifications Off"}
        >
          {task.hasNotification ? <BellRing className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
        </button>
        
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
           <button 
             onClick={(e) => { 
                e.stopPropagation(); 
                onDelete(task.id);
             }} 
             className="p-1 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
           >
             <Trash2 className="w-3.5 h-3.5" />
           </button>
        </div>

        <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-[10px] font-bold text-blue-400 shrink-0 ml-1">DK</div>
      </div>
    </motion.div>
  );
}

// Strict Leaf Memoization
export const TaskCard = React.memo(TaskCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.status === nextProps.task.status &&
    prevProps.task.priority === nextProps.task.priority &&
    prevProps.task.dueDate === nextProps.task.dueDate &&
    prevProps.task.hasNotification === nextProps.task.hasNotification &&
    prevProps.layoutDependency === nextProps.layoutDependency &&
    // Check tags array equality
    prevProps.task.tags.length === nextProps.task.tags.length &&
    prevProps.task.tags.every((tag, index) => tag === nextProps.task.tags[index])
  );
});
