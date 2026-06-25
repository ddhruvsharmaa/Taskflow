import { useAppStore } from '../../store/AppContext';
import { CheckCircle2, CircleDashed, Clock, Flame } from 'lucide-react';
import { motion } from 'motion/react';

export function Dashboard() {
  const { state } = useAppStore();

  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter(t => t.status === 'Done').length;
  const inProgress = state.tasks.filter(t => t.status === 'In Progress').length;
  const percentComplete = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const stats = [
    { label: 'Total Tasks', value: totalTasks, icon: CircleDashed, color: 'text-blue-500' },
    { label: 'Completed', value: completedTasks, icon: CheckCircle2, color: 'text-emerald-500' },
    { label: 'In Progress', value: inProgress, icon: Clock, color: 'text-amber-500' },
    { label: 'Goal Streak', value: '4 days', icon: Flame, color: 'text-red-500' },
  ];

  return (
    <div className="flex-1 overflow-hidden p-6 space-y-6 flex flex-col h-full bg-[#09090B]">
       <div className="mb-2">
         <h1 className="text-3xl font-semibold tracking-tight text-white mb-1">Dashboard</h1>
         <p className="text-[#A1A1AA] text-sm">Analytics and overview of your progress.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {stats.map((stat, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.05 }}
               className="bg-[#18181B] border border-[rgba(255,255,255,0.08)] rounded-xl p-5 flex items-center justify-between"
             >
                <div>
                   <div className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-1">{stat.label}</div>
                   <div className="text-2xl font-semibold text-white tracking-tight">{stat.value}</div>
                </div>
                <div className={`w-10 h-10 rounded-full bg-[#111216] border border-[rgba(255,255,255,0.05)] flex items-center justify-center ${stat.color}`}>
                   <stat.icon className="w-5 h-5" />
                </div>
             </motion.div>
          ))}
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#18181B] border border-[rgba(255,255,255,0.08)] rounded-xl p-6">
             <h3 className="font-semibold text-white mb-4 tracking-tight">Completion Rate</h3>
             <div className="h-4 bg-[#111216] rounded-full overflow-hidden border border-[rgba(255,255,255,0.05)] flex">
                <motion.div 
                  initial={{ width: 0 }} animate={{ width: `${percentComplete}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                />
             </div>
             <div className="mt-3 flex justify-between text-sm text-[#A1A1AA] font-medium">
                <span>{percentComplete}% Completed</span>
                <span>{completedTasks} / {totalTasks} Tasks</span>
             </div>
          </div>
       </div>
    </div>
  );
}
