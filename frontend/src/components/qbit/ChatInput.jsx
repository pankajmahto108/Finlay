import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Image as ImageIcon, X, Globe, BrainCircuit } from 'lucide-react';

const ChatInput = ({ onSendMessage, disabled, memoryEnabled, onToggleMemory }) => {
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  
  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition && !recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setInput((prev) => prev + (prev.endsWith(' ') || prev.length === 0 ? '' : ' ') + finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please enable microphone permissions in your browser settings to use voice input.');
        }
      };

      recognition.onend = () => {
        // Only set isRecording false if it's not manually toggled. Web Speech API sometimes stops automatically between phrases
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please try Chrome.');
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error('Failed to start speech recognition', e);
        setIsRecording(false);
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if ((!input.trim() && !image) || disabled) return;
    
    // Prefix if search enabled
    const finalContent = isSearchEnabled ? `[Web Search Requested] ${input}` : input;
    onSendMessage(finalContent, image);
    
    setInput('');
    setImage(null);
    setIsSearchEnabled(false);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const quickHints = [
    "Analyze BTC trend",
    "Scan my watchlist for breakouts",
    "Review risk patterns"
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 pb-6 flex flex-col gap-3">
      {/* Quick Hints (Below Input Layout requirement - technically placed right above the input box physically to avoid being under the screen edge, but conceptually coupled to the input) */}
      {!disabled && input.length === 0 && (
        <div className="flex flex-wrap gap-2 justify-center pb-1">
          {quickHints.map((hint, i) => (
            <button 
              key={i}
              onClick={() => onSendMessage(hint)}
              className="bg-gray-800/80 border border-gray-700 hover:border-gray-500 hover:bg-gray-700/80 px-3 py-1.5 rounded-full text-xs text-gray-300 transition-all shadow-sm"
            >
              {hint}
            </button>
          ))}
        </div>
      )}

      <div className={`bg-gray-800 rounded-2xl border ${isRecording ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-gray-700 shadow-lg'} flex flex-col focus-within:border-green-500/50 transition-all overflow-hidden`}>
        
        {/* Image Preview Area */}
        {image && (
          <div className="p-3 border-b border-gray-700 flex relative w-max">
            <div className="relative group">
              <img src={image} alt="Upload preview" className="h-16 w-16 object-cover rounded shadow-md border border-gray-600" />
              <button 
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-gray-700 hover:bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col p-2">
          {/* Text Input */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={isRecording ? "Listening to your voice..." : "Ask Qbit anything about markets..."}
            className="flex-1 bg-transparent text-gray-100 placeholder-gray-500 py-3 px-3 resize-none outline-none max-h-[150px] w-full"
            rows={1}
          />

          <div className="flex items-center justify-between pt-2">
            {/* Toolbar Buttons (Bottom Left) */}
            <div className="flex items-center gap-1.5 px-1">
              {/* File Attach */}
              <input 
                type="file" 
                accept="image/*"
                className="hidden" 
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              <button 
                className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded-lg transition-colors border border-transparent"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                title="Attach image"
              >
                <ImageIcon size={18} />
              </button>
              
              {/* Web Search Toggle */}
              <button 
                className={`p-1.5 rounded-lg transition-colors border flex items-center gap-1 ${
                  isSearchEnabled 
                    ? 'text-blue-400 bg-blue-500/10 border-blue-500/30' 
                    : 'text-gray-400 hover:text-blue-400 hover:bg-gray-700 border-transparent'
                }`}
                onClick={() => setIsSearchEnabled(!isSearchEnabled)}
                disabled={disabled}
                title="Search the Web"
              >
                <Globe size={18} />
                <span className="text-xs font-medium hidden sm:block">Search</span>
              </button>

              {/* Hindsight Memory Toggle */}
              <button 
                className={`p-1.5 rounded-lg transition-colors border flex items-center gap-1 ${
                  memoryEnabled 
                    ? 'text-green-400 bg-green-500/10 border-green-500/30' 
                    : 'text-gray-400 hover:text-green-400 hover:bg-gray-700 border-transparent'
                }`}
                onClick={onToggleMemory}
                disabled={disabled}
                title="Toggle Agent Memory (Hindsight)"
              >
                <BrainCircuit size={18} />
                <span className="text-xs font-medium hidden sm:block">Memory</span>
              </button>
            </div>

            {/* Action Buttons (Bottom Right) */}
            <div className="flex items-center gap-2">
              {/* Voice/Mic */}
              <button 
                className={`p-2 rounded-full transition-colors flex items-center justify-center ${
                  isRecording 
                    ? 'text-white bg-red-500 animate-pulse hover:bg-red-600' 
                    : 'text-gray-400 hover:text-gray-200 bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={toggleRecording}
                disabled={disabled}
                title={isRecording ? "Stop recording" : "Voice input"}
              >
                <Mic size={16} />
              </button>

              {/* Send Button */}
              <button 
                className={`p-2 rounded-full flex items-center justify-center transition-all ${
                  (input.trim() || image) && !disabled
                    ? 'bg-green-500 hover:bg-green-400 text-black' 
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
                onClick={handleSubmit}
                disabled={disabled || (!input.trim() && !image)}
              >
                <Send size={16} className="ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-1 text-[11px] text-gray-500 font-light tracking-wide">
        Qbit can make mistakes. Consider verifying critical trading information.
      </div>
    </div>
  );
};

export default ChatInput;
