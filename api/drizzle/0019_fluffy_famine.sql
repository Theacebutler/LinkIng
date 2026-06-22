PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text DEFAULT 'c1114f0f-dcf9-4427-b76b-a5f074b6bea3' NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`createdAt` text
);
--> statement-breakpoint
INSERT INTO `__new_users_table`("id", "key", "username", "password", "createdAt") SELECT "id", "key", "username", "password", "createdAt" FROM `users_table`;--> statement-breakpoint
DROP TABLE `users_table`;--> statement-breakpoint
ALTER TABLE `__new_users_table` RENAME TO `users_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_username_unique` ON `users_table` (`username`);--> statement-breakpoint
ALTER TABLE `screenshots_table` ADD `methodUsed` text DEFAULT 'openGraph';