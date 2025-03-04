import { Metadata } from "next"
import CreateAgentForm from "@/components/agents/create-agent-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { auth } from "@/auth"
import { db } from "@/db"
import { aiProviders, providerModels } from "@/db/schema/agentconversation"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

export const metadata: Metadata = {
  title: "Create Agent - Deep Backrooms",
  description: "Create a new AI agent with custom personality and behavior",
}

export default async function CreateAgentPage() {
  const session = await auth()

  // Redirect to login if not authenticated
  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/dashboard/agents/new")
  }

  // Fetch all available providers
  const providers = await db
    .select({
      id: aiProviders.id,
      name: aiProviders.name,
      baseUrl: aiProviders.baseUrl,
      type: aiProviders.providerType,
    })
    .from(aiProviders)
    .where(eq(aiProviders.status, "active"))

  // For each provider, fetch available models
  const providersWithModels = await Promise.all(
    providers.map(async (provider) => {
      const models = await db
        .select({
          id: providerModels.id,
          name: providerModels.model,
          displayName: providerModels.displayName ?? undefined, // Convert null to undefined
          contextWindow: providerModels.contextWindow,
          isExperimental: providerModels.isExperimental,
        })
        .from(providerModels)
        .where(eq(providerModels.providerId, provider.id))

      // Transform models to match the expected type (ensuring displayName is string|undefined not string|null)
      const typeSafeModels = models.map((model) => ({
        ...model,
        displayName: model.displayName === null ? undefined : model.displayName,
      }))

      return {
        ...provider,
        models: typeSafeModels,
      }
    })
  )

  // If no providers available, show message
  if (providersWithModels.length === 0) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link href="/dashboard/agents">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Agents
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Create New Agent</h1>
        </div>

        <Card className="border-border/40 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center">
              <div className="mr-4 bg-primary/10 p-2 rounded-md">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Agent Details</CardTitle>
                <CardDescription>
                  Create a new AI agent with customized personality and behavior
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                You need to configure at least one provider before creating agents.
              </p>
              <Button asChild>
                <Link href="/dashboard/providers/new">Add Provider</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/dashboard/agents">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Agents
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create New Agent</h1>
      </div>

      <Card className="border-border/40 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center">
            <div className="mr-4 bg-primary/10 p-2 rounded-md">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Agent Details</CardTitle>
              <CardDescription>
                Create a new AI agent with customized personality and behavior
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CreateAgentForm providers={providersWithModels} userId={session.user.id} />
        </CardContent>
      </Card>
    </div>
  )
}
