-- CSR PARTNERSHIP SYSTEM - PRODUCTION READY DUMP
-- Generated: 16/5/2026, 10:24:06 pm

SET NAMES utf8mb4;

SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS `csr_form`;

USE `csr_form`;

-- Table structure for admins
DROP TABLE IF EXISTS `admins`;

CREATE TABLE `admins` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `username` varchar(50) NOT NULL,
    `password` varchar(255) NOT NULL,
    `email` varchar(100) NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`),
    UNIQUE KEY `username` (`username`),
    UNIQUE KEY `email` (`email`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- Data for admins
INSERT INTO
    `admins` (
        `id`,
        `username`,
        `password`,
        `email`,
        `created_at`
    )
VALUES (
        1,
        'admin',
        '$2b$10$/gvsaspTovHjCJ3hG6b8MuRnfw57qm49VhFDydwr8IouKTpUCPEQu',
        'admin@thecsruniverse.com',
        '2026-05-16 14:15:05'
    );

-- Table structure for form_configs
DROP TABLE IF EXISTS `form_configs`;

CREATE TABLE `form_configs` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `config_json` longtext NOT NULL,
    `status` enum('draft', 'published') DEFAULT 'draft',
    `version` int(11) DEFAULT 1,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `published_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 10 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- Data for form_configs
INSERT INTO
    `form_configs` (
        `id`,
        `config_json`,
        `status`,
        `version`,
        `created_at`,
        `published_at`
    )
