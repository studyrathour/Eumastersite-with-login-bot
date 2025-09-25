import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, X } from 'lucide-react';
import { ChatMessage } from '../types/chat';
import { FirebaseRealtimeService } from '../services/firebaseRealtime';

interface ChatBoxProps {
  roomId: string;
  userId: string;
  username: string;
  isVisible: boolean;
  onToggle: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ 
  roomId, 
  userId, 
  username, 
  isVisible, 
  onToggle 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (roomId) {
      // Subscribe to chat messages
      unsubscribeRef.current = FirebaseRealtimeService.subscribeToChatMessages(
        roomId,
        setMessages,
        Date.now() - 24 * 60 * 60 * 1000 // Last 24 hours
      );
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const messageText = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      await FirebaseRealtimeService.addChatMessage(roomId, {
        userId,
        username,
        message: messageText,
        timestamp: Date.now(),
        isAI: false
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/80 transition-colors z-40"
        title="Open Chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-surface border border-secondary rounded-lg shadow-xl z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-secondary">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-text-primary">Live Chat</h3>
          <span className="text-xs text-text-tertiary">({messages.length})</span>
        </div>
        <button
          onClick={onToggle}
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.length === 0 ? (
          <div className="text-center text-text-tertiary py-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No messages yet</p>
            <p className="text-xs">Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col gap-1 ${
                message.userId === userId ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[80%] p-2 rounded-lg text-sm ${
                  message.isAI
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : message.userId === userId
                    ? 'bg-primary text-white'
                    : 'bg-secondary text-text-primary'
                }`}
              >
                {message.userId !== userId && (
                  <div className="text-xs opacity-70 mb-1">
                    {message.isAI ? '🤖 AI Assistant' : message.username}
                  </div>
                )}
                <div>{message.message}</div>
              </div>
              <div className="text-xs text-text-tertiary">
                {formatTime(message.timestamp)}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-secondary">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 bg-background border border-secondary rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
            maxLength={200}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="bg-primary text-white p-2 rounded-lg hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;