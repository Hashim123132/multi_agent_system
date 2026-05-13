
import React from "react";

const ThinkingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-1 text-gray-500 text-sm">
      <span>Thinking</span>
      <span className="flex gap-1">
        <span className="animate-bounce">.</span>
        <span className="animate-bounce [animation-delay:150ms]">.</span>
        <span className="animate-bounce [animation-delay:300ms]">.</span>
      </span>
    </div>
  );
};

export default ThinkingIndicator;