import { supabase } from "../lib/supabaseClient";
import CreateChallenge from "./CreateChallenge"; // ✅ import the actual component

export default function Dashboard() {
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

      <h1 className="text-2xl font-bold mt-6 mb-4">Welcome to 75Commit</h1>
      
      <CreateChallenge />
    </div>
  );
}