-- CSR PARTNERSHIP SYSTEM - PRODUCTION READY DUMP
-- Simplified for TiDB Cloud Compatibility

CREATE TABLE IF NOT EXISTS `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
);

INSERT INTO `admins` (`id`, `username`, `password`, `email`, `created_at`) VALUES
(1, 'admin', '$2b$10$/gvsaspTovHjCJ3hG6b8MuRnfw57qm49VhFDydwr8IouKTpUCPEQu', 'admin@thecsruniverse.com', '2026-05-16 14:15:05')
ON DUPLICATE KEY UPDATE id=id;

CREATE TABLE IF NOT EXISTS `form_configs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `config_json` longtext NOT NULL,
  `status` enum('draft','published') DEFAULT 'draft',
  `version` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `published_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `form_configs` (`id`, `config_json`, `status`, `version`, `created_at`, `published_at`) VALUES
(1, '{"steps":[{"type":"hero","title":"Partner With Us","description":"Amplify Your Social Impact Through India''s Leading CSR & Sustainability Media Ecosystem"},{"type":"form","fields":[{"id":"email","label":"Enter Your Email","type":"email","required":true}]},{"type":"form","fields":[{"id":"full_name","label":"What''s Your Full Name?","type":"text","required":true}]},{"type":"event","id":"sica25","title":"SICA’25","tag":"Past Event Spotlight"},{"type":"form","fields":[{"id":"designation","label":"What''s Your Designation?","type":"text","required":true}]},{"type":"form","fields":[{"id":"phone_number","label":"Enter Your Phone Number","type":"tel","required":true}]},{"type":"form","fields":[{"id":"organization_name","label":"Organisation / Company Name","type":"text","required":true}]},{"type":"event","id":"casca26","title":"CASCA’26","tag":"Past Event Spotlight"},{"type":"form","fields":[{"id":"selected_package","label":"Select a Partnership Package","type":"package_select","required":true}]},{"type":"form","fields":[{"id":"custom_query","label":"Exploring Customized Partnership?","type":"textarea","required":false}]},{"type":"review","title":"Review Your Details"},{"type":"success","title":"Let''s Build Meaningful Impact Together"}]}', 'published', 1, '2026-05-16 14:15:05', NULL)
ON DUPLICATE KEY UPDATE id=id;

CREATE TABLE IF NOT EXISTS `form_submissions_v2` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `submission_data` longtext NOT NULL,
  `form_version` int(11) NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `status` varchar(20) DEFAULT 'pending',
  `device_info` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message` text NOT NULL,
  `is_seen` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `admin_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_id` int(11) DEFAULT NULL,
  `action` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
);
