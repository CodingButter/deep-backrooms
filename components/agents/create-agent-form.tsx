"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { insertAgentSchema } from "@/zod-schema"
import { createAgent } from "@/app/actions/agents"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Bot, HelpCircle, Info, Loader2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

// Available tool access options
const TOOL_ACCESS_OPTIONS = [
  { value: "web_search", label: "Web Search" },
  { value: "code_interpreter", label: "Code Interpreter" },
  { value: "file_access", label: "File Access" },
  { value: "knowledge_base", label: "Knowledge Base" },
  { value: "image_generation", label: "Image Generation" },
  { value: "audio_analysis", label: "Audio Analysis" },
]

// Available category tags
const CATEGORY_TAGS_OPTIONS = [
  { value: "creative", label: "Creative" },
  { value: "technical", label: "Technical" },
  { value: "assistant", label: "Assistant" },
  { value: "education", label: "Education" },
  { value: "entertainment", label: "Entertainment" },
  { value: "business", label: "Business" },
  { value: "productivity", label: "Productivity" },
  { value: "roleplay", label: "Roleplay" },
]

type Provider = {
  id: string
  name: string
  models: Array<{
    id: string | null
    name: string
    displayName?: string | undefined
    contextWindow: number
    isExperimental: boolean
  }>
}

type CreateAgentFormProps = {
  providers: Provider[]
  userId: string
}

// InfoTooltip component for consistent tooltip styling
function InfoTooltip({ content }: { content: string }) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground cursor-help inline-flex" />
        </TooltipTrigger>
        <TooltipContent className="max-w-sm p-2 text-sm bg-background border shadow-md">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Section title with tooltip
function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-center">
      <h3 className="font-medium">{title}</h3>
      <InfoTooltip content={description} />
    </div>
  )
}

