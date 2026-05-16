import { ChatCircle, X } from "@phosphor-icons/react";

export interface StoredChat {
  id: string;
  title: string;
  timestamp: number;
}

interface RecentChatsProps {
  conversations: StoredChat[];
  darkMode: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function RecentChats({ conversations, darkMode, onSelect, onDelete }: RecentChatsProps) {
  const sorted = [...conversations].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="pt-8 px-3">
      <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-3 transition-colors duration-300 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>
        Recent Chats
      </h3>
      <ul className="space-y-3">
        {sorted.length > 0 ? (
          sorted.map((chat) => (
            <li key={chat.id} className="group flex items-center">
              <button
                onClick={() => onSelect(chat.id)}
                className={`flex items-center gap-3 text-sm transition-colors truncate flex-1 text-left ${
                  darkMode ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                <ChatCircle
                  weight="bold"
                  className={darkMode ? "text-zinc-600 flex-shrink-0" : "text-zinc-400 flex-shrink-0"}
                />
                {chat.title.length > 30 ? chat.title.slice(0, 30) + "..." : chat.title}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(chat.id); }}
                className={`opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded ${
                  darkMode ? "text-zinc-600 hover:text-red-400 hover:bg-zinc-800" : "text-zinc-400 hover:text-red-500 hover:bg-zinc-200"
                }`}
                title="Delete chat"
              >
                <X weight="bold" size={12} />
              </button>
            </li>
          ))
        ) : (
          <>
            <li>
              <button className={`flex items-center gap-3 text-sm transition-colors truncate w-full text-left ${
                darkMode ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-500 hover:text-zinc-900"
              }`}>
                <ChatCircle weight="bold" className={darkMode ? "text-zinc-600 flex-shrink-0" : "text-zinc-400 flex-shrink-0"} />
                Brainstorming small bussine...
              </button>
            </li>
            <li>
              <button className={`flex items-center gap-3 text-sm transition-colors truncate w-full text-left ${
                darkMode ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-500 hover:text-zinc-900"
              }`}>
                <ChatCircle weight="bold" className={darkMode ? "text-zinc-600 flex-shrink-0" : "text-zinc-400 flex-shrink-0"} />
                The history of roman empire
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
