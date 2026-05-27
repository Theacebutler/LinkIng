PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_screenshots_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`resource_id` integer NOT NULL,
	`image` text,
	FOREIGN KEY (`resource_id`) REFERENCES `resources_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_screenshots_table`("id", "resource_id", "image") SELECT "id", "resource_id", "image" FROM `screenshots_table`;--> statement-breakpoint
DROP TABLE `screenshots_table`;--> statement-breakpoint
ALTER TABLE `__new_screenshots_table` RENAME TO `screenshots_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;