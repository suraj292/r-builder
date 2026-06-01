import { useEffect } from 'react';
import { AppRouter } from './router';
import { useAuthStore } from './store/useAuthStore';
import { useSystemStore } from './store/useSystemStore';

function App() {
  const fetchUser = useAuthStore(state => state.fetchUser);
  const fetchSystemSettings = useSystemStore(state => state.fetchSettings);

  useEffect(() => {
    fetchUser();
    fetchSystemSettings();
  }, [fetchUser, fetchSystemSettings]);

  return (
    <AppRouter />
  )
}

export default App;
