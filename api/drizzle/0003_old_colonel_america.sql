PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_resources_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner` text NOT NULL,
	`title` integer NOT NULL,
	`resourceUrl` text,
	`sourceUrl` text,
	`createdAt` text,
	FOREIGN KEY (`owner`) REFERENCES `users_table`(`name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_resources_table`("id", "owner", "title", "resourceUrl", "sourceUrl", "createdAt") SELECT "id", "owner", "title", "resourceUrl", "sourceUrl", "createdAt" FROM `resources_table`;--> statement-breakpoint
DROP TABLE `resources_table`;--> statement-breakpoint
ALTER TABLE `__new_resources_table` RENAME TO `resources_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_screenshots_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`resource_id` text NOT NULL,
	`image` text,
	FOREIGN KEY (`resource_id`) REFERENCES `resources_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_screenshots_table`("id", "resource_id", "image") SELECT "id", "resource_id", "image" FROM `screenshots_table`;--> statement-breakpoint
DROP TABLE `screenshots_table`;--> statement-breakpoint
ALTER TABLE `__new_screenshots_table` RENAME TO `screenshots_table`;--> statement-breakpoint
CREATE TABLE `__new_users_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`password` text
);
--> statement-breakpoint
INSERT INTO `__new_users_table`("id", "name", "password") SELECT "id", "name", "password" FROM `users_table`;--> statement-breakpoint
DROP TABLE `users_table`;--> statement-breakpoint
ALTER TABLE `__new_users_table` RENAME TO `users_table`;