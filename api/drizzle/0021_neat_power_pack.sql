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
	`hasImage` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`owner`) REFERENCES `users_table`(`username`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_resources_table`("id", "owner", "title", "resourceUrl", "sourceUrl", "createdAt", "updatedAt", "tags", "hasImage") SELECT "id", "owner", "title", "resourceUrl", "sourceUrl", "createdAt", "updatedAt", "tags", "hasImage" FROM `resources_table`;--> statement-breakpoint
DROP TABLE `resources_table`;--> statement-breakpoint
ALTER TABLE `__new_resources_table` RENAME TO `resources_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_screenshots_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`resource_id` integer NOT NULL,
	`image` text,
	`hasImage` integer DEFAULT 1,
	`height` integer,
	`width` integer,
	`methodUsed` text DEFAULT 'openGraph',
	FOREIGN KEY (`resource_id`) REFERENCES `resources_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_screenshots_table`("id", "resource_id", "image", "hasImage", "height", "width", "methodUsed") SELECT "id", "resource_id", "image", "hasImage", "height", "width", "methodUsed" FROM `screenshots_table`;--> statement-breakpoint
DROP TABLE `screenshots_table`;--> statement-breakpoint
ALTER TABLE `__new_screenshots_table` RENAME TO `screenshots_table`;--> statement-breakpoint
CREATE TABLE `__new_users_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text DEFAULT '48a2d24d-cc22-440e-bdf9-b238eed31ffb' NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`createdAt` text
);
--> statement-breakpoint
INSERT INTO `__new_users_table`("id", "key", "username", "password", "createdAt") SELECT "id", "key", "username", "password", "createdAt" FROM `users_table`;--> statement-breakpoint
DROP TABLE `users_table`;--> statement-breakpoint
ALTER TABLE `__new_users_table` RENAME TO `users_table`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_username_unique` ON `users_table` (`username`);