import React, { useState, useRef, useEffect } from 'react';
import { Send, MoreVertical, Phone, Video, Image, Smile } from 'lucide-react';
import { AIPersonality, Message } from '../types';
import { generateResponse } from '../services/ai';

interface ChatWindowProps {
  personality: AIPersonality | null;
}

export default function ChatWindow({ personality }: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (personality) {
      setMessages([]);
    }
  }, [personality]);

  const handleSend = async () => {
    if (!message.trim() || !personality) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      const aiResponse = await generateResponse(personality.id, message);
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, responseMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: 'I apologize, but I am unable to respond at the moment. Please try again later.',
          sender: 'ai',
          timestamp: new Date(),
        },
      ]);
    }
  };

  if (!personality) {
    return (
      <div className="flex-1 bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Welcome to AI Chat</h2>
          <p className="text-gray-500">Select a personality from the sidebar to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#efeae2]">
      {/* Chat header */}
      <div className="h-16 bg-white flex items-center justify-between px-4 border-b shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={personality.avatar}
              alt={personality.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="font-semibold">{personality.name}</h3>
            <p className="text-xs text-gray-500">
              {isTyping ? 'typing...' : 'online'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="sidebar-button">
            <Video size={20} />
          </button>
          <button className="sidebar-button">
            <Phone size={20} />
          </button>
          <button className="sidebar-button">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-bubble ${
              msg.sender === 'user' ? 'message-bubble-user' : 'message-bubble-ai'
            }`}
          >
            <div className="p-3 shadow-sm animate-fade-in">
              <p>{msg.content}</p>
              <span className="message-time">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message-bubble message-bubble-ai">
            <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm">
              <div className="typing-indicator flex gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="bg-gray-100 p-4">
        <div className="flex items-center gap-2">
          <button className="sidebar-button">
            <Smile size={20} />
          </button>
          <button className="sidebar-button">
            <Image size={20} />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message ${personality.name}...`}
            className="chat-input"
            autoFocus
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="p-2 bg-green-500 hover:bg-green-600 rounded-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-500"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}