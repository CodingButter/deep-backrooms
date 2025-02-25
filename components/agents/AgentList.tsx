// components/agents/AgentList.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

type Agent = {
  id: string;
  name: string;
  providerId: string;
  model: string;
  systemPrompt: string;
  avatar?: string | null;
  userId: string;
  createdAt: number;
  updatedAt: number;
  provider?: {
    name: string;
  };
};

type AgentListProps = {
  agents: Agent[];
  onDeleteAgent?: (id: string) => Promise<void>;
};

export default function AgentList({ agents, onDeleteAgent }: AgentListProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteClick = (agentId: string) => {
    setConfirmDelete(agentId);
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  const handleConfirmDelete = async (agentId: string) => {
    if (!onDeleteAgent) return;
    
    setIsDeleting(true);
    setError(null);
    
    try {
      await onDeleteAgent(agentId);
      setConfirmDelete(null);
    } catch (err) {
      setError(err.message || 'Failed to delete agent');
    } finally {
      setIsDeleting(false);
    }
  };

  if (agents.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 mb-4">No agents created yet</p>
        <Link href="/agents/new">
          <Button>Create First Agent</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
          {error}
        </div>
      )}
      
      <div className="flex justify-end mb-4">
        <Link href="/agents/new">
          <Button>Create Agent</Button>
        </Link>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map(agent => (
          <div 
            key={agent.id} 
            className="border rounded-lg overflow-hidden shadow-sm"
          >
            <div className="h-24 bg-gradient-to-r from-blue-400 to-indigo-500 relative">
              {agent.avatar ? (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                  <Image
                    src={agent.avatar}
                    alt={agent.name}
                    width={80}
                    height={80}
                    className="rounded-full border-4 border-white"
                  />
                </div>
              ) : (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-20 h-20 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-500">
                    {agent.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            <div className="pt-12 p-4">
              <h3 className="font-semibold text-lg text-center">{agent.name}</h3>
              
              <div className="mt-2 text-sm text-gray-500 text-center">
                <p>Model: {agent.model}</p>
                {agent.provider && <p>Provider: {agent.provider.name}</p>}
              </div>
              
              <div className="mt-4 border-t pt-3">
                <p className="text-sm font-medium mb-1">System Prompt:</p>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {agent.systemPrompt}
                </p>
              </div>
              
              <div className="mt-4 pt-3 border-t flex justify-between">
                {confirmDelete === agent.id ? (
                  <div className="flex space-x-2 items-center">
                    <span className="text-sm text-red-600">Confirm delete?</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelDelete}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleConfirmDelete(agent.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Link href={`/agents/${agent.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/agents/${agent.id}/chat`}>
                      <Button size="sm">
                        Chat
                      </Button>
                    </Link>
                    {onDeleteAgent && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(agent.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}