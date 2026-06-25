import { AppProvider } from './store/AppContext';
import { MainLayout } from './components/layout/MainLayout';

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
