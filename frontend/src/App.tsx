import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import AuthUI from './components/Auth';
import Dashboard from './components/Dashboard';

export default function App() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) =>
      setSession(s)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  return session ? <Dashboard /> : <AuthUI />;
}