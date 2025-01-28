import React, { useState, useRef, useEffect } from 'react';
import { Send, MoreVertical, Phone, Video, Image, Smile, Paperclip, Mic, Bot, Link2 } from 'lucide-react';
import { AIPersonality, Message } from '../types';
import { generateResponse } from '../services/ai';

interface ChatWindowProps {
  personality: AIPersonality | null;
}

export default function ChatWindow({ personality }: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  // Listen for dark mode changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (personality) {
      setMessages([]);
      inputRef.current?.focus();
    }
  }, [personality]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Add file preview message
      const newMessage: Message = {
        id: Date.now().toString(),
        content: `Uploaded file: ${file.name}`,
        sender: 'user',
        timestamp: new Date(),
        attachment: {
          type: file.type.startsWith('image/') ? 'image' : 'file',
          url: URL.createObjectURL(file),
          name: file.name
        }
      };
      setMessages(prev => [...prev, newMessage]);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    // Implement voice recording logic
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Implement voice recording stop logic
  };

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
      <div className={`flex-1 flex items-center justify-center ${
        isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 to-blue-50'
      }`}>
        <div className="text-center max-w-lg px-4">
          <Bot size={48} className="mx-auto mb-6 text-green-500" />
          <h2 className={`text-3xl font-bold mb-4 ${
            isDarkMode ? 'text-gray-200' : 'text-gray-800'
          }`}>Welcome to AI Chat</h2>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Choose an AI personality from the sidebar to start an intelligent conversation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col ${
      isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 to-blue-50'
    }`}>
      {/* Chat header */}
      <div className={`h-20 flex items-center justify-between px-6 border-b backdrop-blur-lg bg-opacity-90 ${
        isDarkMode ? 'bg-gray-900/90 border-gray-700' : 'bg-white/90 border-gray-200'
      }`}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-green-500">
              <img
                src={personality.avatar}
                alt={personality.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 ring-2 ring-white dark:ring-gray-900"></div>
          </div>
          <div>
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {personality.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {isTyping ? 'typing...' : 'AI Assistant'}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className={`action-button ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
            <Link2 size={20} />
          </button>
          <button className={`action-button ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
            <Video size={20} />
          </button>
          <button className={`action-button ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
            <Phone size={20} />
          </button>
          <button className={`action-button ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`message-bubble rounded-2xl shadow-sm p-4 ${
                  msg.sender === 'user'
                    ? isDarkMode
                      ? 'bg-green-600 text-white'
                      : 'bg-green-500 text-white'
                    : isDarkMode
                    ? 'bg-gray-800 text-gray-100'
                    : 'bg-white text-gray-900'
                }`}>
                  {msg.attachment && (
                    <div className="mb-2">
                      {msg.attachment.type === 'image' ? (
                        <img 
                          src={msg.attachment.url} 
                          alt="attachment" 
                          className="rounded-lg max-w-full h-auto"
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-black/10">
                          <Paperclip size={16} />
                          <span className="text-sm">{msg.attachment.name}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <p className="text-base">{msg.content}</p>
                  <span className={`text-xs mt-1 block ${
                    msg.sender === 'user'
                      ? 'text-green-100'
                      : isDarkMode
                      ? 'text-gray-400'
                      : 'text-gray-500'
                  }`}>
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className={`p-4 rounded-2xl shadow-sm ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white bg-opacity-90 backdrop-blur-lg'}`}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <button 
              className={`action-button ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile size={20} />
            </button>
            <button 
              className={`action-button ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip size={20} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*,.pdf,.doc,.docx"
            />
            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Message ${personality.name}...`}
                className={`w-full px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                  isDarkMode 
                    ? 'bg-gray-800 text-white placeholder-gray-400 border-gray-700' 
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                }`}
                autoFocus
              />
            </div>
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              className={`action-button ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'hover:bg-gray-100'} ${
                isRecording ? 'text-red-500' : ''
              }`}
            >
              <Mic size={20} />
            </button>
            <button
              onClick={handleSend}
              disabled={!message.trim() && !selectedFile}
              className={`p-3 rounded-full text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                isDarkMode
                  ? 'bg-green-600 hover:bg-green-700 disabled:hover:bg-green-600'
                  : 'bg-green-500 hover:bg-green-600 disabled:hover:bg-green-500'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}