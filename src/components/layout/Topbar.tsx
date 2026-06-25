import { useState, useEffect } from 'react';
import { Search, ChevronRight, X } from 'lucide-react';
import { useAppStore } from '../../store/AppContext';
import { Pomodoro } from '../../features/pomodoro/Pomodoro';
import { useDebounce } from '../../hooks/useDebounce';

export function Topbar() {
  const { state, dispatch } = useAppStore();
  const [localSearch, setLocalSearch] = useState(state.searchQuery);
  const debouncedSearch = useDebounce(localSearch, 200);

  // Sync debounced term to global store gracefully
  useEffect(() => {
    dispatch({ type: 'SET_SEARCH', payload: debouncedSearch });
  }, [debouncedSearch, dispatch]);

  // Sync from global store if it was cleared externally
  useEffect(() => {
    if (state.searchQuery === '') {
      setLocalSearch('');
    }
  }, [state.searchQuery]);

  const handleClear = () => {
    setLocalSearch('');
    dispatch({ type: 'SET_SEARCH', payload: '' });
  };

  // Global ESC handler to clear search elegantly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClear();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="h-14 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between px-6 bg-[#09090B] shrink-0">
      <div className="flex items-center gap-4">
        <div className="text-sm text-[#A1A1AA] font-medium flex items-center gap-2">
          <span>Projects</span>
          <ChevronRight className="w-3 h-3 opacity-40 text-white" />
          <span className="text-white">Q4 Roadmap</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3 text-[#A1A1AA]" />
          <input 
            type="text" 
            placeholder="Search tasks (⌘K)" 
            className="bg-[#111216] border border-[rgba(255,255,255,0.08)] rounded-md pl-9 pr-8 py-1.5 text-xs w-64 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors text-white placeholder-[#A1A1AA]"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.currentTarget.blur();
                handleClear();
              }
            }}
          />
          {localSearch && (
            <button 
              onClick={handleClear} 
              className="absolute right-2 text-[#A1A1AA] hover:text-white transition-colors"
            >
               <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <Pomodoro />
        <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold h-8 px-4 rounded-md transition-all shadow-lg shadow-blue-600/20 cursor-pointer">Create Task</button>
      </div>
    </header>
  );
}
