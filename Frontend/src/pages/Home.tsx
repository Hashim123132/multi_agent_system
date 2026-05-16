import { useState, useEffect, useRef } from "react";
import Chat from "@/components/Chat";
import RecentChats, { type StoredChat } from "@/components/RecentChats";
import { supabase } from "@/lib/supabase";
import {
  Robot,
  MagnifyingGlass,
  Compass,
  BookOpen,
  Folder,
  ClockCounterClockwise,
  ArrowUpRight,
  CaretDown,
  Sun,
  Moon,
  Plus,
} from "@phosphor-icons/react";

const STORAGE_KEY = "valerio_recent_chats";
const LEGACY_CID = "__legacy__";

const Home = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [conversationId, setConversationId] = useState<string>("");
  const [recentConversations, setRecentConversations] = useState<StoredChat[]>([]);
  const conversationSavedRef = useRef(new Set<string>());

  const persistConversation = (id: string, title: string) => {
    const chat: StoredChat = {
      id,
      title: title.slice(0, 50),
      timestamp: Date.now(),
    };
    setRecentConversations((prev) => {
      const updated = [chat, ...prev.filter((c) => c.id !== id)].slice(0, 20);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const saveMessagesLocally = (id: string) => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(`valerio_chat_${id}`, JSON.stringify(messages));
      } catch {}
    }
  };

  const startNewChat = () => {
    const firstUserMsg = messages.find((m) => m.role === "user");
    if (firstUserMsg && conversationId) {
      persistConversation(conversationId, firstUserMsg.content);
      saveMessagesLocally(conversationId);
    }
    setMessages([]);
    setConversationId(crypto.randomUUID());
  };

  const deleteConversation = async (id: string) => {
    if (id === LEGACY_CID) return;

    // Remove from localStorage + state
    setRecentConversations((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Remove saved messages from localStorage
    try { localStorage.removeItem(`valerio_chat_${id}`); } catch {}

    // Delete from Supabase
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("conversation_id", id);

    if (error) {
      // Column might not exist — delete all instead (single bucket, no grouping)
      console.warn("conversation_id column missing, deleting all messages:", error.message);
      await supabase.from("messages").delete().not("id", "is", null);
    }

    // If currently viewing this conversation, start fresh
    if (id === conversationId) {
      setMessages([]);
      setConversationId(crypto.randomUUID());
    }
  };

  const loadConversation = async (id: string) => {
    const firstUserMsg = messages.find((m) => m.role === "user");
    if (firstUserMsg && conversationId) {
      persistConversation(conversationId, firstUserMsg.content);
      saveMessagesLocally(conversationId);
    }
    setConversationId(id);

    // Try loading messages filtered by conversation_id
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      setMessages(
        data.map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
        }))
      );
      return;
    }

    // Fallback: load from localStorage (column might not exist yet)
    const saved = localStorage.getItem(`valerio_chat_${id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      } catch {}
    }
  };

  useEffect(() => {
    conversationSavedRef.current = new Set(recentConversations.map((c) => c.id));
  }, [recentConversations]);

  useEffect(() => {
    if (!conversationId || conversationSavedRef.current.has(conversationId)) return;
    const firstUserMsg = messages.find((m) => m.role === "user");
    if (!firstUserMsg) return;
    persistConversation(conversationId, firstUserMsg.content);
    saveMessagesLocally(conversationId);
  }, [messages, conversationId]);

  useEffect(() => {
    const init = async () => {
      let localChats: StoredChat[] = [];
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) localChats = JSON.parse(stored);
      } catch {}

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Fetch error:", error.message);
        setRecentConversations(localChats);
        setConversationId(crypto.randomUUID());
        return;
      }

      if (data && data.length > 0) {
        const dbConversations = new Map<string, StoredChat>();
        for (const msg of data) {
          const cid = msg.conversation_id || LEGACY_CID;
          if (!dbConversations.has(cid)) {
            dbConversations.set(cid, {
              id: cid,
              title:
                msg.role === "user"
                  ? msg.content.slice(0, 50)
                  : "Untitled Chat",
              timestamp: new Date(msg.created_at || Date.now()).getTime(),
            });
          }
        }

        const merged = new Map<string, StoredChat>();
        for (const [, chat] of dbConversations) merged.set(chat.id, chat);
        for (const chat of localChats) merged.set(chat.id, chat);

        const sorted = Array.from(merged.values())
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 20);

        setRecentConversations(sorted);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
        } catch {}

        const latestId = sorted[0].id;
        setConversationId(latestId);
        setMessages(
          data
            .filter((m) => (m.conversation_id || LEGACY_CID) === latestId)
            .map((msg) => ({ id: msg.id, role: msg.role, content: msg.content }))
        );
      } else {
        setRecentConversations(localChats);
        setConversationId(crypto.randomUUID());
      }
    };

    init();
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
          <RecentChats
            conversations={recentConversations}
            darkMode={darkMode}
            onSelect={loadConversation}
            onDelete={deleteConversation}
          />
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
          conversationId={conversationId}
        />
      </main>
    </div>
  );
};

export default Home;