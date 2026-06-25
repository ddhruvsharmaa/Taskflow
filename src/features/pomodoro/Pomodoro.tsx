import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function Pomodoro() {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound or notification logic would go here
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const circumference = 2 * Math.PI * 16;
  const strokeDashoffset = circumference - (timeLeft / (25 * 60)) * circumference;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
          isActive 
            ? "border-purple-500 text-purple-400 bg-purple-500/10" 
            : "border-[rgba(255,255,255,0.08)] text-[#A1A1AA] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
        )}
      >
        <Clock className="w-3.5 h-3.5" />
        <span>{timeString}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-12 right-0 w-64 bg-[#18181B] border border-[rgba(255,255,255,0.08)] rounded-xl shadow-2xl p-4 z-50 overflow-hidden"
          >
             <div className="text-sm font-semibold tracking-tight text-white mb-4">Pomodoro</div>
             
             <div className="flex flex-col items-center justify-center py-4 relative">
                {/* Visual Timer Circle */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                   <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="56" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                      <circle 
                         cx="64" cy="64" r="56" fill="transparent" 
                         stroke="#8B5CF6" strokeWidth="4" 
                         strokeDasharray={circumference * 3.5} 
                         strokeDashoffset={strokeDashoffset * 3.5}
                         strokeLinecap="round"
                         className="transition-all duration-1000 ease-linear"
                      />
                   </svg>
                   <span className="absolute text-3xl font-mono tracking-tighter font-light text-white">{timeString}</span>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button 
                    onClick={toggleTimer}
                    className="w-10 h-10 rounded-full bg-[#111216] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-white hover:border-purple-500 hover:text-purple-400 transition-colors"
                  >
                     {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <button 
                    onClick={resetTimer}
                    className="w-10 h-10 rounded-full bg-[#111216] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#A1A1AA] hover:text-white transition-colors"
                  >
                     <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
