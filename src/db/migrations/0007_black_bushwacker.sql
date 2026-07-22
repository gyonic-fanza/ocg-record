CREATE TABLE `match_opponent_themes` (
	`match_id` integer NOT NULL,
	`theme_id` integer NOT NULL,
	PRIMARY KEY(`match_id`, `theme_id`),
	FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`theme_id`) REFERENCES `themes`(`id`) ON UPDATE cascade ON DELETE restrict
);
