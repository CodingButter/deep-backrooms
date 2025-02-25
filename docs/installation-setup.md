# Installation and Setup Guide

This guide provides detailed steps to set up the Deep Backrooms project from scratch.

## Database Setup

### Turso Database

1. Create a Turso account at [turso.tech](https://turso.tech)
2. Install the Turso CLI:
   ```bash
   curl -sSfL https://get.turso.tech/install.sh | bash
   ```
3. Log in to your account:
   ```bash
   turso auth login
   ```
4. Create a new database:
   ```bash
   turso db create deep-backrooms
   ```
5. Get your database URL:
   ```bash
   turso db show deep-backrooms --url
   ```
6. Create an auth token:
   ```bash
   turso db tokens create deep-backrooms
   ```

### Environment Variables

Create a `.env.local` file with:

```bash
# Database
DATABASE_URL="libsql://your-database-url"
TURSO_AUTH_TOKEN="your-turso-auth-token"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# OpenAI (default provider)
OPENAI_API_KEY="your-openai-api-key"
```

### Initialize Database

Generate and run migrations:

```bash
pnpm run db:generate
pnpm run db:migrate
```

## Authentication Setup

### NextAuth Configuration

1. Set up your preferred authentication providers in `auth.ts`
2. For OAuth providers, register your app and obtain credentials
3. Add provider credentials to your `.env.local` file, for example:

```bash
# OAuth Providers
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
GOOGLE_ID="your-google-client-id"
GOOGLE_SECRET="your-google-client-secret"
```

## AI Provider Setup

### OpenAI (Default)

1. Create an account at [platform.openai.com](https://platform.openai.com)
2. Generate an API key in the API section
3. Add the key to your `.env.local` file

### Anthropic (Optional)

1. Sign up at [anthropic.com](https://anthropic.com)
2. Request API access and obtain an API key
3. Add to your environment variables:
   ```
   ANTHROPIC_API_KEY="your-anthropic-api-key"
   ```

### Other Providers

For additional providers, follow similar steps to obtain API credentials and add them to your environment variables.

## Development Workflow

### Running the Application

```bash
pnpm run dev
```

### Building for Production

```bash
pnpm run build
pnpm run start
```

## Troubleshooting

### Database Connection Issues

- Verify your Turso credentials are correct
- Check firewall settings if running locally
- Test connection with `turso db shell deep-backrooms`

### API Provider Errors

- Verify API keys are correct and have necessary permissions
- Check rate limits and quotas
- Review API documentation for specific error codes

### NextAuth Problems

- Ensure NEXTAUTH_URL matches your deployment URL
- Confirm NEXTAUTH_SECRET is set
- Check OAuth callback URLs are configured correctly

## Server Requirements

For production deployment:

- Node.js 18+ environment
- At least 1GB RAM
- Outbound internet access for API calls
- Domain with HTTPS for secure authentication

## Docker Deployment (Optional)

Build and run the Docker container:

```bash
docker build -t deep-backrooms .
docker run -p 3000:3000 --env-file .env.local deep-backrooms
```

## Updates and Maintenance

After pulling updates:

1. Install any new dependencies:
   ```bash
   pnpm install
   ```
2. Run database migrations:
   ```bash
   pnpm run db:migrate
   ```
3. Rebuild the application:
   ```bash
   pnpm run build
   ```