import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import AuthUI from './components/Auth';

function Dashboard() {
  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-end">
        <button
          onClick={() => supabase.auth.signOut()}
          className="px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
        >
          Log out
        </button>
      </div>
      <h1 className="text-2xl font-bold mt-6">Welcome to 75Commit</h1>
      <p className="text-sm text-gray-600">You’re logged in. We’ll add the challenge form next.</p>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  return session ? <Dashboard /> : <AuthUI />;
}