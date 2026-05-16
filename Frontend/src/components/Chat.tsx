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

type ChatProps = {
  darkMode?: boolean;
  messages: any[];
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  conversationId: string;
};

export default function Chat({
  darkMode = true,
  messages,
  setMessages,
  conversationId,
}: ChatProps) {
  const [input, setInput] = useState("");
  const [steps, setSteps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

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

      // 3. Save to Supabase (background)
      let dbError;
      if (conversationId) {
        const result = await supabase.from("messages").insert([
          { role: "user", content: currentInput, conversation_id: conversationId },
          { role: "ai", content: text, conversation_id: conversationId },
        ]);
        dbError = result.error;
      }

      if (!conversationId || dbError) {
        const result = await supabase.from("messages").insert([
          { role: "user", content: currentInput },
          { role: "ai", content: text },
        ]);
        dbError = result.error;
      }

      if (dbError) {
        console.error("Supabase insert error:", dbError.message, dbError.details, dbError.hint);
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
                <h1 className="text-5xl font-bold mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
                  Hello Hashim
                </h1>

                <h2
                  className={`text-4xl font-medium mb-16 tracking-tight ${
                    darkMode ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  How can I help you today?
                </h2>

                {/* Cards (unchanged UI) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                  <Card icon={<GlobeHemisphereWest />} title="What's happening?" darkMode={darkMode} />
                  <Card icon={<ChartLineUp />} title="Stock updates" darkMode={darkMode} />
                  <Card icon={<Microscope />} title="Deep research" darkMode={darkMode} />
                </div>
              </motion.div>
            ) : (
              <motion.div className="flex flex-col items-center w-full pb-32 pt-8 px-4">
                <div className="w-full max-w-3xl flex flex-col gap-6">
                  {messages.map((msg, i) => (
                    <MessageBubble key={msg.id || i} message={msg} index={i} />
                  ))}

                  {loading && (
                    <div className="text-sm text-zinc-400 px-4">
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
            <div className="flex items-center bg-white/80 rounded-2xl p-2">
              <input
                className="flex-1 bg-transparent outline-none px-4 text-sm"
                placeholder="Ask something..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />

              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"
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
      <h3 className="font-bold">{title}</h3>
    </div>
  );
}