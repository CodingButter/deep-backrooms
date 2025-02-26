// components/providers/ProviderList.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type ProviderModel = {
  id: string;
  name: string;
};

type Provider = {
  id: string;
  name: string;
  baseUrl: string;
  apiKey: string;
  organizationId?: string | null;
  models: ProviderModel[];
  defaults?: {
    temperature?: number;
    max_tokens?: number;
  } | null;
  rateLimits?: {
    requestsPerMinute?: number;
    tokensPerMinute?: number;
  } | null;
  active: boolean;
  createdAt?: number;
  updatedAt?: number;
};

type ProviderListProps = {
  providers: Provider[];
  onDeleteProvider?: (id: string) => Promise<void>;
};

export default function ProviderList({ providers, onDeleteProvider }: ProviderListProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteClick = (providerId: string) => {
    setConfirmDelete(providerId);
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  const handleConfirmDelete = async (providerId: string) => {
    if (!onDeleteProvider) return;
    
    setIsDeleting(true);
    setError(null);
    
    try {
      await onDeleteProvider(providerId);
      setConfirmDelete(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete provider');
    } finally {
      setIsDeleting(false);
    }
  };

  if (providers.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 mb-4">No providers configured yet</p>
        <Link href="/providers/new">
          <Button>Add First Provider</Button>
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
        <Link href="/providers/new">
          <Button>Add Provider</Button>
        </Link>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {providers.map(provider => (
          <div 
            key={provider.id} 
            className={`border rounded-lg p-4 shadow-sm ${!provider.active && 'opacity-60'}`}
          >
            {/* Rest of the component remains the same */}
          </div>
        ))}
      </div>
    </div>
  );
}