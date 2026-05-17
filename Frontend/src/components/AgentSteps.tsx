import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TerminalWindow, Cpu, X } from "@phosphor-icons/react";

type Step = {
  agent?: string;
  action?: string;
  input?: string;
  output?: string;
};

type Props = {
  steps?: Step[];
  darkMode?: boolean;
};

export default function AgentSteps({
  steps = [],
  darkMode = true,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 🔘 TOGGLE BUTTON */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`fixed right-4 bottom-4 z-30 p-3 rounded-full shadow-lg transition ${
          darkMode
            ? "bg-zinc-800 text-white hover:bg-zinc-700"
            : "bg-white text-zinc-900 hover:bg-zinc-100"
        }`}
      >
        <TerminalWindow size={20} />
      </button>

      {/* PANEL */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className={`fixed right-0 top-0 h-full w-96 z-20 flex flex-col backdrop-blur-xl border-l overflow-hidden shadow-2xl ${
              darkMode
                ? "bg-zinc-900/80 border-zinc-800"
                : "bg-zinc-50/80 border-zinc-200/60"
            }`}
          >
            {/* HEADER */}
            <header
              className={`px-6 py-5 border-b flex items-center gap-3 ${
                darkMode
                  ? "border-zinc-800 bg-zinc-800/50"
                  : "border-zinc-200/60 bg-white/50"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                  darkMode
                    ? "bg-zinc-700/50 text-zinc-400 border-zinc-600/50"
                    : "bg-zinc-200/50 text-zinc-700 border-zinc-300/50"
                }`}
              >
                <TerminalWindow weight="duotone" />
              </div>

              <div>
                <h2 className={`text-sm font-bold ${darkMode ? "text-white" : "text-zinc-900"}`}>
                  Agent Debug Panel
                </h2>
                <p className={`text-[10px] uppercase tracking-wider font-bold ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                  Live Execution Log
                </p>
              </div>

              {/* CLOSE BUTTON */}
              <button
                onClick={() => setOpen(false)}
                className={`ml-auto p-1 rounded transition-colors cursor-pointer ${
                  darkMode ? "hover:bg-zinc-700/20 text-zinc-400" : "hover:bg-zinc-200/50 text-zinc-500"
                }`}
              >
                <X size={16} />
              </button>
            </header>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`border rounded-2xl p-4 relative overflow-hidden ${
                    darkMode
                      ? "bg-zinc-800/50 border-zinc-700/60"
                      : "bg-white border-zinc-200/60"
                  }`}
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/30" />

                  <div className={`flex items-center gap-2 mb-3 pb-3 border ${
                    darkMode ? "border-zinc-700" : "border-zinc-200"
                  }`}>
                    <Cpu weight="fill" className={darkMode ? "text-zinc-500" : "text-zinc-400"} />
                    <span className={`text-xs font-bold ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                      {step.agent}
                    </span>

                    <span className={`ml-auto text-[10px] px-2 py-0.5 rounded font-mono ${
                      darkMode ? "bg-zinc-700 text-zinc-400" : "bg-zinc-200 text-zinc-600"
                    }`}>
                      {step.action}
                    </span>
                  </div>

                  {step.input && (
                    <p className={`text-xs font-mono p-2 rounded mb-2 ${
                      darkMode ? "bg-zinc-700/40 text-zinc-400" : "bg-zinc-100 text-zinc-600"
                    }`}>
                      {step.input}
                    </p>
                  )}

                  {step.output && (
                    <p className={`text-xs p-2 rounded border ${
                      darkMode
                        ? "bg-emerald-900/20 text-zinc-300 border-emerald-700/40"
                        : "bg-emerald-50 text-emerald-800 border-emerald-200"
                    }`}>
                      {step.output}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}