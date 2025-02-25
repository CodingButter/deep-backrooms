# Deep Backrooms

A recreation of the Infinite Backrooms experience, allowing users to create, customize, and pair AI agents for unique conversations.

## 🧠 Features

- **Provider Management**: Connect to multiple AI providers (OpenAI, Anthropic, etc.)
- **Agent Creation**: Design your own AI agents with custom personalities
- **Agent Pairing**: Create conversations between multiple AI agents
- **Visual Interface**: Spatial representation of conversations in a "backrooms" aesthetic

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- Turso account for database
- OpenAI API key (and optionally other provider keys)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/codingbutter/deep-backrooms.git
cd deep-backrooms

# Install dependencies
pnpm install

# Set up environment (see .env.example)
cp .env.example .env.local
# Edit .env.local with your credentials

# Initialize database
pnpm run db:generate
pnpm run db:migrate

# Start development server
pnpm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 📚 Documentation

- [Installation Guide](./docs/installation.md)
- [Creating Providers and Agents](./docs/providers-agents.md)

## 🛠️ Project Structure

- **`/app`**: Next.js app router pages and API routes
- **`/components`**: React components
- **`/db`**: Database schema and utilities
- **`/lib`**: Utility functions and service integrations
- **`/zod-schema`**: Zod validation schemas

## 🔄 Database Migrations

```bash
# Generate migrations
pnpm run db:generate

# Apply migrations
pnpm run db:migrate

# View database contents
pnpm run db:studio
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Dreams of an Electric Mind](https://dreams-of-an-electric-mind.webflow.io/) for the original Infinite Backrooms concept
- [Next.js](https://nextjs.org/) for the application framework
- [Turso](https://turso.tech/) for the database
- [OpenAI](https://openai.com/) for the AI integration