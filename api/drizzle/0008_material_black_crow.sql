PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_resources_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner` text NOT NULL,
	`title` text NOT NULL,
	`resourceUrl` text,
	`sourceUrl` text,
	`createdAt` text,
	FOREIGN KEY (`owner`) REFERENCES `users_table`(`username`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_resources_table`("id", "owner", "title", "resourceUrl", "sourceUrl", "createdAt") SELECT "id", "owner", "title", "resourceUrl", "sourceUrl", "createdAt" FROM `resources_table`;--> statement-breakpoint
DROP TABLE `resources_table`;--> statement-breakpoint
ALTER TABLE `__new_resources_table` RENAME TO `resources_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;