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
  active: boolean;
  createdAt: number;
  updatedAt: number;
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
    } catch (err) {
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
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg truncate">{provider.name}</h3>
              {!provider.active && (
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
                  Inactive
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-500 truncate">{provider.baseUrl}</p>
            
            <div className="mt-2">
              <p className="text-sm font-medium">Available Models:</p>
              <div className="text-sm text-gray-600 mt-1">
                {provider.models.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {provider.models.slice(0, 3).map(model => (
                      <li key={model.id} className="truncate">{model.name}</li>
                    ))}
                    {provider.models.length > 3 && (
                      <li className="text-gray-400">{provider.models.length - 3} more...</li>
                    )}
                  </ul>
                ) : (
                  <p className="text-amber-600">No models configured</p>
                )}
              </div>
            </div>
            
            <div className="mt-4 pt-2 border-t flex justify-between">
              {confirmDelete === provider.id ? (
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
                    onClick={() => handleConfirmDelete(provider.id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link href={`/providers/${provider.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  {onDeleteProvider && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(provider.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}