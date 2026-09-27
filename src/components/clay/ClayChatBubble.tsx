import React from 'react';

interface ClayChatBubbleProps {
  message: string;
  sender: 'user' | 'assistant';
  timestamp?: string;
  className?: string;
}

export const ClayChatBubble: React.FC<ClayChatBubbleProps> = ({
  message,
  sender,
  timestamp,
  className = ''
}) => {
  const isUser = sender === 'user';

  return (
    <div
      className={`
        flex ${isUser ? 'justify-end' : 'justify-start'} mb-4
        ${className}
      `}
    >
      <div
        className={`
          max-w-xs lg:max-w-md px-4 py-3 rounded-2xl
          ${isUser
            ? 'bg-[#6B9EFF] text-white shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),inset_-1px_-1px_2px_rgba(80,120,255,0.4),0_8px_16px_rgba(107,158,255,0.2)]'
            : 'bg-white text-[#1F2937] shadow-[inset_2px_2px_5px_rgba(255,255,255,0.9),inset_-2px_-2px_5px_rgba(190,200,215,0.35),0_8px_16px_rgba(80,100,130,0.08)]'
          }
        `}
      >
        <p className="text-sm leading-relaxed">{message}</p>
        {timestamp && (
          <p
            className={`
              text-xs mt-2 ${isUser ? 'text-blue-100' : 'text-[#64748B]'}
            `}
          >
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
};

interface ClayTypingIndicatorProps {
  className?: string;
}

export const ClayTypingIndicator: React.FC<ClayTypingIndicatorProps> = ({
  className = ''
}) => {
  return (
    <div className={`flex gap-2 items-center ${className}`}>
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 bg-[#6B9EFF] rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <span className="text-xs text-[#64748B]">Analyzing...</span>
    </div>
  );
};
