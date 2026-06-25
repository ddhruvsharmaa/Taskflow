import { useEffect, useState } from 'react';
import { useAppStore } from '../../store/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { BellRing, X } from 'lucide-react';
import { Task } from '../../types';

export function UpcomingAlerts() {
  const { state } = useAppStore();
  const [alerts, setAlerts] = useState<Task[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const checkAlerts = () => {
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Normalize to start of today

      const upcoming = state.tasks.filter(task => {
        if (!task.hasNotification || task.status === 'Done' || !task.dueDate) return false;
        if (dismissed.has(task.id)) return false;
        
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0); // Normalize due date for comparison
        
        // Alert if the due date is today or passed
        return dueDate <= now;
      });
      
      setAlerts(upcoming);
    };

    checkAlerts();
    const interval = setInterval(checkAlerts, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [state.tasks, dismissed]);

  const dismissAlert = (id: string) => {
    setDismissed(prev => new Set(prev).add(id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {alerts.map(task => (
          <motion.div
            key={`alert-${task.id}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className="bg-[#18181B] border border-amber-500/30 shadow-lg shadow-amber-500/10 rounded-xl p-4 w-80 pointer-events-auto relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg shrink-0">
                <BellRing className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex-1 min-w-0 pr-6">
                <p className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-0.5">Upcoming Task Focus</p>
                <p className="text-sm font-medium text-white line-clamp-2 leading-snug">{task.title}</p>
              </div>
              <button 
                onClick={() => dismissAlert(task.id)}
                className="absolute top-3 right-3 text-[#A1A1AA] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
