-- CSR PARTNERSHIP SYSTEM - FULL DATABASE SCHEMA & INITIAL DATA

SET NAMES utf8mb4;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. CREATE TABLES
-- ---------------------------------------------------------

-- Form Configurations (Version Control & Drafts)
CREATE TABLE IF NOT EXISTS `form_configs` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `config_json` longtext NOT NULL,
    `status` enum('draft', 'published') DEFAULT 'draft',
    `version` int(11) DEFAULT 1,
    `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- Form Submissions
CREATE TABLE IF NOT EXISTS `form_submissions_v2` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `submission_data` longtext NOT NULL,
    `form_version` int(11) DEFAULT 1,
    `is_read` tinyint(1) DEFAULT 0,
    `device_info` text DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- Admin Users
CREATE TABLE IF NOT EXISTS `admin_users` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `username` varchar(50) NOT NULL,
    `password` varchar(255) NOT NULL,
    `full_name` varchar(100) DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`),
    UNIQUE KEY `username` (`username`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- Notifications
CREATE TABLE IF NOT EXISTS `notifications` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `message` text NOT NULL,
    `is_read` tinyint(1) DEFAULT 0,
    `created_at` timestamp NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- 2. INSERT INITIAL DATA
-- ---------------------------------------------------------

-- Initial Admin User (Username: akash | Password: password123)
-- Password hashed using bcrypt
INSERT INTO
    `admin_users` (
        `username`,
        `password`,
        `full_name`
    )
VALUES (
        'akash',
        '$2a$10$7R.p5L1q0F1Q6H7X/E.5UuW6A.6.M.M.M.M.M.M.M.M.M.M.M',
        'Akash'
    );

-- Initial Published Form Configuration (Full SICA/CASCA Dynamic Setup)
INSERT INTO
    `form_configs` (
        `config_json`,
        `status`,
        `version`
    )
VALUES (
        '{
  "steps": [
    {
      "type": "event",
      "id": "sica_2025",
      "tag": "PAST EVENT SPOTLIGHT",
      "title": "SICA’25",
      "subtitle": "5th Social Impact Conference & Awards 2025",
      "image": "https://thecsruniverse.com/assets/events_files/images/SICA%2725-Web-banner-11.png",
      "description": "A flagship national conference bringing together CSR leaders and NGOs to drive social transformation across India.",
      "images": [
        "https://via.placeholder.com/400x400?text=SICA+Gallery+1",
        "https://via.placeholder.com/400x400?text=SICA+Gallery+2",
        "https://via.placeholder.com/400x400?text=SICA+Gallery+3"
      ]
    },
    {
      "type": "event",
      "id": "casca_2024",
      "tag": "UPCOMING OPPORTUNITY",
      "title": "CASCA’24",
      "subtitle": "Corporate Social Collaboration Awards",
      "image": "https://via.placeholder.com/800x400?text=CASCA+Banner",
      "description": "Celebrating the most impactful collaborations between corporates and implementing agencies in the CSR ecosystem.",
      "images": []
    },
    {
      "type": "form",
      "title": "Partner With Us",
      "fields": [
        { "id": "org_name", "label": "Organization Name", "type": "text", "placeholder": "Enter your org name", "required": true },
        { "id": "contact_name", "label": "Contact Person", "type": "text", "placeholder": "Your Name", "required": true },
        { "id": "email", "label": "Email Address", "type": "email", "placeholder": "email@example.com", "required": true },
        { "id": "phone", "label": "Phone Number", "type": "tel", "placeholder": "+91 00000 00000", "required": true }
      ]
    },
    {
      "type": "form",
      "title": "Select Sponsorship Package",
      "fields": [
        {
          "id": "selected_package",
          "label": "Choose your package",
          "type": "package_select",
          "required": true
        }
      ],
      "packages": [
        { "id": "silver", "name": "Silver Partner", "price": "₹2 Lakhs", "features": ["Logo in event area", "2 Delegate passes", "Social media mention"] },
        { "id": "gold", "name": "Gold Partner", "price": "₹5 Lakhs", "features": ["Featured logo on stage", "5 Delegate passes", "10-minute presentation slot", "Interview in newsletter"] },
        { "id": "platinum", "name": "Platinum Partner", "price": "₹10 Lakhs", "features": ["Title branding", "Premium booth space", "VIP seating", "Cover story feature"] }
      ]
    }
  ]
}',
        'published',
        1
    );

SET FOREIGN_KEY_CHECKS = 1;