-- creation of table organization
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- inserting sample data 
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);


CREATE TABLE service_projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,
    
    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);


INSERT INTO service_projects 
(organization_id, title, description, location, project_date)
VALUES

-- 🔴 Red Cross (organization_id = 1)
(1, 'Blood Donation Drive', 'Organizing a community blood donation event.', 'New York', '2026-04-05'),
(1, 'Disaster Relief Training', 'Training volunteers for emergency response.', 'Brooklyn', '2026-04-12'),
(1, 'First Aid Workshop', 'Teaching basic first aid skills to the public.', 'Queens', '2026-04-20'),
(1, 'Hurricane Preparedness Campaign', 'Educating families on disaster preparedness.', 'Long Island', '2026-05-01'),
(1, 'Community Health Check', 'Providing free health screenings.', 'Bronx', '2026-05-10'),

-- 🏠 Habitat for Humanity (organization_id = 2)
(2, 'Home Building Project', 'Volunteers building homes for families in need.', 'Newark', '2026-04-08'),
(2, 'Neighborhood Revitalization', 'Improving local housing conditions.', 'Jersey City', '2026-04-15'),
(2, 'Home Repair Program', 'Fixing roofs and structures for elderly residents.', 'Paterson', '2026-04-22'),
(2, 'Community Clean-Up', 'Cleaning and restoring neighborhoods.', 'Elizabeth', '2026-05-03'),
(2, 'Volunteer Construction Training', 'Training volunteers in basic construction skills.', 'Trenton', '2026-05-12'),

-- 🍎 Food Bank (organization_id = 3)
(3, 'Food Distribution Day', 'Distributing food packages to families.', 'Manhattan', '2026-04-06'),
(3, 'Meal Packing Event', 'Packing meals for homeless shelters.', 'Brooklyn', '2026-04-14'),
(3, 'Community Kitchen Service', 'Preparing meals for those in need.', 'Queens', '2026-04-21'),
(3, 'Holiday Food Drive', 'Collecting food donations for holidays.', 'Bronx', '2026-05-05'),
(3, 'Mobile Pantry Outreach', 'Delivering food to underserved areas.', 'Staten Island', '2026-05-15');


CREATE TABLE project_categories (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    PRIMARY KEY (project_id, category_id),

    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES service_projects(project_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);


INSERT INTO categories (name) VALUES
('Health'),
('Education'),
('Community'),
('Environment'),
('Disaster Relief');


INSERT INTO project_categories (project_id, category_id) VALUES
-- Project 1
(1, 1),
(1, 5),

-- Project 2
(2, 1),

-- Project 3
(3, 1),
(3, 2),

-- Project 4
(4, 5),

-- Project 5
(5, 1),

-- Project 6
(6, 3),

-- Project 7
(7, 3),

-- Project 8
(8, 3),

-- Project 9
(9, 3),

-- Project 10
(10, 2),

-- Project 11
(11, 3),

-- Project 12
(12, 3),

-- Project 13
(13, 3),

-- Project 14
(14, 3),

-- Project 15
(15, 3);


CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

INSERT INTO roles (role_name, role_description) VALUES 
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');

-- Verify the data was inserted
SELECT * FROM roles;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_volunteers (
    user_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, project_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES service_projects(project_id) ON DELETE CASCADE
);