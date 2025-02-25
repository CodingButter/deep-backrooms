-- Create providers table
CREATE TABLE `provider` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `baseUrl` text NOT NULL,
  `apiKey` text NOT NULL,
  `organizationId` text,
  `models` text NOT NULL,
  `defaults` text,
  `rateLimits` text,
  `active` integer NOT NULL DEFAULT 1,
  `createdAt` integer NOT NULL,
  `updatedAt` integer NOT NULL
);

-- Create unique index on provider name
CREATE UNIQUE INDEX `provider_name_idx` ON `provider` (`name`);

-- Alter aiAgents table to use provider relationship
ALTER TABLE `ai_agent` ADD COLUMN `providerId` text NOT NULL REFERENCES `provider` (`id`) ON DELETE CASCADE;

-- Create migration for existing data
-- Note: This is a placeholder and should be adjusted based on existing data
-- UPDATE `ai_agent` SET `providerId` = (SELECT `id` FROM `provider` WHERE `name` = `ai_agent`.`provider` LIMIT 1);

-- Remove the old provider column
ALTER TABLE `ai_agent` DROP COLUMN `provider`;

-- Create index on the new foreign key
CREATE INDEX `ai_agent_providerId_idx` ON `ai_agent` (`providerId`);