VALUES (
        1,
        '{
  "steps": [
    {"type": "hero", "title": "Partner With Us", "description": "Amplify Your Social Impact Through India''s Leading CSR & Sustainability Media Ecosystem"},
    {"type": "form", "fields": [{"id": "email", "label": "Enter Your Email", "type": "email", "required": true}]},
    {"type": "form", "fields": [{"id": "full_name", "label": "What''s Your Full Name?", "type": "text", "required": true}]},
    {"type": "event", "id": "sica25", "title": "SICA’25", "tag": "Past Event Spotlight"},
    {"type": "form", "fields": [{"id": "designation", "label": "What''s Your Designation?", "type": "text", "required": true}]},
    {"type": "form", "fields": [{"id": "phone_number", "label": "Enter Your Phone Number", "type": "tel", "required": true}]},
    {"type": "form", "fields": [{"id": "organization_name", "label": "Organisation / Company Name", "type": "text", "required": true}]},
    {"type": "event", "id": "casca26", "title": "CASCA’26", "tag": "Past Event Spotlight"},
    {"type": "form", "fields": [{"id": "selected_package", "label": "Select a Partnership Package", "type": "package_select", "required": true}]},
    {"type": "form", "fields": [{"id": "custom_query", "label": "Exploring Customized Partnership?", "type": "textarea", "required": false}]},
    {"type": "review", "title": "Review Your Details"},
    {"type": "success", "title": "Let''s Build Meaningful Impact Together"}
  ]
}',
        'published',
        1,
        '2026-05-16 14:15:05',
        NULL
    ),
    (
        2,
        '{"steps":[{"type":"hero","title":"Partner With Us","description":"Amplify Your Social Impact Through India''s Leading CSR & Sustainability Media Ecosystem"},{"type":"form","fields":[{"id":"email","label":"Enter Your Email","type":"email","required":true}]},{"type":"form","fields":[{"id":"full_name","label":"What''s Your Full Name?","type":"text","required":true}]},{"type":"event","id":"sica25","title":"SICA’25","tag":"Past Event Spotlight"},{"type":"form","fields":[{"id":"designation","label":"What''s Your Designation?","type":"text","required":true}]},{"type":"form","fields":[{"id":"phone_number","label":"Enter Your Phone Number","type":"tel","required":true}]},{"type":"form","fields":[{"id":"organization_name","label":"Organisation / Company Name","type":"text","required":true}]},{"type":"event","id":"casca26","title":"CASCA’26","tag":"Past Event Spotlight"},{"type":"form","fields":[{"id":"selected_package","label":"Select a Partnership Package","type":"package_select","required":true}]},{"type":"form","fields":[{"id":"custom_query","label":"Exploring Customized Partnership?","type":"textarea","required":false}]},{"type":"review","title":"Review Your Details"},{"type":"success","title":"Let''s Build Meaningful Impact Together"}]}',
        'draft',
        1,
        '2026-05-16 14:24:43',
        NULL
    ),
    (
        3,
        '{
  "steps": [
    { "type": "hero", "title": "Partner With Us", "description": "Amplify Your Social Impact Through India’s Leading CSR & Sustainability Media Ecosystem" },
    { "type": "form", "fields": [{ "id": "email", "label": "Enter Your Email Address", "type": "email", "required": true }] },
    { "type": "form", "fields": [{ "id": "full_name", "label": "What’s Your Full Name?", "type": "text", "required": true }] },
    { 
      "type": "event", 
      "id": "sica25", 
      "tag": "Past Event Spotlight", 
      "title": "SICA’25", 
      "subtitle": "5th Social Impact Conference & Awards 2025",
      "description": "A flagship national conference bringing together CSR leaders and NGOs to drive social transformation across India.",
      "image": "https://thecsruniverse.com/assets/images/sica_hero.jpg",
      "images": [
        "https://via.placeholder.com/400x400?text=SICA+1",
        "https://via.placeholder.com/400x400?text=SICA+2",
        "https://via.placeholder.com/400x400?text=SICA+3"
      ]
    },
    { "type": "form", "fields": [{ "id": "designation", "label": "What’s Your Designation?", "type": "text", "required": true }] },
    { 
      "type": "event", 
      "id": "casca26", 
      "tag": "Upcoming Spotlight", 
      "title": "CASCA’26", 
      "subtitle": "Climate Action & Sustainability Conference & Awards 2026",
      "description": "Connecting environmental leaders to drive conversations around climate action and sustainable growth.",
      "image": "https://thecsruniverse.com/assets/images/casca_hero.jpg",
      "images": [
        "https://via.placeholder.com/400x400?text=CASCA+1",
        "https://via.placeholder.com/400x400?text=CASCA+2"
      ]
    },
    { "type": "form", "fields": [{ "id": "phone_number", "label": "Enter Your Phone Number", "type": "tel", "required": true }] },
    { "type": "form", "fields": [{ "id": "organization_name", "label": "Organisation / Company Name", "type": "text", "required": true }] },
    { 
      "type": "form", 
      "fields": [{ "id": "selected_package", "label": "Select a Partnership Package", "type": "package_select", "required": true }],
      "packages": [
        { "id": "p1", "name": "1 Month Coverage", "price": "₹15,000 + GST", "features": ["2 News", "1 Interview", "Social Media Promotion"] },
        { "id": "p2", "name": "4 Month Coverage", "price": "₹40,000 + GST", "features": ["4 News", "1 Video Interview", "Opinion Piece", "Delegate Pass"] },
        { "id": "p3", "name": "Event Media Partnership", "price": "₹50,000 + GST", "features": ["Pre/During/Post Event Coverage", "Editorial Support"] }
      ]
    },
    { "type": "form", "fields": [{ "id": "custom_query", "label": "Exploring Customized Partnership?", "type": "textarea", "required": false }] },
    { "type": "review", "title": "Review Your Details" },
    { "type": "success", "title": "Application Received" }
  ]
}',
        'published',
        1,
        '2026-05-16 14:39:36',
        NULL
    ),
    (
        4,
        '{"steps":[{"type":"hero","title":"Partner With Us","description":"Amplify Your Social Impact Through India’s Leading CSR & Sustainability Media Ecosystem"},{"type":"form","fields":[{"id":"email","label":"Enter Your Email Address","type":"email","required":true}]},{"type":"form","fields":[{"id":"full_name","label":"What’s Your Full Name?","type":"text","required":true}]},{"type":"event","id":"sica25","tag":"Past Event Spotlight","title":"SICA’25","subtitle":"5th Social Impact Conference & Awards 2025","description":"A flagship national conference bringing together CSR leaders and NGOs to drive social transformation across India.","image":"https://thecsruniverse.com/assets/images/sica_hero.jpg","images":["https://via.placeholder.com/400x400?text=SICA+1","https://via.placeholder.com/400x400?text=SICA+2","https://via.placeholder.com/400x400?text=SICA+3"]},{"type":"form","fields":[{"id":"designation","label":"What’s Your Designation?","type":"text","required":true}]},{"type":"event","id":"casca26","tag":"Upcoming Spotlight","title":"CASCA’26","subtitle":"Climate Action & Sustainability Conference & Awards 2026","description":"Connecting environmental leaders to drive conversations around climate action and sustainable growth.","image":"https://thecsruniverse.com/assets/images/casca_hero.jpg","images":["https://via.placeholder.com/400x400?text=CASCA+1","https://via.placeholder.com/400x400?text=CASCA+2"]},{"type":"form","fields":[{"id":"phone_number","label":"Enter Your Phone Number","type":"tel","required":true}]},{"type":"form","fields":[{"id":"organization_name","label":"Organisation / Company Name","type":"text","required":true}]},{"type":"form","fields":[{"id":"selected_package","label":"Select a Partnership Package","type":"package_select","required":true}],"packages":[{"id":"p1","name":"1 Month Coverage","price":"₹15,000 + GST","features":["2 News","1 Interview","Social Media Promotion"]},{"id":"p2","name":"4 Month Coverage","price":"₹40,000 + GST","features":["4 News","1 Video Interview","Opinion Piece","Delegate Pass"]},{"id":"p3","name":"Event Media Partnership","price":"₹50,000 + GST","features":["Pre/During/Post Event Coverage","Editorial Support"]}]},{"type":"form","fields":[{"id":"custom_query","label":"Exploring Customized Partnership?","type":"textarea","required":false}]},{"type":"review","title":"Review Your Details"},{"type":"success","title":"Application Received"}]}',
        'draft',
        1,
        '2026-05-16 14:41:53',
        NULL
    ),
    (
        5,
        '{"steps":[{"type":"hero","title":"Partner With Us","description":"Amplify Your Social Impact Through India’s Leading CSR & Sustainability Media Ecosystem"},{"type":"form","fields":[{"id":"email","label":"Enter Your Email Address","type":"email","required":true}]},{"type":"form","fields":[{"id":"full_name","label":"What’s Your Full Name?","type":"text","required":true}]},{"type":"event","id":"sica25","tag":"Past Event Spotlight","title":"SICA’25","subtitle":"5th Social Impact Conference & Awards 2025","description":"A flagship national conference bringing together CSR leaders and NGOs to drive social transformation across India.","image":"https://thecsruniverse.com/assets/events_files/images/SICA''25-Web-banner-11.png","images":["https://via.placeholder.com/400x400?text=SICA+1","https://via.placeholder.com/400x400?text=SICA+2","https://via.placeholder.com/400x400?text=SICA+3"]},{"type":"form","fields":[{"id":"designation","label":"What’s Your Designation?","type":"text","required":true}]},{"type":"event","id":"casca26","tag":"Upcoming Spotlight","title":"CASCA’26","subtitle":"Climate Action & Sustainability Conference & Awards 2026","description":"Connecting environmental leaders to drive conversations around climate action and sustainable growth.","image":"https://thecsruniverse.com/assets/images/casca_hero.jpg","images":["https://via.placeholder.com/400x400?text=CASCA+1","https://via.placeholder.com/400x400?text=CASCA+2"]},{"type":"form","fields":[{"id":"phone_number","label":"Enter Your Phone Number","type":"tel","required":true}]},{"type":"form","fields":[{"id":"organization_name","label":"Organisation / Company Name","type":"text","required":true}]},{"type":"form","fields":[{"id":"selected_package","label":"Select a Partnership Package","type":"package_select","required":true}],"packages":[{"id":"p1","name":"1 Month Coverage","price":"₹15,000 + GST","features":["2 News","1 Interview","Social Media Promotion"]},{"id":"p2","name":"4 Month Coverage","price":"₹40,000 + GST","features":["4 News","1 Video Interview","Opinion Piece","Delegate Pass"]},{"id":"p3","name":"Event Media Partnership","price":"₹50,000 + GST","features":["Pre/During/Post Event Coverage","Editorial Support"]}]},{"type":"form","fields":[{"id":"custom_query","label":"Exploring Customized Partnership?","type":"textarea","required":false}]},{"type":"review","title":"Review Your Details"},{"type":"success","title":"Application Received"}]}',
        'draft',
        1,
        '2026-05-16 14:46:28',
        NULL
    ),
    (
        6,
        '{"steps":[{"type":"hero","title":"Partner With Us","description":"Amplify Your Social Impact Through India’s Leading CSR & Sustainability Media Ecosystem"},{"type":"form","fields":[{"id":"email","label":"Enter Your Email Address","type":"email","required":true}]},{"type":"form","fields":[{"id":"full_name","label":"What’s Your Full Name?","type":"text","required":true}]},{"type":"event","id":"sica25","tag":"Past Event Spotlight","title":"SICA’25","subtitle":"5th Social Impact Conference & Awards 2025","description":"A flagship national conference bringing together CSR leaders and NGOs to drive social transformation across India.","image":"https://thecsruniverse.com/assets/images/sica_hero.jpg","images":["https://via.placeholder.com/400x400?text=SICA+1","https://via.placeholder.com/400x400?text=SICA+2","https://via.placeholder.com/400x400?text=SICA+3"]},{"type":"form","fields":[{"id":"designation","label":"What’s Your Designation?","type":"text","required":true}]},{"type":"event","id":"casca26","tag":"Upcoming Spotlight","title":"CASCA’26","subtitle":"Climate Action & Sustainability Conference & Awards 2026","description":"Connecting environmental leaders to drive conversations around climate action and sustainable growth.","image":"https://thecsruniverse.com/assets/images/casca_hero.jpg","images":["https://via.placeholder.com/400x400?text=CASCA+1","https://via.placeholder.com/400x400?text=CASCA+2"]},{"type":"form","fields":[{"id":"phone_number","label":"Enter Your Phone Number","type":"tel","required":true}]},{"type":"form","fields":[{"id":"organization_name","label":"Organisation / Company Name","type":"text","required":true}]},{"type":"form","fields":[{"id":"selected_package","label":"Select a Partnership Package","type":"package_select","required":true}],"packages":[{"id":"p1","name":"1 Month Coverage","price":"₹15,000 + GST","features":["2 News","1 Interview","Social Media Promotion"]},{"id":"p2","name":"4 Month Coverage","price":"₹40,000 + GST","features":["4 News","1 Video Interview","Opinion Piece","Delegate Pass"]},{"id":"p3","name":"Event Media Partnership","price":"₹50,000 + GST","features":["Pre/During/Post Event Coverage","Editorial Support"]}]},{"type":"form","fields":[{"id":"custom_query","label":"Exploring Customized Partnership?","type":"textarea","required":false}]},{"type":"review","title":"Review Your Details"},{"type":"success","title":"Application Received"}]}',
        'draft',
        1,
        '2026-05-16 14:48:39',
        NULL
    ),
    (
        7,
        '{"steps":[{"type":"hero","title":"Partner With Us","description":"Amplify Your Social Impact Through India’s Leading CSR & Sustainability Media Ecosystem"},{"type":"form","fields":[{"id":"email","label":"Enter Your Email Address","type":"email","required":true}]},{"type":"form","fields":[{"id":"full_name","label":"What’s Your Full Name?","type":"text","required":true}]},{"type":"event","id":"sica25","tag":"Past Event Spotlight","title":"SICA’25","subtitle":"5th Social Impact Conference & Awards 2025","description":"A flagship national conference bringing together CSR leaders and NGOs to drive social transformation across India.","image":"http://localhost:5000/uploads/1778948570817-SICA''25-Web-banner-11.png","images":["https://via.placeholder.com/400x400?text=SICA+1","https://via.placeholder.com/400x400?text=SICA+2","https://via.placeholder.com/400x400?text=SICA+3"]},{"type":"form","fields":[{"id":"designation","label":"What’s Your Designation?","type":"text","required":true}]},{"type":"event","id":"casca26","tag":"Upcoming Spotlight","title":"CASCA’26","subtitle":"Climate Action & Sustainability Conference & Awards 2026","description":"Connecting environmental leaders to drive conversations around climate action and sustainable growth.","image":"https://thecsruniverse.com/assets/images/casca_hero.jpg","images":["https://via.placeholder.com/400x400?text=CASCA+1","https://via.placeholder.com/400x400?text=CASCA+2"]},{"type":"form","fields":[{"id":"phone_number","label":"Enter Your Phone Number","type":"tel","required":true}]},{"type":"form","fields":[{"id":"organization_name","label":"Organisation / Company Name","type":"text","required":true}]},{"type":"form","fields":[{"id":"selected_package","label":"Select a Partnership Package","type":"package_select","required":true}],"packages":[{"id":"p1","name":"1 Month Coverage","price":"₹15,000 + GST","features":["2 News","1 Interview","Social Media Promotion"]},{"id":"p2","name":"4 Month Coverage","price":"₹40,000 + GST","features":["4 News","1 Video Interview","Opinion Piece","Delegate Pass"]},{"id":"p3","name":"Event Media Partnership","price":"₹50,000 + GST","features":["Pre/During/Post Event Coverage","Editorial Support"]}]},{"type":"form","fields":[{"id":"custom_query","label":"Exploring Customized Partnership?","type":"textarea","required":false}]},{"type":"review","title":"Review Your Details"},{"type":"success","title":"Application Received"}]}',
        'published',
        1,
        '2026-05-16 16:23:04',
        NULL
    ),
    (
        8,
        '{"steps":[{"type":"hero","title":"Partner With Us","description":"Amplify Your Social Impact Through India’s Leading CSR & Sustainability Media Ecosystem"},{"type":"form","fields":[{"id":"email","label":"Enter Your Email Address","type":"email","required":true}]},{"type":"form","fields":[{"id":"full_name","label":"What’s Your Full Name?","type":"text","required":true}]},{"type":"event","id":"sica25","tag":"Past Event Spotlight","title":"SICA’25","subtitle":"5th Social Impact Conference & Awards 2025","description":"A flagship national conference bringing together CSR leaders and NGOs to drive social transformation across India.","image":"http://localhost:5000/uploads/1778948570817-SICA''25-Web-banner-11.png","images":["http://localhost:5000/uploads/1778948628649-SICA25-Web-banner-Jury-11.png","http://localhost:5000/uploads/1778948632349-SICA25-Web-banner-Jury-11.png","http://localhost:5000/uploads/1778948636119-SICA25-Web-banner-Jury-11.png"]},{"type":"form","fields":[{"id":"designation","label":"What’s Your Designation?","type":"text","required":true}]},{"type":"event","id":"casca26","tag":"Upcoming Spotlight","title":"CASCA’26","subtitle":"Climate Action & Sustainability Conference & Awards 2026","description":"Connecting environmental leaders to drive conversations around climate action and sustainable growth.","image":"https://thecsruniverse.com/assets/images/casca_hero.jpg","images":["https://via.placeholder.com/400x400?text=CASCA+1","https://via.placeholder.com/400x400?text=CASCA+2"]},{"type":"form","fields":[{"id":"phone_number","label":"Enter Your Phone Number","type":"tel","required":true}]},{"type":"form","fields":[{"id":"organization_name","label":"Organisation / Company Name","type":"text","required":true}]},{"type":"form","fields":[{"id":"selected_package","label":"Select a Partnership Package","type":"package_select","required":true}],"packages":[{"id":"p1","name":"1 Month Coverage","price":"₹15,000 + GST","features":["2 News","1 Interview","Social Media Promotion"]},{"id":"p2","name":"4 Month Coverage","price":"₹40,000 + GST","features":["4 News","1 Video Interview","Opinion Piece","Delegate Pass"]},{"id":"p3","name":"Event Media Partnership","price":"₹50,000 + GST","features":["Pre/During/Post Event Coverage","Editorial Support"]}]},{"type":"form","fields":[{"id":"custom_query","label":"Exploring Customized Partnership?","type":"textarea","required":false}]},{"type":"review","title":"Review Your Details"},{"type":"success","title":"Application Received"}]}',
        'published',
        1,
        '2026-05-16 16:25:42',
        NULL
    ),
    (
        9,
        '{"steps":[{"type":"hero","title":"Partner With Us","description":"Amplify Your Social Impact Through India’s Leading CSR & Sustainability Media Ecosystem"},{"type":"form","fields":[{"id":"email","label":"Enter Your Email Address","type":"email","required":true}]},{"type":"form","fields":[{"id":"full_name","label":"What’s Your Full Name?","type":"text","required":true}]},{"type":"event","id":"sica25","tag":"Past Event Spotlight","title":"SICA’25","subtitle":"5th Social Impact Conference & Awards 2025","description":"A flagship national conference bringing together CSR leaders and NGOs to drive social transformation across India.","image":"http://localhost:5000/uploads/1778948570817-SICA''25-Web-banner-11.png","images":["http://localhost:5000/uploads/1778948628649-SICA25-Web-banner-Jury-11.png","http://localhost:5000/uploads/1778948632349-SICA25-Web-banner-Jury-11.png","http://localhost:5000/uploads/1778948636119-SICA25-Web-banner-Jury-11.png"]},{"type":"form","fields":[{"id":"designation","label":"What’s Your Designation?","type":"text","required":true}]},{"type":"event","id":"casca26","tag":"Upcoming Spotlight","title":"CASCA’26","subtitle":"Climate Action & Sustainability Conference & Awards 2026","description":"Connecting environmental leaders to drive conversations around climate action and sustainable growth.","image":"http://localhost:5000/uploads/1778948839635-casca_26.jpg","images":["http://localhost:5000/uploads/1778948846999-casb_2.jpg","http://localhost:5000/uploads/1778948854435-casb_2.jpg"]},{"type":"form","fields":[{"id":"phone_number","label":"Enter Your Phone Number","type":"tel","required":true}]},{"type":"form","fields":[{"id":"organization_name","label":"Organisation / Company Name","type":"text","required":true}]},{"type":"form","fields":[{"id":"selected_package","label":"Select a Partnership Package","type":"package_select","required":true}],"packages":[{"id":"p1","name":"1 Month Coverage","price":"₹15,000 + GST","features":["2 News","1 Interview","Social Media Promotion"]},{"id":"p2","name":"4 Month Coverage","price":"₹40,000 + GST","features":["4 News","1 Video Interview","Opinion Piece","Delegate Pass"]},{"id":"p3","name":"Event Media Partnership","price":"₹50,000 + GST","features":["Pre/During/Post Event Coverage","Editorial Support"]}]},{"type":"form","fields":[{"id":"custom_query","label":"Exploring Customized Partnership?","type":"textarea","required":false}]},{"type":"review","title":"Review Your Details"},{"type":"success","title":"Application Received"}]}',
        'published',
        1,
        '2026-05-16 16:27:40',
        NULL
    );

