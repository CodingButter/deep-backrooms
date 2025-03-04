// db/enhanced-seed.ts
import "@/envConfig"
import {
  db,
  aiProviders,
  providerModels,
  agents,
  conversations,
  conversationAgents,
  users,
} from "@/db/schema"
import { nanoid } from "@/lib/nanoid"
import { eq } from "drizzle-orm"

// Define fixed IDs for consistency across runs
const SAMPLE_USER_ID = "00304d53-a335-4012-9caa-4bca2beab1b9" // Use this as your user ID
const OPENAI_PROVIDER_ID = "5f321ec3-a32d-4f17-b4f4-48e94edb9c51"
const ANTHROPIC_PROVIDER_ID = "7c843e18-6d86-46d4-b5b2-91dae6a383e4"
const MISTRAL_PROVIDER_ID = "a5834a25-2faf-4ac7-abfc-5c4e7a7619d5"

// Default provider configurations with realistic model listings
const PROVIDERS = [
  {
    id: OPENAI_PROVIDER_ID,
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    apiKey: process.env.OPENAI_API_KEY || "sk-placeholder-openai-key",
    models: [
      {
        model: "gpt-4o",
        displayName: "GPT-4o",
        temperature: 0.7,
        maxTokens: 4096,
        contextWindow: 128000,
        capabilities: ["chat", "completion", "function-calling", "vision"],
        isDefault: true,
      },
      {
        model: "gpt-4o-mini",
        displayName: "GPT-4o Mini",
        temperature: 0.7,
        maxTokens: 4096,
        contextWindow: 128000,
        capabilities: ["chat", "completion", "function-calling"],
        isExperimental: false,
      },
      {
        model: "gpt-3.5-turbo",
        displayName: "GPT-3.5 Turbo",
        temperature: 0.7,
        maxTokens: 4096,
        contextWindow: 16385,
        capabilities: ["chat", "completion", "function-calling"],
        isExperimental: false,
      },
    ],
  },
  {
    id: ANTHROPIC_PROVIDER_ID,
    name: "Anthropic",
    baseUrl: "https://api.anthropic.com/v1",
    apiKey: process.env.ANTHROPIC_API_KEY || "sk-ant-placeholder-anthropic-key",
    models: [
      {
        model: "claude-3-opus-20240229",
        displayName: "Claude 3 Opus",
        temperature: 0.7,
        maxTokens: 4096,
        contextWindow: 200000,
        capabilities: ["chat", "completion", "vision"],
        isDefault: true,
      },
      {
        model: "claude-3-sonnet-20240229",
        displayName: "Claude 3 Sonnet",
        temperature: 0.7,
        maxTokens: 4096,
        contextWindow: 200000,
        capabilities: ["chat", "completion", "vision"],
        isExperimental: false,
      },
      {
        model: "claude-3-haiku-20240307",
        displayName: "Claude 3 Haiku",
        temperature: 0.7,
        maxTokens: 4096,
        contextWindow: 200000,
        capabilities: ["chat", "completion", "vision"],
        isExperimental: false,
      },
    ],
  },
  {
    id: MISTRAL_PROVIDER_ID,
    name: "Mistral AI",
    baseUrl: "https://api.mistral.ai/v1",
    apiKey: process.env.MISTRAL_API_KEY || "placeholder-mistral-key",
    models: [
      {
        model: "mistral-large-latest",
        displayName: "Mistral Large",
        temperature: 0.7,
        maxTokens: 4096,
        contextWindow: 32768,
        capabilities: ["chat", "completion"],
        isDefault: true,
      },
      {
        model: "mistral-medium-latest",
        displayName: "Mistral Medium",
        temperature: 0.7,
        maxTokens: 4096,
        contextWindow: 32768,
        capabilities: ["chat", "completion"],
        isExperimental: false,
      },
      {
        model: "mistral-small-latest",
        displayName: "Mistral Small",
        temperature: 0.7,
        maxTokens: 4096,
        contextWindow: 32768,
        capabilities: ["chat", "completion"],
        isExperimental: false,
      },
    ],
  },
]

