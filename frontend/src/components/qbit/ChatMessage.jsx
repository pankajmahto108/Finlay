import React from 'react';
import { User, Copy, ThumbsUp, ThumbsDown, Check, RotateCcw } from 'lucide-react';

const ChatMessage = ({ message, onRetry }) => {
  const [copied, setCopied] = React.useState(false);
  const isAssistant = message.role === 'assistant';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex w-full py-6 px-4 md:px-8 ${isAssistant ? 'bg-gray-800/50' : ''}`}>
      <div className="flex w-full max-w-4xl mx-auto gap-4">
        <div className="flex-shrink-0">
          {isAssistant ? (
            <div className="w-8 h-8 rounded bg-green-500/20 text-green-400 flex items-center justify-center border border-green-500/30">
              <span className="font-bold text-xs">AI</span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded bg-gray-700 text-gray-300 flex items-center justify-center">
              <User size={18} />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-sm text-gray-300">
              {isAssistant ? 'Qbit AI' : 'You'}
            </span>
            {message.timestamp && (
              <span className="text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
          
          <div className="text-gray-100 whitespace-pre-wrap break-words text-sm leading-relaxed">
            {message.content}
          </div>

          {isAssistant && message.content && (
            <div className="flex items-center gap-3 mt-4 pt-2">
              <button 
                onClick={handleCopy}
                className="text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1 text-xs bg-gray-800/80 px-2 py-1 rounded"
                title="Copy message"
              >
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
              {onRetry && (
                <button 
                  onClick={onRetry}
                  className="text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1 text-xs bg-gray-800/80 px-2 py-1 rounded"
                  title="Retry generating response"
                >
                  <RotateCcw size={14} />
                </button>
              )}
              <button 
                className="text-gray-500 hover:text-green-400 transition-colors bg-gray-800/80 px-2 py-1 rounded"
                title="Good response"
              >
                <ThumbsUp size={14} />
              </button>
              <button 
                className="text-gray-500 hover:text-red-400 transition-colors bg-gray-800/80 px-2 py-1 rounded"
                title="Bad response"
              >
                <ThumbsDown size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
