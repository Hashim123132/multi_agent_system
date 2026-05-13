import { ChatCircle } from "@phosphor-icons/react";

interface Message {
  role: string;
  content: string;
}

interface RecentChatsProps {
  messages: Message[];
  darkMode: boolean;
}

export default function RecentChats({ messages, darkMode }: RecentChatsProps) {
  const userMessages = messages.filter((msg) => msg.role === "user");

  return (
    <div className="pt-8 px-3">
      <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-3 transition-colors duration-300 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>
        Recent Chats
      </h3>
      <ul className="space-y-3">
        {userMessages.length > 0 ? (
          userMessages.slice(0, 10).map((msg, idx) => (
            <li key={idx}>
              <a
                className={`flex items-center gap-3 text-sm transition-colors truncate ${
                  darkMode ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-500 hover:text-zinc-900"
                }`}
                href="#"
              >
                <ChatCircle
                  weight="bold"
                  className={darkMode ? "text-zinc-600 flex-shrink-0" : "text-zinc-400 flex-shrink-0"}
                />
                {msg.content.slice(0, 30)}...
              </a>
            </li>
          ))
        ) : (
          <>
            <li>
              <a
                className={`flex items-center gap-3 text-sm transition-colors truncate ${
                  darkMode ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-500 hover:text-zinc-900"
                }`}
                href="#"
              >
                <ChatCircle
                  weight="bold"
                  className={darkMode ? "text-zinc-600 flex-shrink-0" : "text-zinc-400 flex-shrink-0"}
                />
                Brainstorming small bussine...
              </a>
            </li>
            <li>
              <a
                className={`flex items-center gap-3 text-sm transition-colors truncate ${
                  darkMode ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-500 hover:text-zinc-900"
                }`}
                href="#"
              >
                <ChatCircle
                  weight="bold"
                  className={darkMode ? "text-zinc-600 flex-shrink-0" : "text-zinc-400 flex-shrink-0"}
                />
                The history of roman empire
              </a>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}