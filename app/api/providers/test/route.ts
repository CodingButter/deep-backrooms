// app/api/providers/test/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/db/schema";
import { providers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { providerTestSchema } from "@/zod-schema";

// POST /api/providers/test - Test provider connection
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    // Check authentication
    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Parse and validate request body
    const body = await req.json();
    const validationResult = providerTestSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { providerId } = validationResult.data;
    
    // Get provider details
    const provider = await db
      .select()
      .from(providers)
      .where(eq(providers.id, providerId))
      .limit(1);
    
    if (!provider.length) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }
    
    const providerData = provider[0];
    
    // Test connection based on provider type
    let testResult;
    
    try {
      // Import the appropriate provider handler dynamically
      const { testConnection } = await getProviderHandler(providerData.baseUrl);
      testResult = await testConnection(providerData);
      
      return NextResponse.json({
        success: true,
        message: "Connection successful",
        models: testResult.models || []
      });
    } catch (error: any) {
      console.error("Provider test failed:", error);
      return NextResponse.json({
        success: false,
        error: error.message || "Connection failed",
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Error testing provider:", error);
    return NextResponse.json(
      { error: "Failed to test provider" },
      { status: 500 }
    );
  }
}

// Helper function to get the appropriate provider handler
async function getProviderHandler(baseUrl: string) {
  // Determine which provider handler to use based on the base URL
  if (baseUrl.includes('openai.com')) {
    const { default: openaiHandler } = await import('@/lib/providers/openai');
    return openaiHandler;
  } else if (baseUrl.includes('anthropic.com')) {
    const { default: anthropicHandler } = await import('@/lib/providers/anthropic');
    return anthropicHandler;
  } else if (baseUrl.includes('mistral.ai')) {
    const { default: mistralHandler } = await import('@/lib/providers/mistral');
    return mistralHandler;
  } else {
    // Default to a generic handler for custom providers
    const { default: genericHandler } = await import('@/lib/providers/generic');
    return genericHandler;
  }
}