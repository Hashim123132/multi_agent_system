import { useState, useRef, useEffect } from "react";
import { sendMessage } from "@/lib/api";
import MessageBubble from "./MessageBubble";
import AgentSteps from "./AgentSteps";
import { motion, AnimatePresence } from "framer-motion";
import { GlobeHemisphereWest, ChartLineUp, Microscope, ArrowUp } from "@phosphor-icons/react";

export default function Chat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [steps, setSteps] = useState<Array<{ agent?: string; action?: string; input?: string; output?: string }>>([]);
  const [isFocused, setIsFocused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, steps]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");

    try {
      const res = await sendMessage(currentInput);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: res.final_answer },
      ]);
      setSteps(res.steps);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "I encountered an error processing your request." },
      ]);
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
      <div className="flex-1 flex flex-col items-center relative z-10 w-full overflow-hidden">
        
        {/* Messages or Empty State */}
        <div ref={scrollRef} className="flex-1 w-full overflow-y-auto overflow-x-hidden scroll-smooth">
          <AnimatePresence mode="wait">
            {messages.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.4, type: "spring" }}
                className="flex flex-col items-center justify-center min-h-full px-8 text-center pt-20 pb-32"
              >
                <h1 className="text-5xl font-bold mb-2 tracking-tighter">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-500">
                    Hello Marcus
                  </span>
                </h1>
                <h2 className="text-4xl font-medium text-zinc-400 mb-16 tracking-tight">How can I help you today?</h2>

                {/* Featured Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                  {/* Card 1 */}
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_8px_32px_0_rgba(0,0,0,0.03)] p-6 rounded-[2rem] text-left cursor-pointer group transition-all"
                  >
                    <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6 text-zinc-900 transition-colors group-hover:bg-zinc-100 border border-zinc-100">
                      <GlobeHemisphereWest weight="duotone" className="text-2xl" />
                    </div>
                    <h3 className="font-bold text-zinc-900 mb-2">What's happen in 24 hours?</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">See what's been happening in the world over the last 24 hours</p>
                  </motion.div>

                  {/* Card 2 */}
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_8px_32px_0_rgba(0,0,0,0.03)] p-6 rounded-[2rem] text-left cursor-pointer group transition-all"
                  >
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 transition-colors group-hover:bg-emerald-100 border border-emerald-100/50">
                      <ChartLineUp weight="duotone" className="text-2xl" />
                    </div>
                    <h3 className="font-bold text-zinc-900 mb-2">Stock market update</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">See what's happening in the stock market in real time</p>
                  </motion.div>

                  {/* Card 3 */}
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_8px_32px_0_rgba(0,0,0,0.03)] p-6 rounded-[2rem] text-left cursor-pointer group transition-all"
                  >
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 transition-colors group-hover:bg-blue-100 border border-blue-100/50">
                      <Microscope weight="duotone" className="text-2xl" />
                    </div>
                    <h3 className="font-bold text-zinc-900 mb-2">Deep economic research</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">See research from experts that we have simplified</p>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center w-full pb-32 pt-8 px-4"
              >
                <div className="w-full max-w-3xl flex flex-col gap-6">
                  {messages.map((msg, i) => (
                    <MessageBubble key={i} message={msg} index={i} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer / Input Area */}
        <footer className="absolute bottom-0 left-0 w-full p-8 flex flex-col items-center gap-4 z-20 bg-gradient-to-t from-white via-white/90 to-transparent pt-12">
          <div className="w-full max-w-3xl relative">
            <motion.div 
              animate={{ 
                boxShadow: isFocused 
                  ? "0 0 0 4px rgba(16, 185, 129, 0.1), 0 8px 32px -4px rgba(0,0,0,0.05)" 
                  : "0 8px 32px -4px rgba(0,0,0,0.05)"
              }}
              className="bg-white/80 backdrop-blur-xl border border-zinc-200/80 rounded-[2rem] p-1.5 flex items-center transition-all"
            >
              <input 
                className="w-full bg-transparent border-none focus:ring-0 px-6 py-3.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none font-medium"
                id="chat-input" 
                placeholder="Ask something.." 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-12 h-12 bg-zinc-950 disabled:bg-zinc-300 disabled:text-zinc-500 text-white rounded-full flex flex-shrink-0 items-center justify-center hover:bg-zinc-800 transition-colors shadow-md"
              >
                <ArrowUp weight="bold" className="text-base" />
              </motion.button>
            </motion.div>
          </div>
          <p className="text-xs text-zinc-400 font-medium tracking-wide">
            Join the valerius community for more insights <a className="text-emerald-500 hover:text-emerald-600 transition-colors ml-1" href="#">Join Discord</a>
          </p>
        </footer>
      </div>

      {/* Agent Steps Side Panel */}
      <AnimatePresence>
        {steps.length > 0 && (
          <AgentSteps steps={steps} />
        )}
      </AnimatePresence>
    </div>
  );
}