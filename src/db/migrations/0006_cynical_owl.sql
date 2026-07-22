CREATE TABLE `duels` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`match_id` integer NOT NULL,
	`sequence_number` integer NOT NULL,
	`result` text NOT NULL,
	`turn_order` text,
	`memo` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `duels_match_id_sequence_number_unique` ON `duels` (`match_id`,`sequence_number`);