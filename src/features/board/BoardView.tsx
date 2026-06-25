import { useAppStore } from '../../store/AppContext';
import { Task, TaskStatus } from '../../types';
import { Plus, MoreHorizontal } from 'lucide-react';
import { motion } from 'motion/react';

const COLUMNS: TaskStatus[] = ['Todo', 'In Progress', 'Done'];

export function BoardView() {
  const { state, dispatch } = useAppStore();

  const handleMove = (task: Task, newStatus: TaskStatus) => {
    dispatch({ type: 'MOVE_TASK', payload: { id: task.id, status: newStatus } });
  };

  return (
    <div className="flex-1 flex flex-col p-6 overflow-hidden bg-[#09090B]">
      <div className="mb-6">
         <h1 className="text-3xl font-semibold tracking-tight text-white mb-1">Board</h1>
         <p className="text-[#A1A1AA] text-sm">Visualize your workflow.</p>
      </div>
      
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {COLUMNS.map((status) => {
          const colTasks = state.tasks.filter(t => t.status === status);
          
          return (
            <div key={status} className="flex-shrink-0 w-[320px] flex flex-col bg-[#111216]/50 border border-[rgba(255,255,255,0.05)] rounded-xl">
              <div className="p-3 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between bg-[rgba(255,255,255,0.02)]">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-xs tracking-wider uppercase text-[#A1A1AA]">{status}</span>
                  <span className="bg-[#18181B] text-[#A1A1AA] text-[10px] font-bold px-2 py-0.5 rounded border border-[rgba(255,255,255,0.08)]">
                    {colTasks.length}
                  </span>
                </div>
                <button className="text-[#A1A1AA] hover:text-white transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {colTasks.map((task) => (
                  <motion.div
                    layoutId={task.id}
                    key={task.id}
                    className="bg-[#18181B] border border-[rgba(255,255,255,0.08)] rounded-lg p-3 hover:border-blue-500/40 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-2">
                       <span className="text-sm font-medium text-white leading-snug break-words">
                         {task.title}
                       </span>
                       <button className="text-[#A1A1AA] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <MoreHorizontal className="w-4 h-4" />
                       </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                       <span className={`text-[10px] font-medium px-2 py-0.5 rounded border flex items-center gap-1.5 ${
                         task.priority === 'High' ? 'text-[#A1A1AA] bg-[#18181B] border-[rgba(255,255,255,0.08)]' :
                         task.priority === 'Medium' ? 'text-[#A1A1AA] bg-[#18181B] border-[rgba(255,255,255,0.08)]' :
                         'text-[#A1A1AA] bg-[#18181B] border-[rgba(255,255,255,0.08)]'
                       }`}>
                         <div className={`w-1.5 h-1.5 rounded-full ${
                            task.priority === 'High' ? 'bg-red-500' : 
                            task.priority === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
                         }`}></div>
                         {task.priority}
                       </span>

                       {/* Action dots to simulate board progression on click for simplicity */}
                       <div className="ml-auto flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         {COLUMNS.filter(c => c !== status).map(dest => (
                           <button 
                             key={dest}
                             onClick={(e) => { e.stopPropagation(); handleMove(task, dest); }}
                             className="text-[10px] hover:text-white text-[#A1A1AA] bg-[rgba(255,255,255,0.05)] px-1.5 py-0.5 rounded border border-[rgba(255,255,255,0.05)] transition-colors"
                             title={`Move to ${dest}`}
                           >
                              {dest.charAt(0)}
                           </button>
                         ))}
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
