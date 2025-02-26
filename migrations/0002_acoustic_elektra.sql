ALTER TABLE `ai_agent` RENAME COLUMN "provider" TO "providerId";--> statement-breakpoint
CREATE TABLE `provider` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`baseUrl` text NOT NULL,
	`apiKey` text NOT NULL,
	`organizationId` text,
	`models` text NOT NULL,
	`defaults` text,
	`rateLimits` text,
	`active` integer DEFAULT true NOT NULL,
	`createdAt` integer,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `provider_name_unique` ON `provider` (`name`);--> statement-breakpoint
ALTER TABLE `ai_agent` ALTER COLUMN "providerId" TO "providerId" text NOT NULL REFERENCES provider(id) ON DELETE cascade ON UPDATE no action;