// app/providers/page.tsx
import { db } from '@/db/schema';
import { providers } from '@/db/schema';
import { Suspense } from 'react';
import ProviderList from '@/components/providers/ProviderList';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

async function getProviders() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return [];
  }
  
  try {
    // Fetch all providers
    const allProviders = await db.select().from(providers);
    
    // Parse the JSON fields
    return allProviders.map(provider => ({
      ...provider,
      models: JSON.parse(provider.models || '[]'),
      defaults: provider.defaults ? JSON.parse(provider.defaults) : null,
      rateLimits: provider.rateLimits ? JSON.parse(provider.rateLimits) : null,
    }));
  } catch (error) {
    console.error('Failed to fetch providers:', error);
    return [];
  }
}

async function deleteProvider(providerId: string) {
  'use server';
  
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  
  try {
    // Delete the provider
    await db.delete(providers).where({ id: providerId });
    
    return { success: true };
  } catch (error) {
    console.error('Failed to delete provider:', error);
    throw new Error('Failed to delete provider');
  }
}

export default async function ProvidersPage() {
  const session = await auth();
  
  // Redirect if not authenticated
  if (!session?.user) {
    redirect('/api/auth/signin');
  }
  
  const providersList = await getProviders();
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">AI Providers</h1>
        <p className="text-gray-600">
          Manage your connections to AI service providers
        </p>
      </div>
      
      <Suspense fallback={<div>Loading providers...</div>}>
        <ProviderList 
          providers={providersList} 
          onDeleteProvider={deleteProvider}
        />
      </Suspense>
    </div>
  );
}