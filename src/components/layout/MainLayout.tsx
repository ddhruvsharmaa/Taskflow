import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { BottomCommandBar } from './BottomCommandBar';
import { TaskList } from '../../features/tasks/TaskList';
import { BoardView } from '../../features/board/BoardView';
import { Dashboard } from '../../features/dashboard/Dashboard';
import { UpcomingAlerts } from '../../features/notifications/UpcomingAlerts';
import { useAppStore } from '../../store/AppContext';

export function MainLayout() {
  const { state } = useAppStore();
  
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#09090B] font-sans text-white select-none">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-[#09090B]">
        <Topbar />
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
          {state.currentView === 'List' && <TaskList />}
          {state.currentView === 'Board' && <BoardView />}
          {state.currentView === 'Dashboard' && <Dashboard />}
        </div>
        <BottomCommandBar />
      </main>
      <UpcomingAlerts />
    </div>
  );
}
