CREATE TABLE `deck_version_themes` (
	`deck_version_id` integer NOT NULL,
	`theme_id` integer NOT NULL,
	PRIMARY KEY(`deck_version_id`, `theme_id`),
	FOREIGN KEY (`deck_version_id`) REFERENCES `deck_versions`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`theme_id`) REFERENCES `themes`(`id`) ON UPDATE cascade ON DELETE restrict
);
