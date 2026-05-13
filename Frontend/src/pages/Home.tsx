import { useState, useEffect } from "react";
import Chat from "@/components/Chat";
import { supabase } from "@/lib/supabase";
import {
  Robot,
  MagnifyingGlass,
  Compass,
  BookOpen,
  Folder,
  ClockCounterClockwise,
  ChatCircle,
  ArrowUpRight,
  CaretDown,
  Sun,
  Moon,
  Plus,
} from "@phosphor-icons/react";

const Home = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);

  const startNewChat = () => {
    setMessages([]);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Fetch error:", error.message);
        return;
      }

      if (data) {
        setMessages(
          data.map((msg) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
          }))
        );
      }
    };

    fetchMessages();
  }, []);

  return (
    <div
      className={`flex min-h-[100dvh] w-full p-4 gap-4 overflow-hidden font-sans transition-colors duration-300 ${
        darkMode ? "bg-zinc-950" : "bg-zinc-50"
      }`}
    >
      {/* Sidebar */}
      <aside
        className={`w-64 flex flex-col flex-shrink-0 relative z-20 transition-colors duration-300 ${
          darkMode ? "bg-zinc-900/50" : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-3 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-950 rounded-lg flex items-center justify-center text-white">
              <Robot weight="fill" className="text-lg" />
            </div>
            <span
              className={`font-bold text-lg ${
                darkMode ? "text-white" : "text-zinc-900"
              }`}
            >
              Valerio.ai
            </span>
          </div>
        </div>

        {/* NEW CHAT */}
        <div className="px-2 mb-3">
          <button
            onClick={startNewChat}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all ${
              darkMode
                ? "bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            <Plus weight="bold" />
            New Chat
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 space-y-1 px-2">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlass
                weight="bold"
                className={darkMode ? "text-zinc-500" : "text-zinc-400"}
              />
            </div>
            <input
              className={`block w-full pl-10 pr-3 py-2 rounded-xl text-sm transition-all shadow-sm ${
                darkMode
                  ? "bg-zinc-800 text-white placeholder-zinc-500"
                  : "bg-white text-zinc-900 placeholder-zinc-400"
              }`}
              placeholder="Search chat"
              type="text"
            />
          </div>

          <div className="pt-6 space-y-1">
            <a className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl text-zinc-300">
              <Compass weight="fill" className="text-emerald-500" /> Explore
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl text-zinc-500">
              <BookOpen weight="fill" /> Library
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl text-zinc-500">
              <Folder weight="fill" /> Files
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl text-zinc-500">
              <ClockCounterClockwise weight="fill" /> History
            </a>
          </div>

          {/* RECENT */}
          <div className="pt-8 px-3">
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3 text-zinc-500">
              Recent Chats
            </h3>

            <ul className="space-y-3">
              {messages.filter((m) => m.role === "user").length > 0 && (
                <li>
                  <a className="flex items-center gap-3 text-sm text-zinc-500 truncate">
                    <ChatCircle weight="bold" />
                    {messages
                      .find((m) => m.role === "user")
                      ?.content?.slice(0, 30)}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </nav>

        {/* UPGRADE */}
        <div className="px-2 pb-2">
          <div className="rounded-2xl p-5 bg-zinc-900 border border-zinc-800">
            <div className="text-sm font-bold text-zinc-200 mb-2">
              Upgrade to PRO
            </div>
            <p className="text-[11px] text-zinc-400 mb-3">
              Unlock better AI features and uploads.
            </p>
            <a className="text-xs font-bold text-zinc-300 flex justify-between">
              Learn More <ArrowUpRight />
            </a>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main
        className={`flex-1 rounded-[2.5rem] border flex flex-col overflow-hidden ${
          darkMode
            ? "bg-zinc-900 border-zinc-800"
            : "bg-white border-zinc-200/50"
        }`}
      >
        <header className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-3">
            <button
              className={`px-3 py-1.5 rounded-xl text-sm ${
                darkMode
                  ? "bg-zinc-800 text-zinc-300"
                  : "bg-zinc-100 text-zinc-700"
              }`}
            >
              Valerio V 1.2 <CaretDown className="inline" />
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl"
            >
              {darkMode ? (
                <Sun weight="fill" />
              ) : (
                <Moon weight="fill" />
              )}
            </button>
          </div>

          <div className="text-right">
            <p className="text-sm font-bold text-white">Hashim Umar</p>
            <p className="text-xs text-zinc-500">Youremail@gmail.com</p>
          </div>
        </header>

        <Chat
          darkMode={darkMode}
          messages={messages}
          setMessages={setMessages}
        />
      </main>
    </div>
  );
};

export default Home;