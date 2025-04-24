import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const AiHelpdesk = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Good day, I’m Sophia. How may I assist you today?
Welcome to the TechHR India 2025 Application Portal.
Discover exceptional opportunities to elevate your startup at Asia’s premier HR conference.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTimestamp = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: 'user' as const,
      content: input,
      timestamp: formatTimestamp()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_question: input }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        timestamp: formatTimestamp()
      }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from AI",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleHelperClick = (text: string) => {
    setInput(text);
  };

  return (
    <div className="flex flex-col mx-auto my-4 rounded-lg border bg-card shadow-sm">
      <div className="flex items-center gap-2 p-4 border-b bg-secondary/10">
        <MessageCircle className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-semibold">AI Helpdesk</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <img
                src="https://res.cloudinary.com/people-matters/image/upload/w_64,h_65/v1738759913/techhr/2025/in/favicon.png" // Replace with the actual path to the assistant logo
                alt="Assistant"
                className="h-8 w-8 rounded-full mr-2"
              />
            )}
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground ml-4'
                  : 'bg-muted mr-4'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp}
              </span>
            </div>
            {message.role === 'user' && (
              <img
                src="src/assets/users.png" // Replace with the actual path to the user logo
                alt="User"
                className="h-8 w-8 rounded-full ml-2"
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Text Helpers */}
      <div className="p-4 border-t bg-secondary/10 flex gap-2">
        <button
          onClick={() => handleHelperClick("Who are all the speakers?")}
          className="px-4 py-2 bg-muted text-sm rounded-lg hover:bg-muted/80"
        >
        👨🏽‍💼 Who are all the speakers?
        </button>
        <button
          onClick={() => handleHelperClick("What is this event about?")}
          className="px-4 py-2 bg-muted text-sm rounded-lg hover:bg-muted/80"
        >
          📅 What is this event about?
        </button>
        <button
          onClick={() => handleHelperClick("Where is the event located?")}
          className="px-4 py-2 bg-muted text-sm rounded-lg hover:bg-muted/80"
        >
          📍 Where is the event located?
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question here..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AiHelpdesk;