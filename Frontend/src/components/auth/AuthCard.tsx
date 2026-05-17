import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AuthCard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-slate-200 dark:bg-zinc-950 flex items-center justify-center px-4">
      <div className="relative w-full max-w-sm rounded-[32px] bg-white/80 dark:bg-zinc-900/80 px-6 py-10 shadow-2xl">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-6 top-6 rounded-full bg-white dark:bg-zinc-800 p-2 shadow hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} className="text-zinc-700 dark:text-zinc-300" />
        </button>

        {children}
      </div>
    </main>
  );
}
