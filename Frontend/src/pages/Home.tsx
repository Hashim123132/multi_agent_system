import Chat from "@/components/Chat";
import { 
  Robot, 
  MagnifyingGlass, 
  Compass, 
  BookOpen, 
  Folder, 
  ClockCounterClockwise,
  ChatCircle,
  ArrowUpRight,
  CaretDown
} from "@phosphor-icons/react";

const Home = () => {
  return (
    <div className="flex min-h-[100dvh] w-full p-4 gap-4 bg-zinc-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col flex-shrink-0 relative z-20">
        {/* Logo Section */}
        <div className="flex items-center justify-between px-4 py-3 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-950 rounded-lg flex items-center justify-center text-white">
              <Robot weight="fill" className="text-lg" />
            </div>
            <span className="font-bold text-lg tracking-tight text-zinc-900">Valerio.ai</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 px-2">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlass weight="bold" className="text-zinc-400 text-sm" />
            </div>
            <input 
              className="block w-full pl-10 pr-3 py-2 border-none bg-white rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-zinc-400 shadow-sm" 
              placeholder="Search chat" 
              type="text" 
            />
          </div>

          <div className="pt-6 space-y-1">
            <a className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-700 bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-zinc-100 transition-all hover:scale-[0.98] active:scale-[0.95]" href="#">
              <Compass weight="fill" className="text-emerald-500 text-lg" /> Explore
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/50 rounded-xl transition-all hover:scale-[0.98] active:scale-[0.95]" href="#">
              <BookOpen weight="fill" className="text-lg" /> Library
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/50 rounded-xl transition-all hover:scale-[0.98] active:scale-[0.95]" href="#">
              <Folder weight="fill" className="text-lg" /> Files
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/50 rounded-xl transition-all hover:scale-[0.98] active:scale-[0.95]" href="#">
              <ClockCounterClockwise weight="fill" className="text-lg" /> History
            </a>
          </div>

          {/* Recent Chats */}
          <div className="pt-8 px-3">
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Recent Chats</h3>
            <ul className="space-y-3">
              <li>
                <a className="flex items-center gap-3 text-sm text-zinc-500 hover:text-zinc-900 transition-colors truncate" href="#">
                  <ChatCircle weight="bold" className="text-zinc-400 flex-shrink-0" />
                  Brainstorming small bussine...
                </a>
              </li>
              <li>
                <a className="flex items-center gap-3 text-sm text-zinc-500 hover:text-zinc-900 transition-colors truncate" href="#">
                  <ChatCircle weight="bold" className="text-zinc-400 flex-shrink-0" />
                  The history of roman empire
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* Upgrade Card */}
        <div className="px-2 pb-2">
          <div className="bg-gradient-to-br from-zinc-100 to-zinc-50 rounded-2xl p-5 relative overflow-hidden border border-zinc-200">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold text-zinc-800">Upgrade to</span>
                <span className="bg-zinc-950 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">PRO</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed mb-4">Upgrade for image uploads, smarter AI, and more Pro Search.</p>
              <a className="text-xs font-bold flex items-center justify-between text-zinc-900 hover:underline" href="#">
                Learn More <ArrowUpRight weight="bold" className="text-[10px]" />
              </a>
            </div>
            {/* Subtle glow */}
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-zinc-200/50 flex flex-col relative overflow-hidden">
        {/* Subtle radial gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-50/60 to-transparent -translate-y-1/2 translate-x-1/3 opacity-70 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-50/60 to-transparent translate-y-1/3 -translate-x-1/4 opacity-70 pointer-events-none"></div>
        
        {/* Top Navigation */}
        <header className="flex items-center justify-between px-8 py-6 z-10">
          <div className="relative">
            <button className="bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-zinc-100 transition-colors shadow-sm text-zinc-700">
              Valerio V 1.2 <CaretDown weight="bold" className="text-[10px] text-zinc-400" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-zinc-900">Marcus Aurelius</p>
              <p className="text-xs text-zinc-400">Marcaurel@gmail.com</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center">
              <img alt="Profile" className="w-full h-full object-cover" src="https://picsum.photos/seed/marcus/100/100"/>
            </div>
          </div>
        </header>

        {/* Chat Component takes over the rest */}
        <Chat />
      </main>
    </div>
  );
};

export default Home;