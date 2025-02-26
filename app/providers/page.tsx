// app/providers/page.tsx
import { db } from '@/db/schema';
import { providers } from '@/db/schema';
import { Suspense } from 'react';
import ProviderList from '@/components/providers/ProviderList';
import { auth } from '@/auth';
import { eq } from 'drizzle-orm';

async function getProviders() {
  const session = await auth();
  
  try {
    // Fetch all providers
    const allProviders = await db
      .select({
        id: providers.id,
        name: providers.name,
        baseUrl: providers.baseUrl,
        apiKey: providers.apiKey,
        organizationId: providers.organizationId,
        models: providers.models,
        defaults: providers.defaults,
        rateLimits: providers.rateLimits,
        active: providers.active,
        createdAt: providers.createdAt,
        updatedAt: providers.updatedAt
      })
      .from(providers);
    
    // Parse the JSON fields and convert timestamps
    return allProviders.map(provider => ({
      ...provider,
      models: JSON.parse(provider.models || '[]'),
      defaults: provider.defaults ? JSON.parse(provider.defaults) : null,
      rateLimits: provider.rateLimits ? JSON.parse(provider.rateLimits) : null,
      createdAt: provider.createdAt ? Number(provider.createdAt) : undefined,
      updatedAt: provider.updatedAt ? Number(provider.updatedAt) : undefined,
    }));
  } catch (error) {
    console.error('Failed to fetch providers:', error);
    return [];
  }
}

async function deleteProvider(id: string) {
  'use server';
  
  const session = await auth();
  
  try {
    // Delete the provider
    await db.delete(providers)
      .where(eq(providers.id, id));
  } catch (error) {
    console.error('Failed to delete provider:', error);
    throw new Error('Failed to delete provider');
  }
}

export default async function ProvidersPage() {
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