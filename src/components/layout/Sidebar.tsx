import { LayoutDashboard, CheckSquare, Kanban, Clock, MoreHorizontal, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/AppContext';
import { ViewType } from '../../types';

export function Sidebar() {
  const { state, dispatch } = useAppStore();

  const menuItems = [
    { id: 'Dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'List' as ViewType, label: 'All Tasks', icon: CheckSquare, count: state.tasks.length },
    { id: 'Board' as ViewType, label: 'Board', icon: Kanban },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-[rgba(255,255,255,0.08)] bg-[#111216] flex flex-col z-20 h-full">
      <div className="p-6 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#3B82F6] to-[#A855F7] flex items-center justify-center shadow-lg shadow-blue-500/20">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <span className="font-semibold tracking-tight text-lg text-white">TaskFlow</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2 px-2 mt-2">Navigation</div>
        
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => dispatch({ type: 'SET_VIEW', payload: item.id })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
              state.currentView === item.id 
                ? 'bg-[rgba(255,255,255,0.05)] text-white' 
                : 'text-[#A1A1AA] hover:bg-[rgba(255,255,255,0.03)] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4 opacity-70" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            {item.count !== undefined && (
               <span className="bg-[rgba(255,255,255,0.08)] px-1.5 py-0.5 rounded text-[10px] text-white font-medium">{item.count}</span>
            )}
          </button>
        ))}

        <div className="pt-8 text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2 px-2 flex justify-between items-center group cursor-pointer hover:text-white transition-colors">
          <span>Projects</span>
          <MoreHorizontal className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="space-y-1">
          {state.projects.map((project) => (
            <div key={project.id} className="flex items-center gap-3 px-3 py-2 text-[#A1A1AA] hover:text-white cursor-pointer rounded-md hover:bg-[rgba(255,255,255,0.02)] transition-colors">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color, boxShadow: `0 0 10px ${project.color}80` }}></div>
              <span className="text-sm font-medium truncate">{project.name}</span>
            </div>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-[rgba(255,255,255,0.08)] mt-auto bg-[#111216]">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-colors">
          <div className="w-8 h-8 rounded-full bg-[#18181B] border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[11px] font-bold text-blue-400">DK</div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-white truncate">Dhruv K.</span>
            <span className="text-[10px] text-[#A1A1AA] truncate">Staff Engineer</span>
          </div>
          <ChevronRight className="w-4 h-4 ml-auto text-[#A1A1AA]" />
        </div>
      </div>
    </aside>
  );
}
