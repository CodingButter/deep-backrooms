DROP TABLE `ai_agent`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_conversation_agent` (
	`conversationId` text NOT NULL,
	`agentId` text NOT NULL,
	PRIMARY KEY(`conversationId`, `agentId`),
	FOREIGN KEY (`conversationId`) REFERENCES `conversation`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`agentId`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_conversation_agent`("conversationId", "agentId") SELECT "conversationId", "agentId" FROM `conversation_agent`;--> statement-breakpoint
DROP TABLE `conversation_agent`;--> statement-breakpoint
ALTER TABLE `__new_conversation_agent` RENAME TO `conversation_agent`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_agents` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`avatar` text,
	`provider_id` text NOT NULL,
	`model_id` text NOT NULL,
	`temperature` real DEFAULT 0.7 NOT NULL,
	`max_tokens` integer DEFAULT 4096 NOT NULL,
	`top_p` real DEFAULT 1 NOT NULL,
	`frequency_penalty` real DEFAULT 0 NOT NULL,
	`system_prompt` text DEFAULT 'You are an AI assistant.' NOT NULL,
	`persona` text DEFAULT '{}' NOT NULL,
	`tool_access` text DEFAULT '[]' NOT NULL,
	`memory_enabled` integer DEFAULT false NOT NULL,
	`session_limit` integer DEFAULT 5 NOT NULL,
	`user_id` text NOT NULL,
	`custom_model_params` text DEFAULT '{}',
	`visibility_scope` text DEFAULT 'private' NOT NULL,
	`version` text DEFAULT '1.0',
	`category_tags` text DEFAULT '[]',
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`provider_id`) REFERENCES `ai_providers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`model_id`) REFERENCES `provider_models`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_agents`("id", "name", "description", "avatar", "provider_id", "model_id", "temperature", "max_tokens", "top_p", "frequency_penalty", "system_prompt", "persona", "tool_access", "memory_enabled", "session_limit", "user_id", "custom_model_params", "visibility_scope", "version", "category_tags", "created_at", "updated_at") SELECT "id", "name", "description", "avatar", "provider_id", "model_id", "temperature", "max_tokens", "top_p", "frequency_penalty", "system_prompt", "persona", "tool_access", "memory_enabled", "session_limit", "user_id", "custom_model_params", "visibility_scope", "version", "category_tags", "created_at", "updated_at" FROM `agents`;--> statement-breakpoint
DROP TABLE `agents`;--> statement-breakpoint
ALTER TABLE `__new_agents` RENAME TO `agents`;--> statement-breakpoint
CREATE UNIQUE INDEX `name_user_idx` ON `agents` (`name`,`user_id`);