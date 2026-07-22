CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_type_id` integer NOT NULL,
	`event_date` text NOT NULL,
	`title` text,
	`venue` text,
	`participant_count` integer,
	`started_at` integer,
	`ended_at` integer,
	`memo` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`event_type_id`) REFERENCES `event_types`(`id`) ON UPDATE cascade ON DELETE restrict
);
