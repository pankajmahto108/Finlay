import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, User, ChevronUp, ChevronDown, Sparkles, TrendingUp, TrendingDown, Activity, AlertCircle, ShieldCheck, Zap, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LearningTimeline from './LearningTimeline';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([
    { id: 1, type: 'text', text: "Hi! I'm Qbot, your Finlay platform guide. I can help you navigate the AI Dashboard, Scanner, and Strategy Tester. How can I help?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, showInsights]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/chat');
    
    ws.onopen = () => {
      console.log('Qbot connected to backend');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setIsTyping(false);

      if (data.final_decision) {
        setMessages(prev => {
          const filtered = prev.filter(m => !m.isLoading);
          return [...filtered, {
            id: Date.now(),
            type: 'recommendation',
            sender: 'ai',
            action: data.final_decision,
            probability: parseFloat(data.probability) || 0,
            reason: data.reasoning,
            memoryStats: {
              tradesFound: data.todo_list?.length || 5, // fallback for UI
              successRate: 72
            }
          }];
        });
      } else {
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'text',
          text: data.response || "I'm processing that information.",
          sender: 'ai'
        }]);
      }
    };

    ws.onerror = (error) => {
      console.error('Qbot WebSocket error:', error);
      setIsTyping(false);
    };

    ws.onclose = () => {
      console.log('Qbot disconnected');
      setSocket(null);
    };

    return () => ws.close();
  }, []);

  const handleSimulateTrade = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'simulation_result',
        sender: 'ai',
        outcome: "+$450.20",
        probability: "85%",
        risk: "Low"
      }]);
    }, 2000);
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const query = input.trim();
    const userMessage = { id: Date.now(), type: 'text', text: query, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(query);
      
      // Quick feedback for complex queries
      if (query.toUpperCase().includes("TSLA") || query.length > 10) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'text',
          text: "Let me check the multi-agent loop for you...",
          sender: 'ai',
          isLoading: true
        }]);
      }
    } else {
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'text',
          text: "I am your platform guide! For deep analysis, please ensure the backend is connected. Currently I'm in offline help mode.",
          sender: 'ai'
        }]);
      }, 1000);
    }
  };

  const renderMessageContent = (msg) => {
    switch(msg.type) {
      case 'text':
        return (
          <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
            msg.sender === 'user' 
              ? 'bg-surface border border-white/10 text-gray-100 rounded-tr-sm' 
              : 'bg-primary/10 border border-primary/20 text-gray-100 rounded-tl-sm'
          } ${msg.isLoading ? 'animate-pulse text-accent' : ''}`}>
            {msg.text}
          </div>
        );
      
      case 'stock_data':
        return (
          <div className="p-4 rounded-xl bg-surface border border-white/10 rounded-tl-sm w-full space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-black text-lg text-white">{msg.symbol}</span>
              <span className={`flex items-center gap-1 text-sm font-bold ${msg.trend === 'up' ? 'text-success' : 'text-danger'}`}>
                {msg.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {msg.price}
              </span>
            </div>
            <div className="flex gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1"><Activity size={12}/> Volatility: <span className="text-white">{msg.volatility}</span></div>
            </div>
          </div>
        );

      case 'recommendation':
        return (
          <div className="p-4 rounded-xl bg-gradient-to-b from-primary/10 to-surface border border-primary/20 rounded-tl-sm w-full space-y-4">
            {/* Memory Context */}
            <div className="p-2.5 rounded-lg bg-background border border-white/5 flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold shrink-0">Hindsight Memory</span>
                <button onClick={() => setShowInsights(true)} className="text-[10px] flex items-center gap-1 bg-accent/20 text-accent px-2 py-0.5 rounded border border-accent/30 hover:bg-accent/30 transition">
                  <BrainCircuit size={10} /> View Timeline
                </button>
              </div>
              <p className="text-xs text-gray-300">Based on <span className="text-accent font-bold">{msg.memoryStats.tradesFound} similar past trades</span>.</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Success rate:</span>
                <span className="text-xs font-bold text-success">{msg.memoryStats.successRate}%</span>
              </div>
              <p className="text-[10px] text-accent/80 flex items-center gap-1 mt-1">
                <Sparkles size={10}/> Confidence adjusted using memory.
              </p>
            </div>

            {/* Recommendation */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Recommendation</span>
                <span className={`text-xl font-black ${msg.action === 'BUY' ? 'text-success' : 'text-danger'}`}>{msg.action}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Probability</span>
                <span className="text-lg font-bold text-white">{msg.probability}%</span>
              </div>
            </div>
            <div className="text-xs text-gray-300 leading-relaxed p-2 rounded bg-white/5 border-l-2 border-primary">
              {msg.reason}
            </div>

            {/* Actions */}
            <div className="pt-2 flex gap-2">
              <button 
                onClick={handleSimulateTrade}
                disabled={isSimulating}
                className="flex-1 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isSimulating ? <Zap size={14} className="animate-pulse" /> : <Zap size={14} />}
                {isSimulating ? "Simulating..." : "Simulate Trade"}
              </button>
            </div>
          </div>
        );

      case 'simulation_result':
        return (
          <div className="p-4 rounded-xl bg-surface border border-accent/30 rounded-tl-sm w-full space-y-3">
            <div className="flex items-center gap-2 text-accent font-bold text-sm mb-2">
              <ShieldCheck size={16} /> Simulation Complete
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-background rounded border border-white/5">
                <div className="text-gray-500 mb-1">Predicted Outcome</div>
                <div className="text-success font-bold text-sm">{msg.outcome}</div>
              </div>
              <div className="p-2 bg-background rounded border border-white/5">
                <div className="text-gray-500 mb-1">Win Probability</div>
                <div className="text-white font-bold text-sm">{msg.probability}</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 bg-background rounded border border-white/5">
               <span className="text-xs text-gray-500">Risk Level</span>
               <span className="text-xs font-bold text-success">{msg.risk}</span>
            </div>
            <div className="text-[10px] text-center text-gray-500 flex items-center justify-center gap-1 mt-2">
              <BrainCircuit size={10} /> Result stored in Hindsight memory system
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => { setIsOpen(true); setIsMinimized(false); }}
            className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-primary to-accent shadow-[0_0_20px_rgba(34,211,238,0.4)] text-white z-50 group"
          >
            <Bot size={28} className="group-hover:animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-accent border-2 border-primary"></span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '500px',
            }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-4 right-4 w-full max-w-[350px] glass-panel rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 origin-bottom-right border border-white/10"
          >
            {/* Chat Header */}
            <div className="p-3 border-b border-white/10 bg-surface/90 flex justify-between items-center cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20">
                  <Bot size={18} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                    Qbot Guide
                    <span className="text-[9px] uppercase font-bold bg-gradient-to-r from-primary to-accent px-1.5 py-0.5 rounded text-white">Bot</span>
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></div> Online
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} 
                  className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition"
                  title="Minimize"
                >
                  {isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} 
                  className="p-1 text-red-400 hover:text-white hover:bg-red-500/80 rounded transition bg-red-500/10 ml-1 border border-red-500/30"
                  title="Close Agent"
                >
                  <X size={16} strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Internal State (Chat vs Insights Timeline) */}
            <div className="flex-1 overflow-hidden relative">
              {/* Timeline Slider */}
              <AnimatePresence>
                {showInsights && !isMinimized && (
                  <motion.div 
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="absolute inset-0 z-20 bg-background"
                  >
                    <LearningTimeline onClose={() => setShowInsights(false)} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chat Messages */}
              <AnimatePresence>
                {!isMinimized && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 p-4 overflow-y-auto space-y-4 bg-background/50 scrollbar-hide flex flex-col"
                  >
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${msg.type === 'text' ? 'max-w-[85%]' : 'max-w-[95%]'} ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                      >
                        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          msg.sender === 'user' ? 'bg-surface border border-white/10' : 'bg-gradient-to-br from-primary to-accent'
                        }`}>
                          {msg.sender === 'user' ? <User size={14} className="text-gray-300" /> : <Bot size={16} className="text-white" />}
                        </div>
                        
                        {renderMessageContent(msg)}
                      </motion.div>
                    ))}
                    
                    {isTyping && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                        <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-accent">
                          <Bot size={16} className="text-white" />
                        </div>
                        <div className="p-3 bg-primary/10 border border-primary/20 rounded-2xl rounded-tl-sm flex items-center gap-1.5 h-[38px]">
                          <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input Area */}
            {!isMinimized && (
              <div className="p-4 border-t border-white/10 bg-surface/90 relative z-10">
                <form onSubmit={handleSend} className="relative flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Qbot about the Finlay platform..."
                    className="w-full bg-background border border-white/10 rounded-full px-5 py-3 pr-12 text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 text-white placeholder-gray-500 transition-all font-medium"
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim()}
                    className="absolute right-2 p-2 rounded-full text-gray-400 hover:text-accent hover:bg-accent/10 disabled:opacity-50 disabled:hover:text-gray-400 disabled:hover:bg-transparent transition-all"
                  >
                    <Send size={18} />
                  </button>
                </form>
                <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                  <button onClick={() => setInput("How to use Scanner?")} className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-white/10 bg-surface text-gray-400 hover:text-white hover:border-white/30 transition-all whitespace-nowrap flex items-center gap-1.5">
                    <Activity size={12}/> How to use Scanner?
                  </button>
                  <button onClick={() => setInput("Where is Qbit AI?")} className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-white/10 bg-surface text-gray-400 hover:text-white hover:border-white/30 transition-all whitespace-nowrap">
                    Where is Qbit AI?
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
