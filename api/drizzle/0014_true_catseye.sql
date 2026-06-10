PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_resources_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner` text NOT NULL,
	`title` text NOT NULL,
	`resourceUrl` text,
	`sourceUrl` text,
	`createdAt` text,
	`updatedAt` text,
	`tags` text DEFAULT '[]',
	FOREIGN KEY (`owner`) REFERENCES `users_table`(`username`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_resources_table`("id", "owner", "title", "resourceUrl", "sourceUrl", "createdAt", "updatedAt", "tags") SELECT "id", "owner", "title", "resourceUrl", "sourceUrl", "createdAt", "updatedAt", "tags" FROM `resources_table`;--> statement-breakpoint
DROP TABLE `resources_table`;--> statement-breakpoint
ALTER TABLE `__new_resources_table` RENAME TO `resources_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_users_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text DEFAULT 'ce06818f-7a68-4667-86e3-1c9d8c510874' NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`createdAt` text
);
--> statement-breakpoint
INSERT INTO `__new_users_table`("id", "key", "username", "password", "createdAt") SELECT "id", "key", "username", "password", "createdAt" FROM `users_table`;--> statement-breakpoint
DROP TABLE `users_table`;--> statement-breakpoint
ALTER TABLE `__new_users_table` RENAME TO `users_table`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_username_unique` ON `users_table` (`username`);