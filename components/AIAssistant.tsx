import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, Loader2, Sparkles, ShoppingBag } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage, MenuItem } from '../types';
import { MENU_ITEMS } from '../constants';

interface AIAssistantProps {
    onOrderClick?: (item: MenuItem) => void;
}

const SUGGESTIONS = [
    "Recommend a Kota",
    "What's in the Monster Kota?",
    "Do you deliver?",
    "Book a table for 2"
];

const AIAssistant: React.FC<AIAssistantProps> = ({ onOrderClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hola! 👋 Welcome to Login Cafe. I can help you with the menu, prices, or booking a table. What are you craving today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const responseText = await sendMessageToGemini(messages, text);

    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessageContent = (text: string) => {
    const orderMatch = text.match(/\[ORDER:([A-Za-z0-9-]+)\]/);
    const cleanText = text.replace(/\[ORDER:[A-Za-z0-9-]+\]/g, '');

    let suggestedItem = null;
    if (orderMatch) {
        const code = orderMatch[1];
        suggestedItem = MENU_ITEMS.find(i => i.code === code);
    }

    return (
        <div>
            <div className="whitespace-pre-wrap">{cleanText}</div>
            {suggestedItem && onOrderClick && (
                <div className="mt-3">
                    <button 
                        onClick={() => onOrderClick(suggestedItem!)}
                        className="w-full py-2 bg-[#E4002B] text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Order {suggestedItem.name} Now
                    </button>
                </div>
            )}
        </div>
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#E4002B] text-white shadow-[0_4px_20px_rgba(228,0,43,0.4)] hover:scale-110 transition-all duration-300 group ${isOpen ? 'hidden' : 'flex'}`}
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-white border-2 border-[#E4002B]"></span>
        </span>
      </button>

      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[85vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300 bg-white border border-gray-200">
          
          <div className="bg-[#E4002B] p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-black text-white text-lg flex items-center gap-2 uppercase tracking-wide">
                  Login Assistant
                </h3>
                <p className="text-xs text-white/80 font-medium">Online • Ready to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-black text-white rounded-tr-sm font-medium'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm shadow-sm'
                  }`}
                >
                  {renderMessageContent(msg.text)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 flex items-center gap-2 rounded-tl-sm shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-[#E4002B]" />
                  <span className="text-xs text-gray-500 font-bold uppercase">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {!loading && (
             <div className="px-4 py-2 bg-gray-50 flex gap-2 overflow-x-auto no-scrollbar">
                {SUGGESTIONS.map((sug, i) => (
                    <button 
                        key={i}
                        onClick={() => handleSend(sug)}
                        className="whitespace-nowrap px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 hover:border-[#E4002B] hover:text-[#E4002B] transition-colors shrink-0"
                    >
                        {sug}
                    </button>
                ))}
             </div>
          )}

          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-2 focus-within:ring-2 focus-within:ring-[#E4002B] transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about menu..."
                className="flex-1 bg-transparent border-none focus:outline-none px-4 text-gray-800 placeholder-gray-500 text-sm font-medium"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="p-3 bg-[#E4002B] rounded-full text-white disabled:opacity-50 hover:bg-black transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;