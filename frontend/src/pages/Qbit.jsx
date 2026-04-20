import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from '../components/qbit/ChatMessage';
import ChatInput from '../components/qbit/ChatInput';
import TypingIndicator from '../components/qbit/TypingIndicator';
import { Settings, PlusCircle, Menu, MoreHorizontal, MessageSquare } from 'lucide-react';

const SYSTEM_PROMPT = `You are Qbit, an expert AI trading assistant integrated into the Finlay platform. 
You help traders analyze markets, interpret chart patterns, evaluate strategies, and manage risk. 
Be concise, data-driven, and direct.`;

const MODELS = [
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B' },
  { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B' },
  { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B' },
  { id: 'gemma2-9b-it', name: 'Gemma 2 9B' }
];

const Qbit = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState(MODELS[0].id);
  const [memoryEnabled, setMemoryEnabled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleNewChat = () => {
    setMessages([]);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleRetry = async () => {
    // Find the last user message to retry
    const lastUserMessageIndex = messages.findLastIndex(m => m.role === 'user');
    if (lastUserMessageIndex === -1) return;
    
    // Slice off trailing assistant messages
    const newHistory = messages.slice(0, lastUserMessageIndex + 1);
    const lastUserMsg = newHistory[newHistory.length - 1];
    
    setMessages(newHistory);
    // Submit again quietly
    await executeChatCall(lastUserMsg.content, newHistory);
  };

  const handleSendMessage = async (text, imageBase64) => {
    let userContent = text;
    
    if (!text && imageBase64) {
      userContent = "Please analyze this image.";
    }
    
    if (imageBase64 && currentModel.includes('vision') === false) {
       console.warn("Image attached but model might not support vision.");
    }

    const newMessage = { 
      role: 'user', 
      content: userContent,
      timestamp: new Date().toISOString()
    };
    
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    
    await executeChatCall(userContent, newMessages);
  };

  const executeChatCall = async (userContent, currentHistory) => {
    setIsLoading(true);

    try {
      const messageHistory = currentHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const apiMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messageHistory
      ];

      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey || apiKey === 'your_key_here') {
        throw new Error("Missing VITE_GROQ_API_KEY. Please update your .env file.");
      }

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: currentModel,
          messages: apiMessages,
          stream: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '', 
        timestamp: new Date().toISOString() 
      }]);
      setIsLoading(false);

      let assistantResponse = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.choices[0]?.delta?.content) {
                assistantResponse += data.choices[0].delta.content;
                
                setMessages(prev => {
                  const updated = [...prev];
                  const lastIndex = updated.length - 1;
                  updated[lastIndex] = {
                    ...updated[lastIndex],
                    content: assistantResponse
                  };
                  return updated;
                });
              }
            } catch (e) {}
          }
        }
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error.message}`, 
        timestamp: new Date().toISOString() 
      }]);
      setIsLoading(false);
    }
  };

  // Mock History
  const chatHistory = [
    { group: 'Today', items: ['Bitcoin 4h trend analysis', 'Ethereum short squeeze'] },
    { group: 'Yesterday', items: ['Solana vs ADA comparison', 'Review weekly RSI'] },
  ];

  return (
    <div className="flex h-full w-full bg-gray-900 text-gray-100 overflow-hidden font-sans">
      
      {/* Sidebar - Collapsible */}
      <div 
        className={`${
          isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'
        } shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 ease-in-out absolute md:relative z-20 h-full overflow-hidden`}
      >
        <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between min-w-[256px]">
          <button 
            onClick={handleNewChat}
            className="flex-1 flex items-center gap-2 p-2 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 transition"
          >
            <PlusCircle size={18} />
            <span className="font-medium text-sm">New chat</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto min-w-[256px] px-3 py-4 space-y-6">
          {chatHistory.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-xs font-semibold text-gray-500 mb-2 px-2">{section.group}</h3>
              <ul className="space-y-1">
                {section.items.map((item, i) => (
                  <li key={i}>
                    <button className="w-full text-left flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-800 text-gray-300 text-sm group">
                      <MessageSquare size={16} className="text-gray-500" />
                      <span className="flex-1 truncate">{item}</span>
                      <MoreHorizontal size={14} className="text-gray-500 opacity-0 group-hover:opacity-100" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="absolute inset-0 bg-black/50 z-10 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* 1. Top Header Bar */}
        <header className="flex items-center justify-between px-4 h-14 bg-gray-900 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold font-heading text-gray-200">
              Qbit AI
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Model Selector */}
            <div className="relative group">
              <select 
                value={currentModel}
                onChange={(e) => setCurrentModel(e.target.value)}
                className="appearance-none bg-gray-800 border-none text-sm rounded-lg px-4 py-1.5 pr-8 focus:ring-1 focus:ring-green-500 cursor-pointer text-gray-300 font-medium"
              >
                {MODELS.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
              <Settings className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>
          </div>
        </header>

        {/* 2. Chat Messages Area */}
        <div className="flex-1 overflow-y-auto scroll-smooth">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-6 border border-gray-700 shadow-sm">
                <span className="text-2xl font-bold text-gray-200">Q</span>
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-gray-100">How can I help you?</h2>
            </div>
          ) : (
            <div className="pb-4">
              {messages.map((msg, index) => (
                <ChatMessage 
                  key={index} 
                  message={msg} 
                  onRetry={msg.role === 'assistant' && index === messages.length - 1 ? handleRetry : undefined}
                />
              ))}
              
              {isLoading && (
                <div className="flex w-full py-6 px-4 md:px-8 bg-gray-800/50">
                  <div className="flex w-full max-w-4xl mx-auto gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded bg-green-500/20 text-green-400 flex items-center justify-center border border-green-500/30">
                        <span className="font-bold text-xs">AI</span>
                      </div>
                    </div>
                    <div className="pt-1">
                      <TypingIndicator />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-1" />
            </div>
          )}
        </div>

        {/* 3. Bottom Input Bar */}
        <div className="shrink-0 bg-gray-900 pt-2 pb-2">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            disabled={isLoading} 
            memoryEnabled={memoryEnabled}
            onToggleMemory={() => setMemoryEnabled(!memoryEnabled)}
          />
        </div>
      </div>
    </div>
  );
};

export default Qbit;
