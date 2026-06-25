import { useState, FormEvent, useRef } from 'react';
import { useAppStore } from '../../store/AppContext';
import { Sparkles } from 'lucide-react';

export function BottomCommandBar() {
  const { dispatch } = useAppStore();
  const [taskInput, setTaskInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNaturalLanguageSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      const res = await fetch('/api/ai/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: taskInput })
      });
      const data = await res.json();
      
      const newTask = {
        id: crypto.randomUUID(),
        title: data.title || taskInput,
        priority: data.priority || 'Medium',
        tags: data.tags || [],
        dueDate: data.dueDate || null,
        status: 'Todo' as const,
        createdAt: new Date().toISOString()
      };
      
      dispatch({ type: 'ADD_TASK', payload: newTask });
      setTaskInput('');
    } catch (err) {
      console.error(err);
      dispatch({
        type: 'ADD_TASK',
        payload: {
          id: crypto.randomUUID(),
          title: taskInput,
          priority: 'Medium',
          tags: [],
          dueDate: null,
          status: 'Todo',
          createdAt: new Date().toISOString()
        }
      });
      setTaskInput('');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="px-6 py-4 bg-[#09090B] border-t border-[rgba(255,255,255,0.08)] shrink-0 z-10 w-full">
      <form onSubmit={handleNaturalLanguageSubmit} className="relative flex items-center group w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
        <div className="relative flex items-center w-full bg-[#18181B] border border-[rgba(255,255,255,0.08)] group-focus-within:border-blue-500/40 rounded-xl p-3 shadow-inner transition-colors">
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center mr-3 shrink-0">
            {isProcessing ? (
               <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
            ) : (
               <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3.005 3.005 0 013.75-2.906z"></path></svg>
            )}
          </div>
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Type a command... 'Schedule review with @James next Tuesday at 3pm'" 
            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-[#A1A1AA]"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            disabled={isProcessing}
          />
          <div className="flex items-center gap-2 ml-3 shrink-0">
             <span className="text-[10px] font-bold text-[#A1A1AA] bg-[rgba(255,255,255,0.05)] px-1.5 py-0.5 rounded border border-[rgba(255,255,255,0.05)]">ENTER</span>
          </div>
        </div>
      </form>
    </div>
  );
}
