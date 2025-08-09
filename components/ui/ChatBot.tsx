'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { CHATBOT_CONFIG, checkChatbotHealth, type ChatMessage } from '@/lib/chatbot-api';

interface ChatBotProps {
  className?: string;
}

interface ExtendedChatMessage extends ChatMessage {
  timestamp: Date;
}

const ChatBot: React.FC<ChatBotProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check API health on component mount
  useEffect(() => {
    checkApiHealth();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkApiHealth = async () => {
    try {
      const healthCheck = await checkChatbotHealth();
      setIsConnected(healthCheck.isHealthy);
    } catch (error) {
      console.error('API health check failed:', error);
      setIsConnected(false);
    }
  };

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    const newUserMessage: ExtendedChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    // Prepare chat history for API
    const chatHistory = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    try {
      const response = await fetch(`${CHATBOT_CONFIG.API_BASE_URL}${CHATBOT_CONFIG.ENDPOINTS.CHAT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          message: userMessage,
          history: chatHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullAiResponse = '';
      let currentMessageIndex = messages.length + 1; // +1 for the user message we just added

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n\n').filter(line => line.trim());

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.substring(6);
              try {
                const data = JSON.parse(dataStr);
                if (data.type === 'text') {
                  fullAiResponse = data.data;
                  
                  // Update or add the AI message
                  setMessages(prev => {
                    const newMessages = [...prev];
                    const aiMessageIndex = newMessages.findIndex(
                      (msg, index) => index === currentMessageIndex && msg.role === 'assistant'
                    );
                    
                    if (aiMessageIndex !== -1) {
                      // Update existing message
                      newMessages[aiMessageIndex] = {
                        role: 'assistant',
                        content: fullAiResponse,
                        timestamp: new Date(),
                      };
                    } else {
                      // Add new message
                      newMessages.push({
                        role: 'assistant',
                        content: fullAiResponse,
                        timestamp: new Date(),
                      });
                    }
                    return newMessages;
                  });
                } else if (data.type === 'end') {
                  setIsTyping(false);
                  if (!isOpen) {
                    setHasNewMessage(true); // Show notification if chat is closed
                  }
                }
              } catch (error) {
                console.error('Failed to parse stream data:', error);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ExtendedChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your message. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewMessage(false); // Clear notification when opening
      if (messages.length === 0) {
        // Add welcome message when opening for the first time
        const welcomeMessage: ExtendedChatMessage = {
          role: 'assistant',
          content: 'Hello! I\'m your Algoric AI assistant. I can help you find properties, answer questions about our services, and provide real estate guidance. How can I assist you today?',
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      }
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className={`fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 ${className}`}>
        <button
          onClick={toggleChat}
          className={`
            relative group
            w-12 h-12 sm:w-14 sm:h-14 rounded-full
            bg-gradient-to-r from-orange-500 to-orange-600
            hover:from-orange-600 hover:to-orange-700
            shadow-lg hover:shadow-xl
            transition-all duration-300 ease-in-out
            transform hover:scale-110 active:scale-95
            flex items-center justify-center
            ${hasNewMessage && !isOpen ? 'animate-bounce' : ''}
            ${isOpen ? 'rotate-180' : ''}
          `}
          aria-label="Open AI Chat Assistant"
        >
          {isOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          ) : (
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          )}
          
          {/* Connection status indicator */}
          <div className={`
            absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white
            ${isConnected ? 'bg-green-500' : 'bg-red-500'}
          `} />
          
          {/* New message notification badge */}
          {hasNewMessage && !isOpen && (
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          )}
          
          {/* Tooltip - Hidden on mobile and when chat is open */}
          {!isOpen && (
            <div className="absolute bottom-full left-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
              <div className="bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                {hasNewMessage ? 'New Message!' : 'Chat with AI'}
                <div className="absolute top-full left-2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-x-2 bottom-16 sm:inset-x-4 sm:bottom-20 sm:left-4 sm:right-auto sm:w-96 h-[70vh] sm:h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 sm:p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-3 h-3 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-xs sm:text-sm truncate">Algoric AI Assistant</h3>
                <p className="text-xs opacity-90">
                  {isConnected ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={clearChat}
                className="text-white/80 hover:text-white text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
              >
                Clear
              </button>
              <button
                onClick={toggleChat}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`
                    max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm
                    ${
                      message.role === 'user'
                        ? 'bg-orange-500 text-white rounded-br-md'
                        : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
                    }
                  `}
                >
                  <div className="flex items-start space-x-2">
                    {message.role === 'assistant' && (
                      <Bot className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 text-orange-500 flex-shrink-0" />
                    )}
                    <div className="flex-1 break-words">
                      {message.content}
                    </div>
                    {message.role === 'user' && (
                      <User className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 text-white/80 flex-shrink-0" />
                    )}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-md px-3 py-2 sm:px-4 sm:py-2 border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 sm:p-4 border-t border-gray-200 bg-white flex-shrink-0">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-xl px-3 py-2 sm:px-4 sm:py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white rounded-xl px-3 py-2 sm:px-4 sm:py-2 transition-colors flex items-center justify-center flex-shrink-0 min-w-[40px]"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
