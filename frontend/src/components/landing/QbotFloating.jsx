import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, User, ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const quickReplies = [
  'What is Finlay?',
  'How does Qbit work?',
  'Show me features',
  'How to get started?',
];

const botResponses = {
  'what is finlay': "Finlay is an AI-powered trading platform that combines institutional-grade market data with advanced AI to help you analyze, strategize, and trade smarter. Think of it as replacing all your trading tools with one intelligent system! 🚀",
  'how does qbit work': "Qbit is our full-scale AI trading brain — powered by multiple specialized agents (Market Analyst, Risk Manager, Strategy Agent, and more). It uses Groq API for lightning-fast inference and Hindsight for memory. You can access it from the Qbit page!",
  'show me features': "Here's what Finlay offers:\n\n• 📊 Backtest & optimize strategies\n• 🧠 Train AI models for signals\n• 🔍 Real-time market scanners\n• 💡 AI-generated indicators\n• 🤖 On-demand Qbit analysis\n\nScroll down to explore each feature in detail!",
  'how to get started': "Getting started is easy:\n\n1. Click 'Sign up now' in the navbar\n2. Set up your profile and preferences\n3. Explore the Dashboard\n4. Try asking Qbit a question!\n\nYou can also explore our features below first.",
};

function getResponse(input) {
  const lower = input.toLowerCase().trim();
  for (const [key, value] of Object.entries(botResponses)) {
    if (lower.includes(key) || key.includes(lower)) {
      return value;
    }
  }
  return "I'm Qbot, your platform guide! I can help you navigate Finlay. For deep market analysis and trading intelligence, try our full AI assistant — **Qbit**. You can find it from the 'Sign up now' button above! 😊";
}

export default function QbotFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey! 👋 I'm **Qbot**, your Finlay guide. I can help you learn about the platform, features, and how to get started. What would you like to know?",
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = (text) => {
    const query = (text || input).trim();
    if (!query) return;

    setMessages((prev) => [...prev, { id: Date.now(), text: query, sender: 'user' }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: getResponse(query), sender: 'bot' },
      ]);
    }, 800 + Math.random() * 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  // Simple markdown bold
  const renderText = (text) => {
    return text.split('**').map((part, i) =>
      i % 2 === 1 ? (
        <strong key={i} className="text-white font-semibold">{part}</strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 group"
          >
            <div className="relative p-4 rounded-full bg-gradient-to-r from-[#00ff66] to-[#3b82f6] shadow-[0_0_30px_rgba(0,255,102,0.3)] text-white">
              <Bot size={28} />
              {/* Ping */}
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#00ff66] border-2 border-[#050a15]" />
              </span>
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="px-3 py-2 rounded-lg bg-[#0f172a] border border-white/10 text-sm text-white font-medium whitespace-nowrap shadow-xl">
                Chat with Qbot 💬
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 flex flex-col"
            style={{ height: '520px' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#0f172a] to-[#0a1020] border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-r from-[#00ff66] to-[#3b82f6] flex items-center justify-center">
                  <Bot size={20} className="text-white" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00ff66] border-2 border-[#0f172a]" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    Qbot
                    <span className="text-[9px] uppercase font-bold bg-gradient-to-r from-[#00ff66] to-[#3b82f6] px-1.5 py-0.5 rounded text-white tracking-wider">
                      Guide
                    </span>
                  </h3>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" />
                    Online • Platform Assistant
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#050a15]" style={{ scrollbarWidth: 'none' }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 ${
                      msg.sender === 'user'
                        ? 'bg-[#0f172a] border border-white/10'
                        : 'bg-gradient-to-br from-[#00ff66] to-[#3b82f6]'
                    }`}
                  >
                    {msg.sender === 'user' ? (
                      <User size={12} className="text-gray-400" />
                    ) : (
                      <Bot size={14} className="text-white" />
                    )}
                  </div>
                  <div
                    className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed max-w-[75%] whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-[#0f172a] border border-white/10 text-gray-200 rounded-tr-sm'
                        : 'bg-[#00ff66]/5 border border-[#00ff66]/10 text-gray-300 rounded-tl-sm'
                    }`}
                  >
                    {renderText(msg.text)}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2.5"
                >
                  <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[#00ff66] to-[#3b82f6] flex items-center justify-center">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="px-4 py-3 bg-[#00ff66]/5 border border-[#00ff66]/10 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#00ff66] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-[#00ff66] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-[#00ff66] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-4 py-2 bg-[#080e1e] border-t border-white/5 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {quickReplies.map((qr, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(qr)}
                  className="shrink-0 text-[11px] font-medium px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all whitespace-nowrap"
                >
                  {qr}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-4 py-3 bg-[#0a1020] border-t border-white/5">
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Qbot anything..."
                  className="w-full bg-[#050a15] border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-[#00ff66]/30 focus:ring-1 focus:ring-[#00ff66]/20 text-white placeholder-gray-600 transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-2.5 p-2 rounded-lg text-gray-500 hover:text-[#00ff66] disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"
                >
                  <Send size={16} />
                </button>
              </form>
              <div className="mt-2 text-center">
                <Link to="/qbit" className="text-[10px] text-gray-600 hover:text-[#3b82f6] transition-colors flex items-center justify-center gap-1">
                  <Sparkles size={10} />
                  Need deep analysis? Try Qbit AI →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
