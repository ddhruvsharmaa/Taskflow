import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAppStore } from '../../store/AppContext';
import { Search, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';

export function TaskList() {
  const { state, dispatch } = useAppStore();
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleTaskStatus = useCallback((task: Task) => {
    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        ...task,
        status: task.status === 'Done' ? 'Todo' : 'Done'
      }
    });
  }, [dispatch]);

  const deleteTask = useCallback((taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  }, [dispatch]);

  const updateTask = useCallback((task: Task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
  }, [dispatch]);

  const filteredTasks = useMemo(() => state.tasks.filter(t => 
    t.title.toLowerCase().includes(state.searchQuery.toLowerCase())
  ), [state.tasks, state.searchQuery]);

  // The "Mid-Flight Pointer Freeze": disable pointers when list changes length
  // We use just the filtered layout string to detect structural DOM jumps
  const layoutDependency = useMemo(() => filteredTasks.map(t => t.id).join(','), [filteredTasks]);
  
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 350); // Slightly longer than the 300ms spring duration
    return () => clearTimeout(timer);
  }, [layoutDependency]);

  const completedCount = filteredTasks.filter(t => t.status === 'Done').length;
  const pendingCount = filteredTasks.filter(t => t.status !== 'Done').length;
  const completionRate = filteredTasks.length > 0 ? Math.round((completedCount / filteredTasks.length) * 100) : 0;

  const STATUS_GROUPS: { status: TaskStatus; label: string; iconColor: string; iconPath: string }[] = [
    { 
      status: 'In Progress', 
      label: 'IN PROGRESS', 
      iconColor: 'text-blue-400',
      iconPath: 'M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z' 
    },
    { 
      status: 'Todo', 
      label: 'TO DO', 
      iconColor: 'text-[#A1A1AA]',
      iconPath: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' 
    },
    { 
      status: 'Done', 
      label: 'DONE', 
      iconColor: 'text-emerald-400',
      iconPath: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' 
    }
  ];

  const springConfig = { type: "spring", bounce: 0, duration: 0.3 };

  return (
    <div className="flex-1 overflow-hidden p-6 space-y-6 flex flex-col h-full bg-[#09090B]">
      
      {/* Quick Summary Row */}
      <div className="grid grid-cols-4 gap-4 shrink-0">
        <div className="bg-[#18181B] p-4 rounded-xl border border-[rgba(255,255,255,0.08)]">
          <div className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-1">Completion</div>
          <div className="text-2xl font-semibold text-white">{completionRate.toFixed(1)}%</div>
          <div className="w-full bg-[#111216] h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-500" style={{ width: `${completionRate}%`}}></div>
          </div>
        </div>
        <div className="bg-[#18181B] p-4 rounded-xl border border-[rgba(255,255,255,0.08)]">
          <div className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-1">Velocity</div>
          <div className="text-2xl font-semibold text-white">12 <span className="text-xs text-[#A1A1AA] font-normal">pts/day</span></div>
          <div className="flex items-center gap-1 mt-3 text-[10px] text-green-400 font-bold">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"></path></svg>
            +14% vs last week
          </div>
        </div>
        <div className="bg-[#18181B] p-4 rounded-xl border border-[rgba(255,255,255,0.08)]">
          <div className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-1">Pending Tasks</div>
          <div className="text-2xl font-semibold text-white">{pendingCount}</div>
          <div className="mt-3 flex -space-x-2">
            <div className="w-6 h-6 rounded-full border-2 border-[#18181B] bg-blue-500"></div>
            <div className="w-6 h-6 rounded-full border-2 border-[#18181B] bg-purple-500"></div>
            <div className="w-6 h-6 rounded-full border-2 border-[#18181B] bg-emerald-500"></div>
            <div className="w-6 h-6 rounded-full border-2 border-[#18181B] bg-[#27272A] flex items-center justify-center text-[8px] text-white">+8</div>
          </div>
        </div>
        <div className="bg-[#18181B] p-4 rounded-xl border border-[rgba(255,255,255,0.08)]">
          <div className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-1">Next Deadline</div>
          <div className="text-2xl font-semibold text-amber-500">02d <span className="text-xs text-[#A1A1AA] font-normal">14h</span></div>
          <div className="mt-3 text-[10px] text-[#A1A1AA] font-medium italic truncate">Final UX QA for Mobile Beta</div>
        </div>
      </div>

      {/* High Density Task List */}
      <div className="flex-1 flex flex-col min-h-0 bg-[#111216]/50 rounded-xl border border-[rgba(255,255,255,0.05)]">
        <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between bg-[rgba(255,255,255,0.02)] shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">List</span>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            </div>
            <span className="text-xs font-medium text-[#A1A1AA] cursor-pointer hover:text-white transition-colors" onClick={() => dispatch({ type: 'SET_VIEW', payload: 'Board' })}>Kanban</span>
            <span className="text-xs font-medium text-[#A1A1AA] cursor-pointer hover:text-white transition-colors" onClick={() => dispatch({ type: 'SET_VIEW', payload: 'Dashboard' })}>Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-1.5 hover:bg-[rgba(255,255,255,0.05)] rounded-md transition-colors"><svg className="w-4 h-4 text-[#A1A1AA]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg></button>
            <button className="p-1.5 hover:bg-[rgba(255,255,255,0.05)] rounded-md transition-colors"><svg className="w-4 h-4 text-[#A1A1AA]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg></button>
          </div>
        </div>

        <div className={`flex-1 overflow-y-auto divide-y divide-[rgba(255,255,255,0.05)] ${isAnimating ? 'pointer-events-none' : ''}`}>
          <AnimatePresence mode="popLayout">
            {filteredTasks.length === 0 && (
              <motion.div
                key="empty-state"
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={springConfig}
                className="flex flex-col items-center justify-center p-12 mt-8 mx-6 border border-dashed border-[rgba(255,255,255,0.08)] rounded-xl bg-[rgba(255,255,255,0.02)]"
              >
                 {state.searchQuery ? (
                    <>
                      <Search className="w-8 h-8 text-[#A1A1AA]/40 mb-3" />
                      <div className="text-sm font-medium text-white mb-1.5 tracking-tight">No tasks match your search</div>
                      <div className="text-xs text-[#A1A1AA] flex justify-center items-center gap-2">
                        Adjust your filters or press <kbd className="px-1.5 py-0.5 rounded border border-[rgba(255,255,255,0.1)] bg-[#111216] font-mono text-[10px] text-white">ESC</kbd> to clear.
                      </div>
                    </>
                 ) : (
                    <>
                      <CheckCircle2 className="w-8 h-8 text-[#A1A1AA]/40 mb-3" />
                      <div className="text-sm font-medium text-white mb-1.5 tracking-tight">You're all caught up!</div>
                      <div className="text-xs text-[#A1A1AA]">
                        Use the command bar below to create a new task.
                      </div>
                    </>
                 )}
              </motion.div>
            )}
          </AnimatePresence>
          
          {STATUS_GROUPS.map((group) => {
            const groupTasks = filteredTasks.filter(t => t.status === group.status);
            if (groupTasks.length === 0) return null;

            return (
              <div key={group.status}>
                <div className="sticky top-0 z-10 px-4 py-2 bg-[#111216]/95 backdrop-blur text-[11px] font-bold text-[#A1A1AA] flex items-center gap-2 border-b border-[rgba(255,255,255,0.02)]">
                  <svg className={`w-3 h-3 ${group.iconColor}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d={group.iconPath} clipRule="evenodd"></path></svg>
                  {group.label}
                </div>
                
                <AnimatePresence mode="popLayout">
                  {groupTasks.map((task) => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onToggleStatus={toggleTaskStatus} 
                      onDelete={deleteTask}
                      onUpdate={updateTask}
                      layoutDependency={layoutDependency}
                    />
                  ))}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
