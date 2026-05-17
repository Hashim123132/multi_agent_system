import { useState, useRef, useEffect } from "react";
import { sendMessage } from "@/lib/api";
import MessageBubble from "./MessageBubble";
import AgentSteps from "./AgentSteps";
import { motion, AnimatePresence } from "framer-motion";
import {
  GlobeHemisphereWest,
  ChartLineUp,
  Microscope,
  ArrowUp,
} from "@phosphor-icons/react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

const SUGGESTED_PROMPTS = [
  "What is the effect of US/Iran war on global stock market?",
  "Compare the economic impact of AI adoption across healthcare, finance, and manufacturing sectors over the next decade",
  "Analyze how climate change policies in the EU, China, and US will affect global energy markets and supply chains",
];

type ChatProps = {
  darkMode?: boolean;
  user: User | null;
  messages: any[];
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  conversationId: string;
};

export default function Chat({
  darkMode = true,
  user,
  messages,
  setMessages,
  conversationId,
}: ChatProps) {
  const [input, setInput] = useState("");
  const [steps, setSteps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [usedPrompts, setUsedPrompts] = useState<Set<number>>(new Set());

  const scrollRef = useRef<HTMLDivElement>(null);

  const greetingName = user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  const handlePromptClick = (prompt: string, index: number) => {
    setInput(prompt);
    setUsedPrompts((prev) => new Set(prev).add(index));
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, steps]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const currentInput = input;
    setInput("");

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: currentInput,
    };

    const aiId = Date.now() + 1;

    // 1. Instant UI update
    setMessages((prev) => [
      ...prev,
      userMessage,
      { id: aiId, role: "ai", content: "" },
    ]);

    setLoading(true);

    try {
      const res = await sendMessage(currentInput);

      const text = res.final_answer;
      let i = 0;

      // 2. Typing effect (real-time feel)
      const interval = setInterval(() => {
        i++;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiId
              ? { ...msg, content: text.slice(0, i) }
              : msg
          )
        );

        if (i >= text.length) {
          clearInterval(interval);
          setLoading(false);
        }
      }, 8);

      setSteps(res.steps || []);

      // Save to Supabase only if logged in
      if (user && conversationId) {
        const { error } = await supabase.from("messages").insert([
          { role: "user", content: currentInput, conversation_id: conversationId, user_id: user.id },
          { role: "ai", content: text, conversation_id: conversationId, user_id: user.id },
        ]);
        if (error) {
          console.error("Supabase insert error:", error.message);
        }
      }
    } catch (error) {
      console.error(error);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiId
            ? { ...msg, content: "Error processing request." }
            : msg
        )
      );

      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden relative">
      <div className="flex-1 flex flex-col items-center w-full overflow-hidden">

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 w-full overflow-y-auto scroll-smooth"
        >
          <AnimatePresence mode="wait">
            {messages.length === 0 ? (
              <motion.div
                className="flex flex-col items-center justify-center min-h-full px-8 text-center pt-20 pb-32"
              >
                <h1 className={`text-5xl font-bold mb-2 tracking-tighter text-transparent bg-clip-text ${
                  darkMode
                    ? "bg-gradient-to-r from-white to-zinc-400"
                    : "bg-gradient-to-r from-zinc-900 to-zinc-500"
                }`}>
                  Hello {greetingName}
                </h1>

                <h2
                  className={`text-4xl font-medium mb-16 tracking-tight ${
                    darkMode ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  How can I help you today?
                </h2>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                  <Card icon={<GlobeHemisphereWest />} title="What's happening?" darkMode={darkMode} />
                  <Card icon={<ChartLineUp />} title="Stock updates" darkMode={darkMode} />
                  <Card icon={<Microscope />} title="Deep research" darkMode={darkMode} />
                </div>

                {/* Suggested prompts */}
                <div className="flex flex-col gap-3 w-full max-w-4xl mt-8">
                  {SUGGESTED_PROMPTS.map((prompt, index) => (
                    <AnimatePresence key={index}>
                      {!usedPrompts.has(index) && (
                        <motion.button
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                          onClick={() => handlePromptClick(prompt, index)}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition-all cursor-pointer ${
                            darkMode
                              ? "bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-700/50 hover:text-white"
                              : "bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
                          }`}
                        >
                          {prompt}
                        </motion.button>
                      )}
                    </AnimatePresence>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div className="flex flex-col items-center w-full pb-32 pt-8 px-4">
                <div className="w-full max-w-3xl flex flex-col gap-6">
                  {messages.map((msg, i) => (
                    <MessageBubble key={msg.id || i} message={msg} index={i} darkMode={darkMode} />
                  ))}

                  {loading && (
                    <div className={`text-sm px-4 ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                      Thinking...
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input */}
        <footer className="absolute bottom-0 left-0 w-full p-8">
          <div className="w-full max-w-3xl mx-auto">
            <div className={`flex items-center rounded-2xl p-2 ${
              darkMode ? "bg-zinc-800/80" : "bg-zinc-100/80"
            }`}>
              <input
                className={`flex-1 bg-transparent outline-none px-4 text-sm ${
                  darkMode ? "text-white placeholder-zinc-500" : "text-zinc-900 placeholder-zinc-400"
                }`}
                placeholder="Ask something..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />

              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  input.trim()
                    ? darkMode
                      ? "bg-white text-black hover:bg-zinc-200"
                      : "bg-zinc-900 text-white hover:bg-zinc-800"
                    : darkMode
                      ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                      : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                }`}
              >
                <ArrowUp weight="bold" />
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Agent steps */}
      <AnimatePresence>
        {steps.length > 0 && (
          <AgentSteps steps={steps} darkMode={darkMode} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* helper card */
function Card({ icon, title, darkMode }: any) {
  return (
    <div
      className={`p-6 rounded-2xl border ${
        darkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-zinc-200"
      }`}
    >
      <div className="mb-4">{icon}</div>
      <h3 className={`font-bold ${darkMode ? "text-white" : "text-zinc-900"}`}>{title}</h3>
    </div>
  );
}