-- Create Admin table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Form Configuration table (Drafts and Published)
CREATE TABLE IF NOT EXISTS form_configs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    config_json LONGTEXT NOT NULL,
    status ENUM('draft', 'published') DEFAULT 'draft',
    version INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP NULL
);

-- Updated Submissions table for dynamic data
CREATE TABLE IF NOT EXISTS form_submissions_v2 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    submission_data JSON NOT NULL,
    form_version INT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    status ENUM('pending', 'contacted', 'completed') DEFAULT 'pending',
    device_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message TEXT NOT NULL,
    is_seen BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Logs
CREATE TABLE IF NOT EXISTS admin_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT,
    action TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id)
);

-- Insert a default admin (Username: admin, Password: admin123)
INSERT IGNORE INTO admins (username, password, email) VALUES ('admin', '$2b$10$/gvsaspTovHjCJ3hG6b8MuRnfw57qm49VhFDydwr8IouKTpUCPEQu', 'admin@thecsruniverse.com');

-- Insert initial default form config
INSERT INTO form_configs (config_json, status, version) VALUES ('{
  "steps": [
    {"type": "hero", "title": "Partner With Us", "description": "Amplify Your Social Impact Through India\'s Leading CSR & Sustainability Media Ecosystem"},
    {"type": "form", "fields": [{"id": "email", "label": "Enter Your Email", "type": "email", "required": true}]},
    {"type": "form", "fields": [{"id": "full_name", "label": "What\'s Your Full Name?", "type": "text", "required": true}]},
    {"type": "event", "id": "sica25", "title": "SICA’25", "tag": "Past Event Spotlight"},
    {"type": "form", "fields": [{"id": "designation", "label": "What\'s Your Designation?", "type": "text", "required": true}]},
    {"type": "form", "fields": [{"id": "phone_number", "label": "Enter Your Phone Number", "type": "tel", "required": true}]},
    {"type": "form", "fields": [{"id": "organization_name", "label": "Organisation / Company Name", "type": "text", "required": true}]},
    {"type": "event", "id": "casca26", "title": "CASCA’26", "tag": "Past Event Spotlight"},
    {"type": "form", "fields": [{"id": "selected_package", "label": "Select a Partnership Package", "type": "package_select", "required": true}]},
    {"type": "form", "fields": [{"id": "custom_query", "label": "Exploring Customized Partnership?", "type": "textarea", "required": false}]},
    {"type": "review", "title": "Review Your Details"},
    {"type": "success", "title": "Let\'s Build Meaningful Impact Together"}
  ]
}', 'published', 1);
