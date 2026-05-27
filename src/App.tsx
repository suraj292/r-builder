import { useEffect } from 'react';
import { AppRouter } from './router';
import { useAuthStore } from './store/useAuthStore';
import UpgradeModal from './components/subscription/UpgradeModal';

function App() {
  const fetchUser = useAuthStore(state => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <AppRouter />
  )
}

export default App;
