CREATE TABLE `resources_table` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`resourceUrl` text,
	`sourceUrl` text,
	`createdAt` text
);
--> statement-breakpoint
CREATE TABLE `screenshots_table` (
	`id` text PRIMARY KEY NOT NULL,
	`resource_id` text NOT NULL,
	`image` text,
	FOREIGN KEY (`resource_id`) REFERENCES `resources_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users_table` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`password` text
);
