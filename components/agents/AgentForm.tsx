// components/agents/AgentForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { z } from 'zod';

// Types based on Zod schemas
type Provider = {
  id: string;
  name: string;
  models: Array<{
    id: string;
    name: string;
  }>;
};

type AgentFormData = {
  id?: string;
  name: string;
  providerId: string;
  model: string;
  systemPrompt: string;
  avatar?: string | null;
};

type AgentFormProps = {
  agent?: AgentFormData;
  providers: Provider[];
  isEditing?: boolean;
};

// Common system prompt templates
const SYSTEM_PROMPT_TEMPLATES = {
  'helpful_assistant': `You are a helpful AI assistant. You provide clear, concise, and accurate responses to user queries. You're knowledgeable across many domains and aim to be as helpful as possible.`,
  'creative_writer': `You are a creative writing assistant. You excel at generating imaginative content, stories, and creative ideas. Your writing style is engaging and vivid, bringing concepts to life through descriptive language.`,
  'technical_expert': `You are a technical expert with deep knowledge in programming, computer science, and software development. You provide detailed, accurate technical information and can help debug code, explain complex technical concepts, and guide users through technical implementations.`,
  'character_roleplay': `You are playing the role of a specific character. You should respond in the voice, style, and with the knowledge that would be consistent with this character. Stay in character at all times while being helpful and engaging.`,
  'debate_partner': `You are a thoughtful debate partner who can present balanced arguments on various topics. You consider multiple perspectives, provide evidence-based reasoning, and help explore the nuances of complex issues in a respectful way.`
};

export default function AgentForm({ agent, providers, isEditing = false }: AgentFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<AgentFormData>({
    name: '',
    providerId: providers[0]?.id || '',
    model: '',
    systemPrompt: '',
    avatar: null,
    ...agent
  });
  
  const [availableModels, setAvailableModels] = useState<Array<{id: string, name: string}>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Update available models when provider changes
  useEffect(() => {
    if (formData.providerId) {
      const selectedProvider = providers.find(p => p.id === formData.providerId);
      if (selectedProvider) {
        setAvailableModels(selectedProvider.models);
        // Set default model if none selected or current not available
        if (!formData.model || !selectedProvider.models.find(m => m.id === formData.model)) {
          setFormData(prev => ({
            ...prev,
            model: selectedProvider.models[0]?.id || ''
          }));
        }
      }
    }
  }, [formData.providerId, providers]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const applyTemplate = (templateKey: string) => {
    setFormData(prev => ({
      ...prev,
      systemPrompt: SYSTEM_PROMPT_TEMPLATES[templateKey] || prev.systemPrompt
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Basic validation
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }
      
      if (!formData.providerId) {
        throw new Error('Provider selection is required');
      }
      
      if (!formData.model) {
        throw new Error('Model selection is required');
      }
      
      if (!formData.systemPrompt.trim()) {
        throw new Error('System prompt is required');
      }
      
      const url = isEditing && agent?.id
        ? `/api/agents/${agent.id}`
        : '/api/agents';
      
      const method = isEditing ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to save agent');
      }
      
      // Redirect to agents list on success
      router.push('/agents');
      router.refresh();
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium">
          Agent Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="My Custom Assistant"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="providerId" className="block text-sm font-medium">
          Provider
        </label>
        <select
          id="providerId"
          name="providerId"
          value={formData.providerId}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          {providers.length === 0 ? (
            <option value="" disabled>No providers available - create one first</option>
          ) : (
            providers.map(provider => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))
          )}
        </select>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="model" className="block text-sm font-medium">
          Model
        </label>
        <select
          id="model"
          name="model"
          value={formData.model}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={availableModels.length === 0}
        >
          {availableModels.length === 0 ? (
            <option value="" disabled>No models available for selected provider</option>
          ) : (
            availableModels.map(model => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))
          )}
        </select>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="systemPrompt" className="block text-sm font-medium">
            System Prompt
          </label>
          <div className="flex space-x-2 text-xs">
            <button 
              type="button" 
              onClick={() => applyTemplate('helpful_assistant')}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
            >
              Helpful Assistant
            </button>
            <button 
              type="button" 
              onClick={() => applyTemplate('creative_writer')}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
            >
              Creative Writer
            </button>
            <button 
              type="button" 
              onClick={() => applyTemplate('technical_expert')}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
            >
              Technical Expert
            </button>
          </div>
        </div>
        <textarea
          id="systemPrompt"
          name="systemPrompt"
          value={formData.systemPrompt}
          onChange={handleChange}
          placeholder="Enter instructions for your AI agent..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <p className="text-xs text-gray-500">
          The system prompt defines your agent's personality, knowledge, and behavior.
        </p>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="avatar" className="block text-sm font-medium">
          Avatar URL (Optional)
        </label>
        <input
          id="avatar"
          name="avatar"
          type="text"
          value={formData.avatar || ''}
          onChange={handleChange}
          placeholder="https://example.com/avatar.png"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          onClick={() => router.push('/agents')}
          variant="outline"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || providers.length === 0}
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Agent' : 'Create Agent'}
        </Button>
      </div>
    </form>
  );
}