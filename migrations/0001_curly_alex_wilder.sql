CREATE TABLE `ai_agent` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`name` text NOT NULL,
	`avatar` text,
	`provider` text NOT NULL,
	`model` text NOT NULL,
	`systemPrompt` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `conversation_agent` (
	`conversationId` text NOT NULL,
	`agentId` text NOT NULL,
	PRIMARY KEY(`conversationId`, `agentId`),
	FOREIGN KEY (`conversationId`) REFERENCES `conversation`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`agentId`) REFERENCES `ai_agent`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `conversation` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`name` text NOT NULL,
	`coverImage` text,
	`messages` text NOT NULL,
	`agentIds` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
