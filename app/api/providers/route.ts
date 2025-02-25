// app/api/providers/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/db/schema";
import { providers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { insertProviderSchema, updateProviderSchema } from "@/zod-schema";

// GET /api/providers - Get all providers
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    // Check authentication
    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Retrieve providers from database
    const allProviders = await db.select().from(providers);
    
    // Remove sensitive data like API keys from response
    const safeProviders = allProviders.map(provider => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { apiKey, ...safeProvider } = provider;
      return safeProvider;
    });
    
    return NextResponse.json({ providers: safeProviders });
  } catch (error) {
    console.error("Error fetching providers:", error);
    return NextResponse.json(
      { error: "Failed to fetch providers" },
      { status: 500 }
    );
  }
}

// POST /api/providers - Create a new provider
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
    const validationResult = insertProviderSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid provider data", details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    // Create provider in database
    const provider = validationResult.data;
    const now = new Date().getTime();
    
    const newProvider = await db.insert(providers).values({
      ...provider,
      createdAt: now,
      updatedAt: now,
    }).returning();
    
    // Remove sensitive data from response
    if (newProvider[0]) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { apiKey, ...safeProvider } = newProvider[0];
      return NextResponse.json({ provider: safeProvider }, { status: 201 });
    }
    
    return NextResponse.json(
      { error: "Failed to create provider" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error creating provider:", error);
    return NextResponse.json(
      { error: "Failed to create provider" },
      { status: 500 }
    );
  }
}

// API route for testing provider credentials
export async function PUT(req: NextRequest) {
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
    const validationResult = updateProviderSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid provider data", details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { id, ...updateData } = validationResult.data;
    
    // Update provider in database
    const updatedProvider = await db
      .update(providers)
      .set({ ...updateData, updatedAt: new Date().getTime() })
      .where(eq(providers.id, id))
      .returning();
    
    if (!updatedProvider.length) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }
    
    // Remove sensitive data from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { apiKey, ...safeProvider } = updatedProvider[0];
    
    return NextResponse.json({ provider: safeProvider });
  } catch (error) {
    console.error("Error updating provider:", error);
    return NextResponse.json(
      { error: "Failed to update provider" },
      { status: 500 }
    );
  }
}