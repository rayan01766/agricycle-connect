-- AgriCycle Connect Database Schema
-- PostgreSQL Migration Script

-- Drop tables if they exist (for fresh installation)
DROP TABLE IF EXISTS waste_listings CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('farmer', 'company', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Waste Listings table
CREATE TABLE waste_listings (
  id SERIAL PRIMARY KEY,
  farmer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(255) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  location VARCHAR(255) NOT NULL,
  image VARCHAR(500),
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_waste_farmer_id ON waste_listings(farmer_id);
CREATE INDEX idx_waste_status ON waste_listings(status);
CREATE INDEX idx_waste_type ON waste_listings(type);

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_waste_listings_updated_at
  BEFORE UPDATE ON waste_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional - for testing)
-- Admin user (password: admin123)
INSERT INTO users (email, password, name, role) VALUES
('admin@agricycle.com', '$2a$10$9XGQvK3V3xqP1yJ8K3V3x.1qJ8K3V3x9XGQvK3V3xqP1yJ8K3V3x.', 'Admin User', 'admin');

-- Sample farmer (password: farmer123)
INSERT INTO users (email, password, name, role) VALUES
('farmer@example.com', '$2a$10$9XGQvK3V3xqP1yJ8K3V3x.1qJ8K3V3x9XGQvK3V3xqP1yJ8K3V3x.', 'John Farmer', 'farmer');

-- Sample company (password: company123)
INSERT INTO users (email, password, name, role) VALUES
('company@example.com', '$2a$10$9XGQvK3V3xqP1yJ8K3V3x.1qJ8K3V3x9XGQvK3V3xqP1yJ8K3V3x.', 'Green Recycling Co', 'company');

-- Sample waste listings
INSERT INTO waste_listings (farmer_id, type, quantity, price, location, description, status) VALUES
(2, 'Corn Stalks', 500.00, 150.00, 'Iowa, USA', 'Fresh corn stalks from recent harvest', 'approved'),
(2, 'Rice Husks', 300.00, 100.00, 'California, USA', 'High quality rice husks suitable for composting', 'pending');

-- Display success message
SELECT 'Database schema created successfully!' as message;
