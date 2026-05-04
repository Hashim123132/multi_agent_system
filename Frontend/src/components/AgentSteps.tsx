import { motion } from "framer-motion";
import { TerminalWindow, Cpu } from "@phosphor-icons/react";

export default function AgentSteps({ steps = [] }: { steps?: Array<{ agent?: string; action?: string; input?: string; output?: string }> }) {
  return (
    <motion.div 
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 384, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="flex-shrink-0 bg-zinc-50/80 backdrop-blur-xl border-l border-zinc-200/60 overflow-hidden flex flex-col h-full z-20"
    >
      <div className="w-96 flex flex-col h-full">
        <header className="px-6 py-5 border-b border-zinc-200/60 flex items-center gap-3 bg-white/50">
          <div className="w-8 h-8 rounded-lg bg-zinc-200/50 text-zinc-700 flex items-center justify-center border border-zinc-300/50">
            <TerminalWindow weight="duotone" className="text-lg" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-900">Agent Debug Panel</h2>
            <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Live Execution Log</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {steps.map((step, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              className="bg-white border border-zinc-200/60 rounded-2xl p-4 shadow-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/20 group-hover:bg-emerald-500 transition-colors"></div>
              
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-zinc-100">
                <Cpu weight="fill" className="text-zinc-400" />
                <span className="text-xs font-bold text-zinc-700">{step.agent}</span>
                <span className="ml-auto text-[10px] font-mono text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">{step.action}</span>
              </div>
              
              <div className="space-y-3">
                {step.input && (
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Input</span>
                    <p className="text-xs text-zinc-600 font-mono bg-zinc-50 p-2 rounded-lg border border-zinc-100 break-words">
                      {step.input}
                    </p>
                  </div>
                )}
                {step.output && (
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Output</span>
                    <p className="text-xs text-zinc-800 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/50 break-words leading-relaxed">
                      {step.output}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}