-- Table structure for form_submissions_v2
DROP TABLE IF EXISTS `form_submissions_v2`;

CREATE TABLE `form_submissions_v2` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `submission_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`submission_data`)),
    `form_version` int(11) NOT NULL,
    `is_read` tinyint(1) DEFAULT 0,
    `status` enum(
        'pending',
        'contacted',
        'completed'
    ) DEFAULT 'pending',
    `device_info` text DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- Data for form_submissions_v2
INSERT INTO
    `form_submissions_v2` (
        `id`,
        `submission_data`,
        `form_version`,
        `is_read`,
        `status`,
        `device_info`,
        `created_at`
    )
VALUES (
        1,
        '{"email":"akthakur8080@gmail.com","full_name":"Akash","designation":"kash","phone_number":"7018619880","organization_name":"ak","selected_package":"1_month_coverage","custom_query":"Akash\\nok"}',
        1,
        1,
        'pending',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 | Google Inc.',
        '2026-05-16 14:27:40'
    );

-- Table structure for notifications
DROP TABLE IF EXISTS `notifications`;

CREATE TABLE `notifications` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `message` text NOT NULL,
    `is_seen` tinyint(1) DEFAULT 0,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- Data for notifications
INSERT INTO
    `notifications` (
        `id`,
        `message`,
        `is_seen`,
        `created_at`
    )
VALUES (
        1,
        'New partnership request from ak',
        0,
        '2026-05-16 14:27:40'
    );

-- Table structure for admin_logs
DROP TABLE IF EXISTS `admin_logs`;

CREATE TABLE `admin_logs` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `admin_id` int(11) DEFAULT NULL,
    `action` text NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`),
    KEY `admin_id` (`admin_id`),
    CONSTRAINT `admin_logs_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

SET FOREIGN_KEY_CHECKS = 1;