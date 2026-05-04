import { motion } from "framer-motion";
import { User, Robot } from "@phosphor-icons/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MessageBubble({ message, index }: { message: { role: string; content: string }; index: number }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: Math.min(index * 0.05, 0.5) }}
      className={`flex w-full gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_2px_10px_-4px_rgba(0,0,0,0.05)] border ${
        isUser ? "bg-zinc-950 text-white border-zinc-800" : "bg-white text-emerald-600 border-zinc-200"
      }`}>
        {isUser ? <User weight="bold" className="text-lg" /> : <Robot weight="duotone" className="text-lg" />}
      </div>
      
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[80%]`}>
        <div className={`text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 px-1`}>
          {isUser ? "You" : "AgentMesh"}
        </div>
        <div className={`px-5 py-4 text-sm leading-relaxed shadow-sm overflow-hidden ${
          isUser 
            ? "bg-zinc-900 text-white rounded-[2rem] rounded-tr-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" 
            : "bg-white border border-zinc-200/60 text-zinc-800 rounded-[2rem] rounded-tl-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
        }`}>
          {isUser ? (
             message.content
          ) : (
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ ...props }) => <h1 className="text-2xl font-bold mt-4 mb-2 text-zinc-900" {...props} />,
                h2: ({ ...props }) => <h2 className="text-xl font-bold mt-4 mb-2 text-zinc-900" {...props} />,
                h3: ({ ...props }) => <h3 className="text-lg font-bold mt-3 mb-2 text-zinc-900" {...props} />,
                p: ({ ...props }) => <p className="mb-3 last:mb-0 text-zinc-700 leading-relaxed" {...props} />,
                ul: ({ ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1 text-zinc-700" {...props} />,
                ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-zinc-700" {...props} />,
                a: ({ ...props }) => <a className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2 break-all" {...props} />,
                strong: ({ ...props }) => <strong className="font-bold text-zinc-900" {...props} />,
                code: ({ inline, children, ...props }: { inline?: boolean; children?: React.ReactNode }) => {
                  return inline ? (
                    <code className="bg-zinc-100 text-emerald-600 px-1.5 py-0.5 rounded-md text-[13px] font-mono border border-zinc-200" {...props}>
                      {children}
                    </code>
                  ) : (
                    <div className="bg-zinc-950 rounded-xl overflow-hidden my-3 border border-zinc-800 w-full max-w-full">
                      <div className="flex items-center px-4 py-2 bg-zinc-900 border-b border-zinc-800 text-[10px] text-zinc-400 uppercase font-bold tracking-widest">
                        Code
                      </div>
                      <pre className="p-4 overflow-x-auto text-[13px] text-zinc-300 font-mono leading-relaxed">
                        <code {...props}>{children}</code>
                      </pre>
                    </div>
                  )
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </motion.div>
  );
}