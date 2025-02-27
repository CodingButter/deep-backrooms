CREATE TABLE `agents` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
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
	`user_id` text,
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
CREATE UNIQUE INDEX `name_user_idx` ON `agents` (`name`,`user_id`);--> statement-breakpoint
CREATE TABLE `ai_providers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`base_url` text NOT NULL,
	`api_key` text NOT NULL,
	`is_private` integer DEFAULT false NOT NULL,
	`user_id` text,
	`rate_limit_per_minute` integer DEFAULT 60 NOT NULL,
	`usage_quota` integer,
	`status` text DEFAULT 'active' NOT NULL,
	`auth_type` text DEFAULT 'api_key' NOT NULL,
	`provider_type` text DEFAULT 'llm' NOT NULL,
	`config_schema` text DEFAULT '{}',
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ai_providers_name_idx` ON `ai_providers` (`name`);--> statement-breakpoint
CREATE TABLE `provider_models` (
	`id` text PRIMARY KEY NOT NULL,
	`provider_id` text NOT NULL,
	`model` text NOT NULL,
	`temperature` real DEFAULT 0.7 NOT NULL,
	`max_tokens` integer DEFAULT 4096 NOT NULL,
	`top_p` real DEFAULT 1 NOT NULL,
	`context_window` integer DEFAULT 8192 NOT NULL,
	`rate_limit` integer DEFAULT 60 NOT NULL,
	`is_experimental` integer DEFAULT false NOT NULL,
	`is_default` integer DEFAULT false NOT NULL,
	`display_name` text,
	`capabilities` text DEFAULT '["chat"]',
	`cost_per_token` real DEFAULT 0,
	`tokenizer` text DEFAULT 'gpt-3.5-turbo',
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`provider_id`) REFERENCES `ai_providers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `model_provider_idx` ON `provider_models` (`provider_id`,`model`);