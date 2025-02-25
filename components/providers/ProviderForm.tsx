// components/providers/ProviderForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { z } from 'zod';

type ProviderModel = {
  id: string;
  name: string;
};

type ProviderFormData = {
  id?: string;
  name: string;
  baseUrl: string;
  apiKey: string;
  organizationId?: string;
  models: ProviderModel[];
  defaults?: {
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
  };
  active?: boolean;
};

type ProviderFormProps = {
  provider?: ProviderFormData;
  isEditing?: boolean;
};

// Default values for common providers
const PROVIDER_PRESETS = {
  openai: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    models: [
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
      { id: 'gpt-4', name: 'GPT-4' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' }
    ]
  },
  anthropic: {
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com',
    models: [
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
      { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet' },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' }
    ]
  }
};

export default function ProviderForm({ provider, isEditing = false }: ProviderFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ProviderFormData>({
    name: '',
    baseUrl: '',
    apiKey: '',
    organizationId: '',
    models: [],
    defaults: {
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    },
    active: true,
    ...provider
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newModelName, setNewModelName] = useState('');
  const [newModelId, setNewModelId] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties for defaults
    if (name.startsWith('defaults.')) {
      const defaultProperty = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        defaults: {
          ...prev.defaults,
          [defaultProperty]: defaultProperty === 'max_tokens' ? 
            (value === '' ? undefined : parseInt(value)) : 
            (value === '' ? undefined : parseFloat(value))
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const applyPreset = (presetKey: 'openai' | 'anthropic') => {
    const preset = PROVIDER_PRESETS[presetKey];
    setFormData(prev => ({
      ...prev,
      name: preset.name,
      baseUrl: preset.baseUrl,
      models: preset.models
    }));
  };

  const addModel = () => {
    if (newModelId.trim() && newModelName.trim()) {
      setFormData(prev => ({
        ...prev,
        models: [...prev.models, { id: newModelId, name: newModelName }]
      }));
      setNewModelId('');
      setNewModelName('');
    }
  };

  const removeModel = (modelId: string) => {
    setFormData(prev => ({
      ...prev,
      models: prev.models.filter(model => model.id !== modelId)
    }));
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Need a provider ID for the test endpoint
      const testId = provider?.id || 'temp-' + Date.now();
      
      const response = await fetch('/api/providers/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          providerId: testId,
          ...formData
        })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Connection test failed');
      }
      
      setSuccess('Connection successful! Provider is working correctly.');
    } catch (err) {
      setError(err.message || 'Connection test failed');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Basic validation
      if (!formData.name.trim()) {
        throw new Error('Provider name is required');
      }
      
      if (!formData.baseUrl.trim()) {
        throw new Error('Base URL is required');
      }
      
      if (!formData.apiKey.trim()) {
        throw new Error('API key is required');
      }
      
      if (formData.models.length === 0) {
        throw new Error('At least one model is required');
      }
      
      const url = isEditing && provider?.id
        ? `/api/providers/${provider.id}`
        : '/api/providers';
      
      const method = isEditing ? 'PATCH' : 'POST';
      
      // Transform the data for the API
      const apiData = {
        ...formData,
        // Convert models and defaults to strings as expected by the API
        models: JSON.stringify(formData.models),
        defaults: formData.defaults ? JSON.stringify(formData.defaults) : null
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiData)
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to save provider');
      }
      
      // Redirect to providers list on success
      router.push('/providers');
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
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 mb-4">
          {success}
        </div>
      )}
      
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => applyPreset('openai')}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
        >
          Use OpenAI Preset
        </button>
        <button
          type="button"
          onClick={() => applyPreset('anthropic')}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
        >
          Use Anthropic Preset
        </button>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium">
          Provider Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="My OpenAI Account"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="baseUrl" className="block text-sm font-medium">
          Base URL
        </label>
        <input
          id="baseUrl"
          name="baseUrl"
          type="url"
          value={formData.baseUrl}
          onChange={handleChange}
          placeholder="https://api.openai.com/v1"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="apiKey" className="block text-sm font-medium">
          API Key
        </label>
        <input
          id="apiKey"
          name="apiKey"
          type="password"
          value={formData.apiKey}
          onChange={handleChange}
          placeholder="sk-..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="organizationId" className="block text-sm font-medium">
          Organization ID (Optional)
        </label>
        <input
          id="organizationId"
          name="organizationId"
          type="text"
          value={formData.organizationId || ''}
          onChange={handleChange}
          placeholder="org-..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium mb-2">
          Available Models
        </label>
        
        {formData.models.length > 0 ? (
          <div className="mb-4 space-y-2">
            {formData.models.map(model => (
              <div key={model.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <div>
                  <span className="font-medium">{model.name}</span>
                  <span className="text-gray-500 text-xs ml-2">({model.id})</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeModel(model.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-amber-600 mb-4 text-sm">
            No models added yet. Please add at least one model.
          </div>
        )}
        
        <div className="flex space-x-2">
          <input
            type="text"
            value={newModelId}
            onChange={(e) => setNewModelId(e.target.value)}
            placeholder="Model ID (e.g., gpt-4)"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={newModelName}
            onChange={(e) => setNewModelName(e.target.value)}
            placeholder="Display Name (e.g., GPT-4)"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addModel}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            disabled={!newModelId.trim() || !newModelName.trim()}
          >
            Add
          </button>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <h3 className="font-medium mb-2">Default Parameters (Optional)</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="defaults.temperature" className="block text-sm">
              Temperature
            </label>
            <input
              id="defaults.temperature"
              name="defaults.temperature"
              type="number"
              min="0"
              max="2"
              step="0.1"
              value={formData.defaults?.temperature ?? ''}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-1">
            <label htmlFor="defaults.max_tokens" className="block text-sm">
              Max Tokens
            </label>
            <input
              id="defaults.max_tokens"
              name="defaults.max_tokens"
              type="number"
              min="1"
              value={formData.defaults?.max_tokens ?? ''}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-1">
            <label htmlFor="defaults.top_p" className="block text-sm">
              Top P
            </label>
            <input
              id="defaults.top_p"
              name="defaults.top_p"
              type="number"
              min="0"
              max="1"
              step="0.05"
              value={formData.defaults?.top_p ?? ''}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-1">
            <label htmlFor="defaults.frequency_penalty" className="block text-sm">
              Frequency Penalty
            </label>
            <input
              id="defaults.frequency_penalty"
              name="defaults.frequency_penalty"
              type="number"
              min="-2"
              max="2"
              step="0.1"
              value={formData.defaults?.frequency_penalty ?? ''}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      {isEditing && (
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm font-medium">Active</span>
          </label>
          <p className="text-xs text-gray-500">
            Inactive providers will not be available for creating new agents.
          </p>
        </div>
      )}
      
      <div className="pt-4 flex flex-col space-y-4">
        <button
          type="button"
          onClick={testConnection}
          disabled={isSubmitting || isTestingConnection || !formData.baseUrl || !formData.apiKey}
          className="w-full bg-green-500 text-white rounded-md py-2 px-4 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
        >
          {isTestingConnection ? 'Testing...' : 'Test Connection'}
        </button>
        
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            onClick={() => router.push('/providers')}
            variant="outline"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || formData.models.length === 0}
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Provider' : 'Create Provider'}
          </Button>
        </div>
      </div>
    </form>
  );
}