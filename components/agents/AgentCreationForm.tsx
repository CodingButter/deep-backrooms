"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useFormState } from "react-dom"
import { createAgent, AgentFormState } from "@/app/actions/agents"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertCircle, Bot, Check, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Common system prompt templates
const SYSTEM_PROMPT_TEMPLATES = {
  helpful_assistant: `You are a helpful AI assistant. You provide clear, concise, and accurate responses to user queries. You're knowledgeable across many domains and aim to be as helpful as possible.`,
  creative_writer: `You are a creative writing assistant. You excel at generating imaginative content, stories, and creative ideas. Your writing style is engaging and vivid, bringing concepts to life through descriptive language.`,
  technical_expert: `You are a technical expert with deep knowledge in programming, computer science, and software development. You provide detailed, accurate technical information and can help debug code, explain complex technical concepts, and guide users through technical implementations.`,
  character_roleplay: `You are playing the role of a specific character. You should respond in the voice, style, and with the knowledge that would be consistent with this character. Stay in character at all times while being helpful and engaging.`,
  debate_partner: `You are a thoughtful debate partner who can present balanced arguments on various topics. You consider multiple perspectives, provide evidence-based reasoning, and help explore the nuances of complex issues in a respectful way.`,
  philosopher: `You are a philosopher exploring deep questions about existence, knowledge, values, reason, mind, and language. You approach topics with thoughtful analysis, considering multiple perspectives while acknowledging the limitations of human understanding.`,
  scientist: `You are a scientist committed to the scientific method, empirical evidence, and rational inquiry. You explain complex scientific concepts clearly, distinguish between established theory and speculative ideas, and maintain a healthy skepticism.`,
}

type Provider = {
  id: string
  name: string
  models: Array<{
    id: string
    name: string
  }>
}

type AgentCreationFormProps = {
  providers: Provider[]
}

const initialState: AgentFormState = {
  success: false,
}

export default function AgentCreationForm({ providers }: AgentCreationFormProps) {
  const router = useRouter()
  const [state, formAction] = useFormState(createAgent, initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedProviderId, setSelectedProviderId] = useState(providers[0]?.id || "")
  const [selectedModel, setSelectedModel] = useState("")
  const [availableModels, setAvailableModels] = useState<Array<{ id: string; name: string }>>([])
  const [templateTab, setTemplateTab] = useState("custom")

  // Update available models when provider changes
  useEffect(() => {
    if (selectedProviderId) {
      const selectedProvider = providers.find((p) => p.id === selectedProviderId)
      if (selectedProvider) {
        setAvailableModels(selectedProvider.models)

        // Set default model if available
        if (selectedProvider.models.length > 0) {
          setSelectedModel(selectedProvider.models[0].id)
        } else {
          setSelectedModel("")
        }
      }
    }
  }, [selectedProviderId, providers])

  // Handle form submission state
  useEffect(() => {
    if (state.success) {
      router.push("/dashboard/agents")
    }
    setIsSubmitting(false)
  }, [state, router])

  const handleSubmit = (formData: FormData) => {
    setIsSubmitting(true)
    formAction(formData)
  }

  const applyTemplate = (templateKey: string) => {
    const textarea = document.getElementById("systemPrompt") as HTMLTextAreaElement
    if (textarea && SYSTEM_PROMPT_TEMPLATES[templateKey as keyof typeof SYSTEM_PROMPT_TEMPLATES]) {
      textarea.value = SYSTEM_PROMPT_TEMPLATES[templateKey as keyof typeof SYSTEM_PROMPT_TEMPLATES]
      setTemplateTab(templateKey)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {state.message && !state.success && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className={state.errors?.name ? "text-destructive" : ""}>
            Agent Name *
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="My Custom Assistant"
            className={state.errors?.name ? "border-destructive" : ""}
            required
          />
          {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="avatar">Avatar URL (Optional)</Label>
          <Input
            id="avatar"
            name="avatar"
            placeholder="https://example.com/avatar.png"
            type="url"
          />
          {state.errors?.avatar && (
            <p className="text-sm text-destructive">{state.errors.avatar[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="providerId"
            className={state.errors?.providerId ? "text-destructive" : ""}
          >
            Provider *
          </Label>
          <Select
            name="providerId"
            value={selectedProviderId}
            onValueChange={setSelectedProviderId}
            required
          >
            <SelectTrigger
              id="providerId"
              className={state.errors?.providerId ? "border-destructive" : ""}
            >
              <SelectValue placeholder="Select a provider" />
            </SelectTrigger>
            <SelectContent>
              {providers.map((provider) => (
                <SelectItem key={provider.id} value={provider.id}>
                  {provider.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.errors?.providerId && (
            <p className="text-sm text-destructive">{state.errors.providerId[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="model" className={state.errors?.model ? "text-destructive" : ""}>
            Model *
          </Label>
          <Select
            name="model"
            value={selectedModel}
            onValueChange={setSelectedModel}
            disabled={availableModels.length === 0}
            required
          >
            <SelectTrigger id="model" className={state.errors?.model ? "border-destructive" : ""}>
              <SelectValue
                placeholder={
                  availableModels.length === 0 ? "No models available" : "Select a model"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.errors?.model && (
            <p className="text-sm text-destructive">{state.errors.model[0]}</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label
            htmlFor="systemPrompt"
            className={state.errors?.systemPrompt ? "text-destructive" : ""}
          >
            System Prompt *
          </Label>

          <Tabs value={templateTab} onValueChange={setTemplateTab} className="w-full max-w-md">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="custom" onClick={() => setTemplateTab("custom")}>
                Custom
              </TabsTrigger>
              <TabsTrigger
                value="helpful_assistant"
                onClick={() => applyTemplate("helpful_assistant")}
              >
                Assistant
              </TabsTrigger>
              <TabsTrigger
                value="technical_expert"
                onClick={() => applyTemplate("technical_expert")}
              >
                Technical
              </TabsTrigger>
              <TabsTrigger value="creative_writer" onClick={() => applyTemplate("creative_writer")}>
                Creative
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Textarea
          id="systemPrompt"
          name="systemPrompt"
          placeholder="Enter instructions for your AI agent..."
          className={`min-h-[200px] ${state.errors?.systemPrompt ? "border-destructive" : ""}`}
          required
        />

        {state.errors?.systemPrompt && (
          <p className="text-sm text-destructive">{state.errors.systemPrompt[0]}</p>
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          <TemplateButton onClick={() => applyTemplate("philosopher")} label="Philosopher" />
          <TemplateButton onClick={() => applyTemplate("scientist")} label="Scientist" />
          <TemplateButton onClick={() => applyTemplate("debate_partner")} label="Debate Partner" />
          <TemplateButton onClick={() => applyTemplate("character_roleplay")} label="Character" />
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          The system prompt defines your agent's personality, knowledge, and behavior.
        </p>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/agents")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || providers.length === 0}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Bot className="mr-2 h-4 w-4" />
              Create Agent
            </>
          )}
        </Button>
      </div>

      {state.success && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <Check className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Your agent has been created successfully.</AlertDescription>
        </Alert>
      )}
    </form>
  )
}

function TemplateButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      className="text-xs bg-background"
    >
      {label}
    </Button>
  )
}
