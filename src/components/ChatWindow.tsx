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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || !personality) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
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
      console.error('Error getting AI response:', error);
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
        <p className="text-gray-500">Select a personality to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#efeae2]">
      {/* Chat header */}
      <div className="h-16 bg-gray-100 flex items-center justify-between px-4 border-b shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src={personality.avatar}
            alt={personality.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold">{personality.name}</h3>
            <p className="text-xs text-gray-500">
              {isTyping ? 'typing...' : personality.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <Video size={20} />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <Phone size={20} />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[70%] mb-4 ${
              msg.sender === 'user' ? 'ml-auto' : 'mr-auto'
            }`}
          >
            <div
              className={`p-3 rounded-lg shadow-sm animate-fade-in ${
                msg.sender === 'user'
                  ? 'bg-[#dcf8c6] rounded-tr-none'
                  : 'bg-white rounded-tl-none'
              }`}
            >
              <p className="break-words">{msg.content}</p>
              <p className="text-xs text-gray-500 text-right mt-1">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="max-w-[70%] mr-auto mb-4">
            <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm animate-pulse">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="bg-gray-100 p-4">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <Smile size={20} className="text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <Image size={20} className="text-gray-500" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message"
            className="flex-1 px-4 py-2 rounded-full border-none focus:outline-none shadow-sm"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="p-2 bg-green-500 hover:bg-green-600 rounded-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}