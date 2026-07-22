CREATE TABLE `matches` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` integer NOT NULL,
	`deck_version_id` integer NOT NULL,
	`sequence_number` integer NOT NULL,
	`result` text NOT NULL,
	`round_label` text,
	`opponent_name` text,
	`memo` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE cascade ON DELETE restrict,
	FOREIGN KEY (`deck_version_id`) REFERENCES `deck_versions`(`id`) ON UPDATE cascade ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `matches_event_id_sequence_number_unique` ON `matches` (`event_id`,`sequence_number`);