export default function CreateAgentForm({ providers, userId }: CreateAgentFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedProviderId, setSelectedProviderId] = useState(providers[0]?.id || "")
  const [availableModels, setAvailableModels] = useState<Provider["models"][0][]>([])
  const [templateTab, setTemplateTab] = useState<string>("custom")
  const [toolsSelected, setToolsSelected] = useState<string[]>([])
  const [tagsSelected, setTagsSelected] = useState<string[]>([])

  // Initialize form with react-hook-form and zod resolver
  const form = useForm<z.infer<typeof insertAgentSchema>>({
    resolver: zodResolver(insertAgentSchema),
    defaultValues: {
      name: "",
      description: "",
      avatar: null,
      providerId: providers[0]?.id || "",
      modelId: "",
      temperature: 0.7,
      maxTokens: 4096,
      topP: 1.0,
      frequencyPenalty: 0,
      systemPrompt: "",
      persona: {},
      toolAccess: [],
      memoryEnabled: false,
      sessionLimit: 5,
      customModelParams: {},
      visibilityScope: "private",
      version: "1.0",
      categoryTags: [],
    },
  })

  // Update available models when provider changes
  useEffect(() => {
    const selectedProvider = providers.find((p) => p.id === selectedProviderId)
    if (selectedProvider) {
      setAvailableModels(selectedProvider.models)

      // Set default model if available
      if (selectedProvider.models.length > 0 && selectedProvider.models[0].id !== null) {
        form.setValue("modelId", selectedProvider.models[0].id)
      }
    }
  }, [selectedProviderId, providers, form])

  // Handle form submission - now calls createAgent action directly
  const handleSubmit = async (data: z.infer<typeof insertAgentSchema>) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Prepare form data
      const formData = new FormData()

      // Add basic fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString())
        }
      })

      // Add JSON serialized fields
      formData.set("toolAccess", JSON.stringify(toolsSelected))
      formData.set("categoryTags", JSON.stringify(tagsSelected))
      formData.set("persona", JSON.stringify(data.persona || {}))
      formData.set("customModelParams", JSON.stringify(data.customModelParams || {}))

      // Call the action directly with user ID
      const result = await createAgent(userId, { errors: {} }, formData)

      if (result.errors && Object.keys(result.errors).length > 0) {
        setError("Please check the form for errors")
        console.error("Validation errors:", result.errors)
        setIsSubmitting(false)
      } else {
        // Success - redirect to agents list
        router.push("/dashboard/agents")
        router.refresh()
      }
    } catch (err) {
      console.error("Agent creation failed", err)
      setError("Failed to create agent. Please try again.")
      setIsSubmitting(false)
    }
  }

  // Apply system prompt template
  const applyTemplate = (templateKey: keyof typeof SYSTEM_PROMPT_TEMPLATES) => {
    form.setValue("systemPrompt", SYSTEM_PROMPT_TEMPLATES[templateKey])
    setTemplateTab(templateKey)
  }

  // Toggle tool selection
  const toggleTool = (value: string) => {
    setToolsSelected((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    )
  }

  // Toggle tag selection
  const toggleTag = (value: string) => {
    setTagsSelected((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
            {error}
          </div>
        )}

        {/* Basic Information Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Agent Details
              <InfoTooltip content="Basic information about your AI agent that helps identify and describe it in the system." />
            </CardTitle>
            <CardDescription>Create a new AI agent with custom personality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Agent Name
                      <InfoTooltip content="The display name of your agent. This is how it will be identified in conversations and listings." />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="My Custom Assistant" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Avatar URL
                      <InfoTooltip content="An optional image URL for your agent's avatar. This helps visually identify your agent in the interface." />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/avatar.png"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Description
                    <InfoTooltip content="A short description of what this agent does and what it's good at. This helps users understand the agent's purpose and capabilities." />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what this agent does and its specialties..."
                      className="h-20"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Separator />

        {/* Provider and Model Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Provider & Model
              <InfoTooltip content="The AI service provider and specific model that powers your agent. Different models have different capabilities, knowledge cutoffs, and pricing." />
            </CardTitle>
            <CardDescription>Choose the AI provider and specific model</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="providerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Provider
                    <InfoTooltip content="The AI service provider (e.g., OpenAI, Anthropic, etc.) that will power this agent. Each provider has different models, pricing, and capabilities." />
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      setSelectedProviderId(value)
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {providers.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="modelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Model
                    <InfoTooltip content="Specific AI model to use. Different models have different capabilities, context windows, and pricing. Newer models tend to have more capabilities but may cost more to use." />
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={availableModels.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableModels.map((model) => (
                        <SelectItem key={model.id ?? "unknown"} value={model.id ?? ""}>
                          {model.displayName || model.name}
                          {model.isExperimental && " (Experimental)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Separator />

        {/* System Prompt Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Personality & Behavior
              <InfoTooltip content="This defines how your agent behaves, the knowledge it has access to, and its communication style. The system prompt is the most important factor in determining your agent's capabilities." />
            </CardTitle>
            <CardDescription>Define your agent's core personality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <FormLabel className="flex items-center">
                System Prompt
                <InfoTooltip content="The system prompt is a set of instructions given to the AI model that defines how it should behave. It's like programming the agent's personality and capabilities." />
              </FormLabel>
              <Tabs value={templateTab} onValueChange={setTemplateTab}>
                <TabsList>
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
                  <TabsTrigger
                    value="creative_writer"
                    onClick={() => applyTemplate("creative_writer")}
                  >
                    Creative
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Enter instructions for your AI agent..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-wrap gap-2">
              {[
                { key: "philosopher", label: "Philosopher" },
                { key: "scientist", label: "Scientist" },
                { key: "debate_partner", label: "Debate Partner" },
                { key: "character_roleplay", label: "Character" },
              ].map(({ key, label }) => (
                <Button
                  key={key}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => applyTemplate(key as keyof typeof SYSTEM_PROMPT_TEMPLATES)}
                  className="text-xs bg-background text-foreground"
                >
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Model Parameters Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Model Parameters
              <InfoTooltip content="Fine-tune how the AI model generates responses. These parameters affect creativity, consistency, and other aspects of the agent's output." />
            </CardTitle>
            <CardDescription>Fine-tune your agent's response characteristics</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Temperature */}
            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel className="flex items-center">
                      Temperature
                      <InfoTooltip content="Controls randomness in the output. Lower values (0.1-0.5) make responses more deterministic and focused. Higher values (0.7-1.0) make responses more creative and varied. Use lower values for factual tasks and higher for creative tasks." />
                    </FormLabel>
                    <span className="text-sm text-muted-foreground">{field.value.toFixed(2)}</span>
                  </div>
                  <FormControl>
                    <Slider
                      min={0}
                      max={2}
                      step={0.1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <FormDescription>
                    Controls randomness: Low values are more deterministic, higher values more
                    creative.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Top P */}
            <FormField
              control={form.control}
              name="topP"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel className="flex items-center">
                      Top P
                      <InfoTooltip content="Nucleus sampling parameter that controls diversity by limiting token selection to the smallest set of tokens whose cumulative probability exceeds the value p. Lower values (0.1-0.5) lead to more focused, predictable outputs. Higher values (0.7-1.0) allow for more diversity." />
                    </FormLabel>
                    <span className="text-sm text-muted-foreground">{field.value.toFixed(2)}</span>
                  </div>
                  <FormControl>
                    <Slider
                      min={0}
                      max={1}
                      step={0.05}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <FormDescription>
                    Controls diversity: 0.5 means half of all likelihood-weighted options are
                    considered.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Frequency Penalty */}
            <FormField
              control={form.control}
              name="frequencyPenalty"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel className="flex items-center">
                      Frequency Penalty
                      <InfoTooltip content="Reduces repetition by penalizing tokens that have already appeared in the text. Higher values (0.5-1.0) make the model less likely to repeat the same phrases or topics. Useful for longer outputs where repetition is a concern." />
                    </FormLabel>
                    <span className="text-sm text-muted-foreground">{field.value.toFixed(2)}</span>
                  </div>
                  <FormControl>
                    <Slider
                      min={-2}
                      max={2}
                      step={0.1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <FormDescription>
                    Reduces repetition of tokens: Higher values prevent repeated phrases.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Max Tokens */}
            <FormField
              control={form.control}
              name="maxTokens"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Max Tokens
                    <InfoTooltip content="The maximum length of response the model can generate, measured in tokens (roughly 4 characters = 1 token). Higher values allow for longer responses but may increase costs. Most conversations work well with 1024-4096 tokens." />
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={32768}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum length of response in tokens (roughly 4 chars = 1 token).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Separator />

        {/* Advanced Settings Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Advanced Settings
              <InfoTooltip content="Additional configuration options that affect how your agent operates, remembers conversations, and interacts with users and other tools." />
            </CardTitle>
            <CardDescription>Customize agent behavior and visibility</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Memory Enabled */}
            <FormField
              control={form.control}
              name="memoryEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base flex items-center">
                      Memory Enabled
                      <InfoTooltip content="When enabled, the agent will remember previous conversations with users. This allows for more consistent and contextual interactions across multiple chat sessions." />
                    </FormLabel>
                    <FormDescription>
                      If enabled, the agent will remember previous conversations.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Session Limit */}
            <FormField
              control={form.control}
              name="sessionLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Session Limit
                    <InfoTooltip content="Maximum number of conversation sessions before memory is reset. This prevents the agent from accumulating too much conversation history, which could impact performance or lead to context confusion." />
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum number of conversations before memory is reset.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Visibility Scope */}
            <FormField
              control={form.control}
              name="visibilityScope"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Visibility Scope
                    <InfoTooltip content="Controls who can see and use this agent. Private agents are only available to you, team agents can be used by your team members, and public agents are available to everyone using the platform." />
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="private" />
                        </FormControl>
                        <FormLabel className="font-normal">Private (Only you)</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="team" />
                        </FormControl>
                        <FormLabel className="font-normal">Team (You and team members)</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="public" />
                        </FormControl>
                        <FormLabel className="font-normal">Public (Anyone can use)</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tool Access */}
            <FormItem className="md:col-span-2">
              <FormLabel className="flex items-center">
                Tool Access
                <InfoTooltip content="Capabilities your agent can access beyond conversation. Web search allows the agent to search the internet, code interpreter lets it write and run code, file access permits reading and writing files, etc. Each tool adds capabilities but may increase costs." />
              </FormLabel>
              <div className="flex flex-wrap gap-2">
                {TOOL_ACCESS_OPTIONS.map((tool) => (
                  <Badge
                    key={tool.value}
                    variant={toolsSelected.includes(tool.value) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTool(tool.value)}
                  >
                    {tool.label}
                  </Badge>
                ))}
              </div>
              <FormDescription>Select which tools this agent can access.</FormDescription>
            </FormItem>

            {/* Category Tags */}
            <FormItem className="md:col-span-2">
              <FormLabel className="flex items-center">
                Category Tags
                <InfoTooltip content="Tags help organize and categorize your agents. These tags make it easier to find specific agents and understand their purpose at a glance. They also help with filtering and searching in the agent library." />
              </FormLabel>
              <div className="flex flex-wrap gap-2 text-foreground bg-background">
                {CATEGORY_TAGS_OPTIONS.map((tag) => (
                  <Badge
                    key={tag.value}
                    variant={tagsSelected.includes(tag.value) ? "default" : "outline"}
                    className="cursor-pointer text-foreground"
                    onClick={() => toggleTag(tag.value)}
                  >
                    {tag.label}
                  </Badge>
                ))}
              </div>
              <FormDescription>
                Add categories to help organize and discover your agent.
              </FormDescription>
            </FormItem>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/agents")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
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
      </form>
    </Form>
  )
}
