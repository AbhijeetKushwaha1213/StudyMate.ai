import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  X, 
  Send, 
  Bot,
  User as UserIcon
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatPanel = ({ isOpen, onClose }: ChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('studymate-chat-messages');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert timestamp strings back to Date objects
      return parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    }
    return [
      {
        id: '1',
        text: 'Hello! I\'m your AI study assistant. How can I help you today?',
        sender: 'ai',
        timestamp: new Date(),
      }
    ];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('studymate-chat-messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: inputMessage.trim(),
        sender: 'user',
        timestamp: new Date(),
      };
      
      setMessages([...messages, userMessage]);
      setInputMessage('');
      setIsTyping(true);

      // Simulate AI response
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'I understand your question. Let me help you with that!',
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-background border-l border-border shadow-lg transition-all duration-300 ease-in-out z-30 ${
        isOpen ? 'w-full sm:w-96 translate-x-0' : 'w-0 translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border flex-shrink-0 bg-primary/5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">AI Assistant</h2>
              <p className="text-xs text-muted-foreground">Always here to help</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {messages.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setMessages([{
                    id: '1',
                    text: 'Hello! I\'m your AI study assistant. How can I help you today?',
                    sender: 'ai',
                    timestamp: new Date(),
                  }]);
                }}
                className="h-8 px-2 text-xs"
                title="Clear chat"
              >
                Clear
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 px-4 py-4 overflow-y-auto" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex space-x-2 max-w-[85%] ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className={message.sender === 'ai' ? 'bg-primary text-primary-foreground' : 'bg-accent'}>
                      {message.sender === 'ai' ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-accent text-accent-foreground'
                      }`}
                    >
                      <p className="text-sm break-words">{message.text}</p>
                    </div>
                    <span className={`text-xs text-muted-foreground mt-1 ${
                      message.sender === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex space-x-2 max-w-[85%]">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-accent rounded-lg px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border flex-shrink-0">
          <div className="flex space-x-2">
            <Input
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={sendMessage}
              size="sm"
              className="px-3"
              disabled={!inputMessage.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send
          </p>
        </div>
      </div>
    </div>
  );
};
