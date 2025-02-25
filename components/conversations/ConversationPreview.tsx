// components/conversations/ConversationPreview.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: number;
  agentId?: string;
};

type Agent = {
  id: string;
  name: string;
  avatar?: string | null;
};

type ConversationPreviewProps = {
  messages: Message[];
  agents: Agent[];
  autoPlay?: boolean;
  speed?: number; // ms between messages
  loop?: boolean;
};

export default function ConversationPreview({ 
  messages, 
  agents, 
  autoPlay = true,
  speed = 2000,
  loop = true
}: ConversationPreviewProps) {
  const [visibleCount, setVisibleCount] = useState(autoPlay ? 0 : messages.length);
  const [paused, setPaused] = useState(!autoPlay);

  // Filter out system messages for display
  const displayMessages = messages.filter(m => m.role !== 'system');

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!paused && visibleCount < displayMessages.length) {
      interval = setInterval(() => {
        setVisibleCount(prev => prev + 1);
      }, speed);
    } else if (visibleCount >= displayMessages.length && loop) {
      // Reset after a delay if looping
      interval = setTimeout(() => {
        setVisibleCount(0);
      }, speed * 2);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [visibleCount, paused, displayMessages.length, speed, loop]);

  const togglePlayPause = () => {
    setPaused(prev => !prev);
  };

  const getAgentForMessage = (message: Message) => {
    if (message.role === 'user') {
      return { name: 'You', avatar: null };
    }
    
    if (message.agentId) {
      return agents.find(agent => agent.id === message.agentId) || 
        { id: message.agentId, name: 'AI', avatar: null };
    }
    
    // Assign agents in order for demo purposes if no specific mapping
    const agentIndex = displayMessages.filter(m => m.role === 'assistant')
      .findIndex(m => m === message);
    
    const assistantAgents = agents.filter(a => a.id !== 'user');
    return assistantAgents[agentIndex % assistantAgents.length] || 
      { id: 'unknown', name: 'AI', avatar: null };
  };

  return (
    <div className="rounded-lg border shadow-xl bg-black/5 backdrop-blur-sm p-4 max-w-2xl w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-xl">Live Conversation</h3>
        <button 
          onClick={togglePlayPause}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          {paused ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          )}
        </button>
      </div>
      
      <div className="space-y-4 h-[500px] overflow-y-auto p-2 conversation-container">
        <AnimatePresence>
          {displayMessages.slice(0, visibleCount).map((message, index) => {
            const agent = getAgentForMessage(message);
            const isUser = message.role === 'user';
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} max-w-[80%]`}>
                  <div className={`${isUser ? 'ml-2' : 'mr-2'} flex-shrink-0`}>
                    {agent.avatar ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <Image 
                          src={agent.avatar} 
                          alt={agent.name} 
                          width={40} 
                          height={40} 
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white 
                        ${isUser ? 'bg-blue-500' : 'bg-purple-500'}`}>
                        {agent.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 mb-1">
                      {agent.name}
                    </span>
                    <div 
                      className={`rounded-2xl px-4 py-2 inline-block 
                        ${isUser 
                          ? 'bg-blue-500 text-white rounded-tr-none' 
                          : 'bg-gray-200 text-gray-800 rounded-tl-none'
                        }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}