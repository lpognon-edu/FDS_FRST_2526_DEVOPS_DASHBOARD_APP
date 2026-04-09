-- DevOps Dashboard - Database Schema
-- PostgreSQL schema for incidents management

-- Drop table if it exists (for development/testing)
DROP TABLE IF EXISTS incidents CASCADE;

-- Create incidents table
CREATE TABLE incidents (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('Low', 'Medium', 'High')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on created_at for faster sorting
CREATE INDEX idx_incidents_created_at ON incidents(created_at DESC);

-- Create index on severity for filtering
CREATE INDEX idx_incidents_severity ON incidents(severity);

-- Sample data for testing
INSERT INTO incidents (title, description, severity) VALUES
  ('Database Connection Timeout', 'Production database showing connection timeouts during peak hours. Requires investigation and optimization.', 'High'),
  ('Memory Leak in API Service', 'Memory usage continuously increasing in the API service. Needs code review and profiling.', 'High'),
  ('SSL Certificate Expiry', 'SSL certificate for staging environment expires in 2 weeks. Schedule renewal plan.', 'Medium'),
  ('Slow Query Performance', 'Several database queries taking longer than 5 seconds. Need indexing strategy.', 'Medium'),
  ('Documentation Outdated', 'API documentation needs update after latest changes.', 'Low');