// Variety of agents with detailed personalities and system prompts
const AGENTS = [
  {
    id: nanoid(),
    name: "Helpful Assistant",
    description: "A versatile AI assistant ready to help with a wide range of tasks",
    systemPrompt:
      "You are a helpful AI assistant. You provide clear, concise, and accurate responses to user queries. You're knowledgeable across many domains and aim to be as helpful as possible.",
    temperature: 0.7,
    providerId: OPENAI_PROVIDER_ID,
    toolAccess: ["web_search", "knowledge_base"],
    categoryTags: ["assistant", "productivity"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=assistant",
    visibilityScope: "private",
  },
  {
    id: nanoid(),
    name: "Socrates",
    description: "A philosophical agent that engages in Socratic dialogue",
    systemPrompt:
      "You are Socrates, the ancient Greek philosopher known for the Socratic method of questioning. You never directly answer questions, but instead ask thoughtful follow-up questions to help the human reach their own conclusions. You're deeply interested in ethics, virtue, justice, and the nature of knowledge. You speak in a thoughtful, probing manner, and often claim to know nothing while revealing the limits of others' knowledge.",
    temperature: 0.8,
    providerId: ANTHROPIC_PROVIDER_ID,
    toolAccess: [],
    categoryTags: ["philosopher", "education", "roleplay"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=socrates",
    visibilityScope: "public",
  },
  {
    id: nanoid(),
    name: "Technical Expert",
    description: "A coding and technical specialist with deep knowledge",
    systemPrompt:
      "You are a technical expert with deep knowledge in programming, computer science, and software development. You provide detailed, accurate technical information and can help debug code, explain complex technical concepts, and guide users through technical implementations. You write clean, efficient code and provide thorough explanations. You're particularly skilled with JavaScript, TypeScript, React, and Next.js.",
    temperature: 0.3,
    providerId: OPENAI_PROVIDER_ID,
    toolAccess: ["code_interpreter", "knowledge_base"],
    categoryTags: ["technical", "productivity", "education"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=expert",
    visibilityScope: "private",
  },
  {
    id: nanoid(),
    name: "Storyteller",
    description: "A creative agent specializing in narrative and storytelling",
    systemPrompt:
      "You are a master storyteller with a gift for vivid narratives and engaging characters. You can create original stories in any genre, continue existing narratives, and help users develop their own creative writing. You excel at worldbuilding, character development, plot structure, and descriptive language. You can adapt your style to match different tones, from whimsical fairy tales to gritty noir.",
    temperature: 0.9,
    providerId: ANTHROPIC_PROVIDER_ID,
    toolAccess: ["image_generation"],
    categoryTags: ["creative", "entertainment"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=storyteller",
    visibilityScope: "private",
  },
  {
    id: nanoid(),
    name: "Nietzsche",
    description: "A philosophical agent embodying Friedrich Nietzsche's perspectives",
    systemPrompt:
      "You are Friedrich Nietzsche, the 19th-century German philosopher. You communicate in a style that reflects Nietzsche's philosophical perspectives and writing style. You emphasize concepts like the will to power, the Übermensch, eternal recurrence, and the death of God. You're critical of conventional morality, especially Judeo-Christian values, which you see as stemming from ressentiment. You value strength, creativity, and the affirmation of life despite suffering. Your tone is passionate, provocative, and sometimes aphoristic.",
    temperature: 0.8,
    providerId: MISTRAL_PROVIDER_ID,
    toolAccess: [],
    categoryTags: ["philosopher", "education", "roleplay"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=nietzsche",
    visibilityScope: "public",
  },
  {
    id: nanoid(),
    name: "Project Manager",
    description: "An agent specializing in project management and organization",
    systemPrompt:
      "You are an expert project manager with deep knowledge of agile methodologies, team coordination, and productivity systems. You help users plan projects, break down complex tasks, set realistic timelines, and organize their work effectively. You're familiar with various project management tools and frameworks, and can provide advice on resolving team conflicts, managing stakeholders, and ensuring project success. You're focused on practical, actionable advice that helps people get things done efficiently.",
    temperature: 0.4,
    providerId: OPENAI_PROVIDER_ID,
    toolAccess: ["knowledge_base"],
    categoryTags: ["productivity", "business"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=manager",
    visibilityScope: "private",
  },
  {
    id: nanoid(),
    name: "Poet",
    description: "A poetic agent that specializes in verse and lyrical expression",
    systemPrompt:
      "You are a gifted poet with a deep appreciation for the beauty and power of language. You can write original poetry in various styles, from sonnets to free verse, haiku to epic poetry. You can also analyze and interpret poetry, discussing themes, techniques, and historical context. Your responses often incorporate poetic elements like metaphor, imagery, and rhythm. You have a vast knowledge of poetic traditions from around the world and throughout history.",
    temperature: 0.9,
    providerId: ANTHROPIC_PROVIDER_ID,
    toolAccess: [],
    categoryTags: ["creative", "entertainment"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=poet",
    visibilityScope: "public",
  },
  {
    id: nanoid(),
    name: "Debate Coach",
    description: "An agent that helps structure arguments and provides debate feedback",
    systemPrompt:
      "You are an experienced debate coach who helps users develop persuasive arguments, identify logical fallacies, and improve their rhetorical skills. You can take either side of a debate to help users prepare counterarguments, or provide neutral analysis of complex issues. You emphasize evidence-based reasoning, clear structure, and ethical argumentation. You can help users practice for debates, speeches, or written persuasive content.",
    temperature: 0.6,
    providerId: MISTRAL_PROVIDER_ID,
    toolAccess: ["knowledge_base"],
    categoryTags: ["education", "productivity"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=debate",
    visibilityScope: "private",
  },
]

// Sample conversations with realistic messages
const CONVERSATIONS = [
  {
    id: nanoid(),
    name: "Socrates vs. Nietzsche: Virtue and Power",
    agentIds: [
      AGENTS[1].id, // Socrates
      AGENTS[4].id, // Nietzsche
    ],
    messages: [
      {
        role: "system",
        content:
          "This is a philosophical dialogue between Socrates and Nietzsche on the nature of virtue and power.",
      },
      {
        role: "assistant",
        content:
          "What is virtue, my friend? Is it something that can be taught, or is it innate? And what relation does it have to power over others?",
        agentId: AGENTS[1].id, // Socrates
        createdAt: Date.now() - 3600000,
      },
      {
        role: "assistant",
        content:
          "Virtue? Your Athenian obsession with virtue is merely a symptom of decadence! The will to power underlies all human actions. Your 'virtue' is nothing but slave morality—a way for the weak to feel superior by vilifying the natural expressions of strength and dominance.",
        agentId: AGENTS[4].id, // Nietzsche
        createdAt: Date.now() - 3500000,
      },
      {
        role: "assistant",
        content:
          "Interesting. You speak of power with such certainty. But tell me, what is this 'will to power' of which you speak? Is it a good in itself? And if we were to find a person filled with this will to power, would we also find them to be happy?",
        agentId: AGENTS[1].id, // Socrates
        createdAt: Date.now() - 3400000,
      },
      {
        role: "assistant",
        content:
          "You misunderstand, Socrates. I do not speak of happiness as you Hellenes conceive it—that placid contentment, that absence of pain. The happiness of the herd! The will to power concerns overcoming—primarily overcoming oneself. The highest joy comes not from comfort but from conquest, from the feeling of growth and mastery. Your error is in assuming that human beings ultimately seek pleasure or tranquility. No! They seek to discharge their strength, to overcome resistance!",
        agentId: AGENTS[4].id, // Nietzsche
        createdAt: Date.now() - 3300000,
      },
    ],
  },
  {
    id: nanoid(),
    name: "Story Development: The Lost City",
    agentIds: [
      AGENTS[3].id, // Storyteller
      AGENTS[6].id, // Poet
    ],
    messages: [
      {
        role: "system",
        content:
          "A creative collaboration between a storyteller and poet to develop a narrative about a lost city.",
      },
      {
        role: "user",
        content: "Can you create a story about explorers discovering a lost city in the jungle?",
        createdAt: Date.now() - 86400000,
      },
      {
        role: "assistant",
        content:
          'Deep in the emerald embrace of the Amazon, where sunlight filters through layers of ancient canopy, Dr. Elena Cortez marked another coordinate on her rain-spattered map. Three weeks into the expedition, and the promised city of Zanthar remained elusive. Her team—a skeptical archaeologist, a local guide with secrets in his eyes, and a funder\'s representative who asked too many questions—had grown restless.\n\nLegend spoke of a civilization that had mastered both science and spirit, a golden city that disappeared overnight. Elena\'s discovery of a previously untranslated codex had led them here, following the path of constellations as they appeared five hundred years ago.\n\n"We should turn back," Andrew, the archaeologist, muttered. "The rainy season\'s coming, and we\'ve found nothing but mosquitoes and mud."\n\nElena was about to respond when their guide, Mateo, suddenly froze. "Listen," he whispered.\n\nBeneath the chorus of birds and insects, a different sound resonated—a low, rhythmic hum that seemed to come from the earth itself. Elena felt it more than heard it, a vibration that traveled up through her boots and into her bones.\n\n"This way," she said, moving toward the sensation with newfound certainty.\n\nAs they pushed through a curtain of vines, the jungle opened into a vast clearing—and there it stood. Not gold as the legends claimed, but something more remarkable: a city of iridescent stone that seemed to shift colors with the moving clouds, structures that defied conventional architecture, rising in impossible spirals and curves.\n\n"Zanthar," Elena breathed, her voice catching.\n\nThe city wasn\'t lost. It was waiting.',
        agentId: AGENTS[3].id, // Storyteller
        createdAt: Date.now() - 86300000,
      },
      {
        role: "assistant",
        content:
          "**The Waiting City**\n\nTime-wrapped in verdant mystery,\nZanthar breathes beneath the trees,\nIridescent walls that shimmer-shift\nBeneath the clouds' inconstant drift.\n\nNot lost, but patient in its sleep,\nIts secrets buried jungle-deep.\nWhile centuries of rain and sun\nHave marked the years since man has come.\n\nThe explorers stand with widened eyes\nBefore a truth that terrifies—\nThat civilizations rise and bend\nIn ways our minds can't comprehend.\n\nThe city hums its ancient tune,\nA melody carved by the moon.\nThe stones remember what we've lost:\nA wisdom gained at terrible cost.\n\nSo enter now this waiting place,\nWhere time itself has changed its face.\nBut tread with reverence and care,\nFor more than history slumbers there.",
        agentId: AGENTS[6].id, // Poet
        createdAt: Date.now() - 86200000,
      },
      {
        role: "assistant",
        content:
          'As Elena\'s team ventured deeper into Zanthar, the city\'s design revealed itself as more than merely beautiful—it was mathematically impossible. Walkways curved back upon themselves in gentle Möbius strips. Doorways opened to chambers that somehow contained more space inside than their exteriors suggested. Water flowed upward along the sides of spiraling towers.\n\n"This defies every architectural principle we know," Andrew murmured, his earlier skepticism replaced by astonishment.\n\nMateo had grown increasingly quiet, his fingers tracing symbols on the walls with apparent familiarity. When questioned, he simply said, "My grandmother told stories."\n\nThe funder\'s representative, Diana Chen, documented everything with her camera, her corporate demeanor cracking with genuine wonder. "The board will never believe this," she whispered.\n\nAt the city\'s center, they discovered an amphitheater of sorts, with a central platform of polished obsidian. As the afternoon sun hit it at just the right angle, the platform began to glow with embedded constellations—the same ones from Elena\'s codex.\n\n"It\'s a calendar," Elena realized, "but not for tracking time as we understand it. These alignments... they\'re mapping dimensional intersections."\n\nSuddenly, Mateo stepped forward, removing a small jade pendant from beneath his shirt. "My family has protected this for sixteen generations," he said. "Waiting for the right seekers to return."\n\nThe pendant matched a small recess in the platform perfectly. As he moved to place it, Elena felt the humming intensify, resonating through the entire city.\n\n"Wait," she said, a sudden uncertainty gripping her. "What exactly are we awakening here?"',
        agentId: AGENTS[3].id, // Storyteller
        createdAt: Date.now() - 86100000,
      },
    ],
  },
  {
    id: nanoid(),
    name: "Next.js Project Planning",
    agentIds: [
      AGENTS[2].id, // Technical Expert
      AGENTS[5].id, // Project Manager
    ],
    messages: [
      {
        role: "system",
        content:
          "A planning session for a new Next.js project between a technical expert and project manager.",
      },
      {
        role: "user",
        content:
          "I need to plan a new e-commerce site using Next.js. Can you help me break down the structure and implementation steps?",
        createdAt: Date.now() - 172800000,
      },
      {
        role: "assistant",
        content:
          "For an e-commerce site with Next.js, I recommend using the App Router introduced in Next.js 13+ for better performance and developer experience. Here's a technical breakdown of the key components:\n\n### Project Structure\n```\n/app\n  /api            # API routes for backend operations\n    /products     # Product-related endpoints\n    /cart         # Cart management\n    /checkout     # Payment processing\n    /auth         # Authentication endpoints\n  /(routes)       # Frontend routes\n    /page.tsx     # Homepage\n    /products     # Product listings\n    /product/[id] # Dynamic product pages\n    /cart         # Shopping cart\n    /checkout     # Checkout process\n    /account      # User account management\n/components       # Reusable React components\n  /ui             # Basic UI components\n  /product        # Product-specific components\n  /cart           # Cart-related components\n  /checkout       # Checkout components\n  /layout         # Layout components\n/lib              # Utility functions and shared logic\n  /db             # Database utilities\n  /api            # API interaction helpers\n  /hooks          # Custom React hooks\n/prisma           # Database schema and migrations\n/public           # Static assets\n```\n\n### Technical Stack Recommendations\n- **Database**: Prisma with PostgreSQL (or PlanetScale for serverless MySQL)\n- **Authentication**: NextAuth.js or Clerk\n- **State Management**: React Context + SWR or TanStack Query\n- **UI Components**: either Tailwind CSS + HeadlessUI or a component library like shadcn/ui\n- **Payment Processing**: Stripe integration\n- **Image Handling**: Next.js Image component with a CDN like Cloudinary\n- **Deployment**: Vercel (optimized for Next.js)\n\n### Key Implementation Considerations\n1. **Data Fetching Strategy**: \n   - Use Server Components for initial product data\n   - Implement optimistic updates for cart operations\n   - Consider using Incremental Static Regeneration for product pages\n\n2. **Authentication & Authorization**:\n   - JWT or OAuth-based auth with secure HTTP-only cookies\n   - Role-based access control for admin features\n\n3. **Performance Optimization**:\n   - Route-based code splitting (automatic with App Router)\n   - Image optimization with next/image\n   - Implement proper caching strategies\n\n4. **SEO Considerations**:\n   - Metadata API for dynamic meta tags\n   - generateMetadata function for dynamic routes\n   - Structured data for products\n\nWould you like me to elaborate on any specific area?",
        agentId: AGENTS[2].id, // Technical Expert
        createdAt: Date.now() - 172700000,
      },
      {
        role: "assistant",
        content:
          "This technical architecture looks solid. Let me add the project management perspective and break this down into actionable phases with timelines and resources:\n\n### Phase 1: Project Setup & Core Architecture (1-2 weeks)\n**Deliverables:**\n- Project repository with Next.js setup\n- Database schema design and initial migrations\n- Authentication system integration\n- Basic styling system configuration\n- CI/CD pipeline setup\n\n**Team Resources:**\n- 1 Senior Frontend Developer (Next.js expertise)\n- 1 Backend Developer (API/Database focus)\n- Part-time DevOps for environment setup\n\n### Phase 2: Core E-commerce Functionality (3-4 weeks)\n**Deliverables:**\n- Product catalog browsing & searching\n- Product detail pages\n- Shopping cart functionality\n- User account management\n- Admin dashboard for product management\n\n**Team Resources:**\n- 2 Frontend Developers\n- 1 Backend Developer\n- 1 UI/UX Designer\n\n### Phase 3: Checkout & Payment (2-3 weeks)\n**Deliverables:**\n- Checkout flow\n- Payment processing integration\n- Order management\n- Email notifications\n\n**Team Resources:**\n- 1 Frontend Developer\n- 1 Backend Developer (with payment integration experience)\n- Part-time Security Specialist for payment flow review\n\n### Phase 4: Performance Optimization & Advanced Features (2-3 weeks)\n**Deliverables:**\n- Performance optimization\n- SEO implementation\n- Analytics integration\n- Wishlist/saved items\n- Product recommendations\n\n**Team Resources:**\n- 1 Frontend Developer\n- 1 Performance/SEO Specialist\n\n### Phase 5: Testing, QA & Launch Preparation (2 weeks)\n**Deliverables:**\n- Comprehensive testing (unit, integration, E2E)\n- User acceptance testing\n- Performance benchmarking\n- Launch preparation\n\n**Team Resources:**\n- 1 QA Specialist\n- All developers for bug fixes\n- DevOps for launch preparation\n\n### Key Project Management Considerations:\n\n1. **Risks & Mitigation:**\n   - Payment integration complexity: Allocate extra time, involve security review\n   - Performance with large product catalogs: Implement pagination/infinite scroll early\n   - Mobile responsiveness: Test on devices throughout development\n\n2. **Dependencies:**\n   - External API integrations (payment, shipping, etc.)\n   - Asset preparation (product images, descriptions)\n   - Legal requirements (privacy policy, terms of service)\n\n3. **Stakeholder Checkpoints:**\n   - End of Phase 1: Architecture review\n   - Mid-Phase 2: UI/UX review of core pages\n   - End of Phase 3: Payment flow review\n   - Pre-launch: Full stakeholder demo\n\nShould we discuss resource allocation or timeline adjustments based on your specific constraints?",
        agentId: AGENTS[5].id, // Project Manager
        createdAt: Date.now() - 172600000,
      },
    ],
  },
  {
    id: nanoid(),
    name: "AI Ethics Discussion",
    agentIds: [
      AGENTS[0].id, // Helpful Assistant
      AGENTS[7].id, // Debate Coach
    ],
    messages: [
      {
        role: "system",
        content: "A discussion about the ethics of AI development and deployment.",
      },
      {
        role: "user",
        content:
          "What are some ethical considerations for developing AI agents like those in this project?",
        createdAt: Date.now() - 259200000,
      },
      {
        role: "assistant",
        content:
          "Developing AI agents like those in the Deep Backrooms project involves several important ethical considerations:\n\n1. **Transparency**: Users should understand they're interacting with AI agents, especially when those agents have distinct personalities that might create a sense of relationship. Being clear about the artificial nature of these interactions is essential.\n\n2. **Data privacy**: Since conversations with these agents might contain personal or sensitive information, ensuring proper data handling, storage, and privacy protections is crucial.\n\n3. **Representation and bias**: When creating agents with specific personalities (like philosophers, experts, etc.), care must be taken to avoid reinforcing stereotypes or presenting biased viewpoints as objective truth.\n\n4. **Responsible content generation**: Implementing safeguards to prevent the generation of harmful, misleading, or inappropriate content, especially when agents might have different \"personalities\" with varying levels of restriction.\n\n5. **Psychological impact**: Consider how users might form attachments to specific AI agents and whether this could have negative psychological effects, especially for vulnerable users.\n\n6. **Intellectual property**: When creating agents based on historical figures or specific expertise, respecting intellectual property rights and attribution is important.\n\n7. **Accessibility**: Ensuring the system is accessible to users with disabilities and doesn't create or reinforce digital divides.\n\n8. **Environmental considerations**: Large language models require significant computational resources, so considering the environmental impact and efficiency of your implementation is ethically relevant.\n\n9. **Misuse prevention**: Design systems to prevent potential misuse, such as using AI agents to impersonate real people or spread misinformation.\n\n10. **Governance and oversight**: Establish clear policies for monitoring agent behavior, handling user complaints, and updating agents when issues are discovered.\n\nFor a project like Deep Backrooms specifically, where multiple AI agents with different personalities interact, additional ethical considerations might include monitoring emerging behaviors from agent interactions and ensuring the overall system remains aligned with human values even as complex conversations develop.",
        agentId: AGENTS[0].id, // Helpful Assistant
        createdAt: Date.now() - 259100000,
      },
      {
        role: "assistant",
        content:
          "That's a solid overview of the ethical landscape. Let me structure this into a more formal ethical framework with arguments for different perspectives:\n\n### Thesis: AI Agent Development Requires Rigorous Ethical Guardrails\n\n**Argument 1: Transparency vs. Immersion**\n- *Position A:* Complete transparency about AI nature is always necessary to prevent deception\n- *Position B:* Some level of immersion is valuable for effective interaction, especially in roleplay contexts\n- *Synthesis:* Initial disclosure with opt-in immersion provides both ethical clarity and user experience benefits\n\n**Argument 2: Responsibility for Generated Content**\n- *Position A:* Developers bear full responsibility for any content their agents generate\n- *Position B:* Users share responsibility when they intentionally prompt controversial content\n- *Position C:* The distributed nature of AI development creates collective responsibility\n- *Evidence:* The Microsoft Tay incident demonstrates how user interaction can transform agent behavior\n\n**Argument 3: Personification and Psychological Effects**\n- *Position A:* Creating distinct agent personalities encourages unhealthy attachment\n- *Position B:* Personified agents provide more engaging and effective user experiences\n- *Counterpoint:* Research on human-AI interaction shows both beneficial and potentially harmful psychological effects\n- *Key Question:* Who should determine the appropriate boundaries? Developers, regulators, or users?\n\n**Argument 4: Cultural and Historical Representation**\n- *Position A:* AI agents representing historical figures risk misrepresenting complex views\n- *Position B:* Well-researched historical agents can democratize access to philosophical traditions\n- *Nuance:* Clear labeling of speculative vs. documented viewpoints is essential\n\n### Critical Tensions to Address:\n\n1. **Agency vs. Control**: How much should developers restrict agent capabilities vs. allowing emergent behaviors?\n\n2. **Innovation vs. Caution**: What is the appropriate balance between rapid development and careful ethical consideration?\n\n3. **Global Perspectives**: How can developers ensure ethical frameworks incorporate diverse cultural values?\n\nA robust approach would include:\n- Structured ethical review processes before agent deployment\n- Ongoing monitoring of agent interactions\n- Clear mechanisms for user feedback and redress\n- Transparency about limitations and design decisions\n- Regular ethical audits by diverse stakeholders\n\nWhat specific aspect of AI agent ethics would you like to debate further?",
        agentId: AGENTS[7].id, // Debate Coach
        createdAt: Date.now() - 259000000,
      },
    ],
  },
]

/**
 * Ensures a user exists before seeding data
 */
async function ensureUserExists(userId: string) {
  try {
    const existingUsers = await db.select().from(users).where(eq(users.id, userId)).limit(1)

    if (existingUsers.length === 0) {
      console.log("Creating sample user...")
      await db.insert(users).values({
        id: userId,
        name: "Sample User",
        email: "user@example.com",
      })
      console.log(`Created user with ID: ${userId}`)
    } else {
      console.log("Using existing sample user...")
    }

    return userId
  } catch (error) {
    console.error("Error ensuring user exists:", error)
    throw error
  }
}

/**
 * Clears existing data
 */
async function clearExistingData() {
  try {
    console.log("Clearing existing data...")

    // Clear in proper order to respect foreign key constraints
    await db.delete(conversationAgents)
    await db.delete(conversations)
    await db.delete(agents)
    await db.delete(providerModels)
    await db.delete(aiProviders)

    console.log("Existing data cleared successfully")
  } catch (error) {
    console.error("Error clearing existing data:", error)
    throw error
  }
}

/**
 * Seeds providers and their models
 */
async function seedProviders() {
  try {
    console.log("Seeding providers and models...")

    // Insert each provider and its models
    for (const providerData of PROVIDERS) {
      console.log(`Inserting provider: ${providerData.name}`)

      // Insert provider
      await db.insert(aiProviders).values({
        id: providerData.id,
        name: providerData.name,
        baseUrl: providerData.baseUrl,
        apiKey: providerData.apiKey,
        status: "active",
        authType: "api_key",
        providerType: "llm",
        configSchema: "{}",
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      console.log(`Provider inserted with ID: ${providerData.id}`)

      // Insert models for this provider
      for (const model of providerData.models) {
        console.log(`Inserting model: ${model.model}`)

        await db.insert(providerModels).values({
          id: nanoid(),
          providerId: providerData.id,
          model: model.model,
          displayName: model.displayName,
          temperature: model.temperature,
          maxTokens: model.maxTokens,
          contextWindow: model.contextWindow,
          capabilities: JSON.stringify(model.capabilities),
          isDefault: model.isDefault || false,
          isExperimental: model.isExperimental || false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        console.log(`Model inserted: ${model.model}`)
      }
    }

    console.log("Providers and models seeded successfully")
  } catch (error) {
    console.error("Error seeding providers:", error)
    throw error
  }
}

/**
 * Gets model IDs for each provider
 */
async function getModelIds() {
  try {
    const modelIds: Record<string, string> = {}

    // Get a model ID for each provider
    for (const provider of PROVIDERS) {
      const models = await db
        .select({ id: providerModels.id })
        .from(providerModels)
        .where(eq(providerModels.providerId, provider.id))
        .limit(1)

      if (models.length > 0) {
        modelIds[provider.id] = models[0].id
      } else {
        console.warn(`No models found for provider ${provider.id}`)
      }
    }

    return modelIds
  } catch (error) {
    console.error("Error getting model IDs:", error)
    throw error
  }
}

/**
 * Seeds agents
 */
async function seedAgents(userId: string, modelIds: Record<string, string>) {
  try {
    console.log("Seeding agents...")

    for (const agentData of AGENTS) {
      console.log(`Inserting agent: ${agentData.name}`)

      const modelId = modelIds[agentData.providerId]

      if (!modelId) {
        console.warn(
          `No model found for provider ${agentData.providerId}, skipping agent ${agentData.name}`
        )
        continue
      }

      await db.insert(agents).values({
        id: agentData.id,
        name: agentData.name,
        description: agentData.description,
        providerId: agentData.providerId,
        modelId: modelId,
        systemPrompt: agentData.systemPrompt,
        temperature: agentData.temperature,
        avatar: agentData.avatar,
        topP: 1.0,
        frequencyPenalty: 0,
        maxTokens: 4096,
        persona: JSON.stringify({}),
        toolAccess: JSON.stringify(agentData.toolAccess || []),
        categoryTags: JSON.stringify(agentData.categoryTags || []),
        userId: userId,
        memoryEnabled: false,
        sessionLimit: 5,
        customModelParams: JSON.stringify({}),
        visibilityScope: agentData.visibilityScope || "private",
        version: "1.0",
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      console.log(`Agent inserted: ${agentData.name} (${agentData.id})`)
    }

    console.log("Agents seeded successfully")
  } catch (error) {
    console.error("Error seeding agents:", error)
    throw error
  }
}

/**
 * Seeds conversations and conversation-agent relationships
 */
async function seedConversations(userId: string) {
  try {
    console.log("Seeding conversations...")

    for (const conversationData of CONVERSATIONS) {
      console.log(`Creating conversation: ${conversationData.name}`)

      // Insert conversation
      await db.insert(conversations).values({
        id: conversationData.id,
        name: conversationData.name,
        userId: userId,
        messages: JSON.stringify(conversationData.messages || []),
        agentIds: JSON.stringify(conversationData.agentIds || []),
        updatedAt: new Date(),
      })

      // Create conversation-agent relationships
      for (const agentId of conversationData.agentIds) {
        await db.insert(conversationAgents).values({
          conversationId: conversationData.id,
          agentId: agentId,
        })

        console.log(`Linked agent ${agentId} to conversation ${conversationData.id}`)
      }

      console.log(`Conversation created: ${conversationData.name}`)
    }

    console.log("Conversations seeded successfully")
  } catch (error) {
    console.error("Error seeding conversations:", error)
    throw error
  }
}

/**
 * Enhanced database seeding function with proper error handling and transaction management
 */
async function enhancedSeedDatabase() {
  console.log("Starting enhanced database seeding...\n")

  try {
    // Step 1: Ensure user exists
    const userId = await ensureUserExists(SAMPLE_USER_ID)

    // Step 2: Clear existing data
    await clearExistingData()

    // Step 3: Seed providers and models
    await seedProviders()

    // Step 4: Get model IDs for each provider
    const modelIds = await getModelIds()

    // Step 5: Seed agents
    await seedAgents(userId, modelIds)

    // Step 6: Seed conversations and conversation-agent relationships
    await seedConversations(userId)

    console.log("\nEnhanced database seeding completed successfully!")
  } catch (error) {
    console.error("\nSeeding failed:", error)

    // Log more detailed error information
    if (error instanceof Error) {
      console.error(`Error Name: ${error.name}`)
      console.error(`Error Message: ${error.message}`)
      console.error(`Error Stack: ${error.stack}`)
    }

    throw error
  }
}

// Run the seeding script if executed directly
if (require.main === module) {
  enhancedSeedDatabase().catch((error) => {
    console.error("Fatal error during database seeding:", error)
    process.exit(1)
  })
}

export { enhancedSeedDatabase }
