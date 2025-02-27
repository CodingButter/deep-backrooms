import { auth } from "@/auth"
import { db } from "@/db/schema"
import { providers } from "@/db/schema"
import AgentCreationForm from "@/components/agents/AgentCreationForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const runtime = "edge"

export const metadata = {
  title: "Create New Agent - Deep Backrooms",
}

export default async function CreateAgentPage() {
  const session = await auth()

  // Fetch all available providers
  const availableProviders = await db.select().from(providers)

  // Filter out sensitive data from providers
  const safeProviders = availableProviders.map((provider) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { apiKey, ...safeProvider } = provider

    // Parse models JSON string to object
    const models = JSON.parse(provider.models || "[]")

    return {
      ...safeProvider,
      models,
    }
  })

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
          {safeProviders.length > 0 ? (
            <AgentCreationForm providers={safeProviders} />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                You need to configure at least one provider before creating agents.
              </p>
              <Button asChild>
                <Link href="/dashboard/providers/new">Add Provider</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
