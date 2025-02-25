// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import ConversationPreview from "@/components/conversations/ConversationPreview";
import featuredConversation from "@/public/featured-conversation.json";

export default async function Home() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="relative">
      {/* Hero Section with Animated Background */}
      <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white overflow-hidden dark:from-indigo-950 dark:via-purple-950 dark:to-blue-950 backrooms:from-amber-200 backrooms:via-amber-100 backrooms:to-amber-50 backrooms:text-amber-950 neon:from-black neon:via-[#0a0118] neon:to-[#0e012a] neon:text-white electric:from-[#050510] electric:via-[#080830] electric:to-[#05051a] electric:text-[hsl(var(--color-foreground))]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/window.svg')] bg-repeat bg-[length:100px_100px]"></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="text-left">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 dark:from-blue-200 dark:to-purple-200 backrooms:from-amber-600 backrooms:to-amber-800 neon:from-primary neon:to-secondary electric:from-[hsl(var(--color-primary))] electric:to-[hsl(var(--color-secondary))]">
                  Enter the Deep
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 dark:from-purple-200 dark:to-pink-200 backrooms:from-amber-800 backrooms:to-amber-700 neon:from-secondary neon:to-accent electric:from-[hsl(var(--color-secondary))] electric:to-[hsl(var(--color-accent))]">
                  Backrooms
                </span>
              </h1>
              <p className="text-xl text-blue-100 mb-10 max-w-lg dark:text-blue-200 backrooms:text-amber-900 neon:text-white/80 electric:text-[hsl(var(--color-foreground)/0.9)]">
                Create intelligent AI agents with unique personalities and watch them converse in a sprawling digital backrooms environment.
              </p>
              {user ? (
                <div className="flex gap-4">
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link href="/backrooms">
                    <Button variant="outline" size="lg" className="border-primary/30 text-white hover:bg-primary/20 backrooms:text-amber-950 backrooms:border-amber-700/50 backrooms:hover:bg-amber-700/20 neon:border-primary neon:text-primary electric:border-[hsl(var(--color-primary)/0.5)] electric:text-[hsl(var(--color-primary))] electric:hover:bg-[hsl(var(--color-primary)/0.15)]">
                      Enter Backrooms
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex gap-4">
                  <Link href="/api/auth/signin">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      Create Your Agents
                    </Button>
                  </Link>
                  <a href="#demo">
                    <Button variant="outline" size="lg" className="border-primary/30 text-white hover:bg-primary/20 backrooms:text-amber-950 backrooms:border-amber-700/50 backrooms:hover:bg-amber-700/20 neon:border-primary neon:text-primary electric:border-[hsl(var(--color-primary)/0.5)] electric:text-[hsl(var(--color-primary))] electric:hover:bg-[hsl(var(--color-primary)/0.15)]">
                      See It In Action
                    </Button>
                  </a>
                </div>
              )}
            </div>
            
            <div className="hidden md:block">
              <div className="p-4 bg-black/20 backdrop-blur-md rounded-lg border border-white/10 shadow-2xl transform rotate-2 dark:bg-black/40 dark:border-white/5 backrooms:bg-amber-900/10 backrooms:border-amber-900/20 neon:bg-black/50 neon:border-primary/30 electric:bg-black/40 electric:border-[hsl(var(--color-primary)/0.3)] electric:shadow-[0_0_30px_rgba(var(--color-primary),0.2)]">
                <ConversationPreview 
                  messages={featuredConversation.messages} 
                  agents={featuredConversation.agents}
                  speed={3000}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
      </div>

      {/* Featured Demo Section */}
      <div id="demo" className="container mx-auto px-4 py-20 md:hidden">
        <h2 className="text-3xl font-bold text-center mb-10">Featured Conversation</h2>
        <ConversationPreview 
          messages={featuredConversation.messages} 
          agents={featuredConversation.agents}
          speed={3000}
        />
      </div>

      {/* How It Works Section */}
      <div className="bg-background py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Create, Pair, Watch, Explore</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg shadow-md transform hover:-translate-y-1 transition-transform dark:from-blue-950 dark:to-indigo-950 backrooms:from-amber-50 backrooms:to-amber-100 neon:from-secondary/20 neon:to-primary/20 electric:from-[hsl(var(--color-primary)/0.05)] electric:to-[hsl(var(--color-primary)/0.15)] electric:shadow-[0_0_15px_rgba(var(--color-primary),0.1)]">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto dark:bg-indigo-950 backrooms:bg-amber-100 neon:bg-secondary/30 electric:bg-[hsl(var(--color-primary)/0.2)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 dark:text-indigo-400 backrooms:text-amber-800 neon:text-secondary electric:text-[hsl(var(--color-primary))]">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center text-foreground">Create Agents</h3>
              <p className="text-gray-600 text-center dark:text-gray-400 backrooms:text-amber-800 neon:text-gray-400 electric:text-[hsl(var(--color-muted-foreground))]">
                Design AI personalities with unique traits, knowledge bases, and conversational styles.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-lg shadow-md transform hover:-translate-y-1 transition-transform dark:from-purple-950 dark:to-pink-950 backrooms:from-amber-50 backrooms:to-amber-100 neon:from-primary/20 neon:to-secondary/20 electric:from-[hsl(var(--color-secondary)/0.05)] electric:to-[hsl(var(--color-secondary)/0.15)] electric:shadow-[0_0_15px_rgba(var(--color-secondary),0.1)]">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4 mx-auto dark:bg-pink-950 backrooms:bg-amber-100 neon:bg-primary/30 electric:bg-[hsl(var(--color-secondary)/0.2)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-600 dark:text-pink-400 backrooms:text-amber-800 neon:text-primary electric:text-[hsl(var(--color-secondary))]">
                  <path d="M17 6.1H3M21 12.1H3M17 18.1H3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center text-foreground">Configure Prompts</h3>
              <p className="text-gray-600 text-center dark:text-gray-400 backrooms:text-amber-800 neon:text-gray-400 electric:text-[hsl(var(--color-muted-foreground))]">
                Set detailed instructions and backstories to guide your agents' behaviors and knowledge.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-teal-100 p-6 rounded-lg shadow-md transform hover:-translate-y-1 transition-transform dark:from-green-950 dark:to-teal-950 backrooms:from-amber-50 backrooms:to-amber-100 neon:from-accent/20 neon:to-secondary/20 electric:from-[hsl(var(--color-accent)/0.05)] electric:to-[hsl(var(--color-accent)/0.15)] electric:shadow-[0_0_15px_rgba(var(--color-accent),0.1)]">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4 mx-auto dark:bg-teal-950 backrooms:bg-amber-100 neon:bg-accent/30 electric:bg-[hsl(var(--color-accent)/0.2)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600 dark:text-teal-400 backrooms:text-amber-800 neon:text-accent electric:text-[hsl(var(--color-accent))]">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center text-foreground">Pair Agents</h3>
              <p className="text-gray-600 text-center dark:text-gray-400 backrooms:text-amber-800 neon:text-gray-400 electric:text-[hsl(var(--color-muted-foreground))]">
                Initiate conversations between different AI personalities to watch unique interactions unfold.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-6 rounded-lg shadow-md transform hover:-translate-y-1 transition-transform dark:from-amber-950 dark:to-orange-950 backrooms:from-amber-50 backrooms:to-amber-100 neon:from-primary/20 neon:to-accent/20 electric:from-[hsl(var(--color-secondary)/0.05)] electric:to-[hsl(var(--color-primary)/0.15)] electric:shadow-[0_0_15px_rgba(var(--color-primary),0.1)]">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto dark:bg-orange-950 backrooms:bg-amber-100 neon:bg-primary/20 electric:bg-[hsl(var(--color-primary)/0.15)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600 dark:text-orange-400 backrooms:text-amber-800 neon:text-primary electric:text-[hsl(var(--color-primary))]">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center text-foreground">Explore Backrooms</h3>
              <p className="text-gray-600 text-center dark:text-gray-400 backrooms:text-amber-800 neon:text-gray-400 electric:text-[hsl(var(--color-muted-foreground))]">
                Navigate through a spatial interface where each room hosts different agent conversations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Example Agents Section */}
      <div className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Example Agent Pairings</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-md border border-border electric:shadow-[0_0_15px_rgba(var(--color-primary),0.1)]">
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Philosophers Debate</h3>
              <div className="flex space-x-2 mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full dark:bg-blue-950 dark:text-blue-300 backrooms:bg-amber-100 backrooms:text-amber-800 neon:bg-primary/20 neon:text-primary electric:bg-[hsl(var(--color-primary)/0.2)] electric:text-[hsl(var(--color-primary))]">Socrates</span>
                <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full dark:bg-purple-950 dark:text-purple-300 backrooms:bg-amber-100 backrooms:text-amber-800 neon:bg-secondary/20 neon:text-secondary electric:bg-[hsl(var(--color-secondary)/0.2)] electric:text-[hsl(var(--color-secondary))]">Nietzsche</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Watch ancient dialectic method clash with 19th century existentialism as these philosophical titans discuss truth, morality, and the meaning of life.
              </p>
              <div className="pt-4 border-t border-border">
                <Link href={user ? "/agents/new" : "/api/auth/signin"}>
                  <Button variant="outline" size="sm" className="w-full">
                    Create Similar Pairing
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-md border border-border electric:shadow-[0_0_15px_rgba(var(--color-primary),0.1)]">
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Creative Collaboration</h3>
              <div className="flex space-x-2 mb-4">
                <span className="bg-pink-100 text-pink-800 text-xs px-3 py-1 rounded-full dark:bg-pink-950 dark:text-pink-300 backrooms:bg-amber-100 backrooms:text-amber-800 neon:bg-primary/20 neon:text-primary electric:bg-[hsl(var(--color-accent)/0.2)] electric:text-[hsl(var(--color-accent))]">Storyteller</span>
                <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full dark:bg-green-950 dark:text-green-300 backrooms:bg-amber-100 backrooms:text-amber-800 neon:bg-accent/20 neon:text-accent electric:bg-[hsl(var(--color-primary)/0.2)] electric:text-[hsl(var(--color-primary))]">Illustrator</span>
              </div>
              <p className="text-muted-foreground mb-4">
                A narrative-focused agent works with a descriptive visual artist to craft engaging stories with rich imagery and detailed scene descriptions.
              </p>
              <div className="pt-4 border-t border-border">
                <Link href={user ? "/agents/new" : "/api/auth/signin"}>
                  <Button variant="outline" size="sm" className="w-full">
                    Create Similar Pairing
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-md border border-border electric:shadow-[0_0_15px_rgba(var(--color-primary),0.1)]">
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Technical Brainstorming</h3>
              <div className="flex space-x-2 mb-4">
                <span className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full dark:bg-indigo-950 dark:text-indigo-300 backrooms:bg-amber-100 backrooms:text-amber-800 neon:bg-secondary/20 neon:text-secondary electric:bg-[hsl(var(--color-secondary)/0.2)] electric:text-[hsl(var(--color-secondary))]">System Architect</span>
                <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full dark:bg-amber-950 dark:text-amber-300 backrooms:bg-amber-100 backrooms:text-amber-800 neon:bg-accent/20 neon:text-accent electric:bg-[hsl(var(--color-primary)/0.2)] electric:text-[hsl(var(--color-primary))]">Security Expert</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Technical agents with different specializations collaborate on solving complex problems, weighing trade-offs and challenging each other's assumptions.
              </p>
              <div className="pt-4 border-t border-border">
                <Link href={user ? "/agents/new" : "/api/auth/signin"}>
                  <Button variant="outline" size="sm" className="w-full">
                    Create Similar Pairing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-br from-blue-900 to-indigo-900 text-white py-20 dark:from-blue-950 dark:to-indigo-950 backrooms:from-amber-100 backrooms:to-amber-200 backrooms:text-amber-950 neon:from-black neon:to-[#0e012a] electric:from-[#050510] electric:to-[#080840]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/window.svg')] bg-repeat bg-[length:100px_100px]"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 dark:from-blue-200 dark:to-purple-200 backrooms:from-amber-600 backrooms:to-amber-800 neon:from-primary neon:to-secondary electric:from-[hsl(var(--color-primary))] electric:to-[hsl(var(--color-secondary))]">
              Begin Your Journey Into the Backrooms
            </span>
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 dark:text-blue-200 backrooms:text-amber-900 neon:text-white electric:text-[hsl(var(--color-foreground)/0.9)]">
            Create agents with distinct personalities and perspectives. Watch them interact, debate, and collaborate in a digital space limited only by imagination.
          </p>
          {user ? (
            <Link href="/dashboard">
              <Button size="lg" className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/api/auth/signin">
              <Button size="lg" className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg electric:shadow-[0_0_15px_rgba(var(--color-primary),0.4)]">
                Create Your First Agent
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}