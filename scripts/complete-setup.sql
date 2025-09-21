-- Car Rental SaaS Complete Database Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'staff', 'user')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff table
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  employee_id VARCHAR(50) UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  position VARCHAR(100),
  department VARCHAR(100),
  hire_date DATE,
  hourly_rate DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  documents JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  vin VARCHAR(17) UNIQUE,
  license_plate VARCHAR(20) UNIQUE,
  color VARCHAR(30),
  mileage INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'rented', 'maintenance', 'retired')),
  daily_rate DECIMAL(10,2),
  images JSONB DEFAULT '[]',
  features JSONB DEFAULT '[]',
  location VARCHAR(255),
  last_service_date DATE,
  next_service_due DATE,
  insurance_expiry DATE,
  registration_expiry DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  license_number VARCHAR(50),
  license_expiry DATE,
  address JSONB,
  emergency_contact JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trips table
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  vehicle_id UUID REFERENCES vehicles(id),
  guest_name VARCHAR(255) NOT NULL,
  guest_email VARCHAR(255),
  guest_phone VARCHAR(20),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  pickup_location VARCHAR(255),
  dropoff_location VARCHAR(255),
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial', 'refunded')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expense categories table
CREATE TABLE IF NOT EXISTS expense_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  recipient VARCHAR(255) NOT NULL,
  category_id UUID REFERENCES expense_categories(id),
  category_name VARCHAR(100),
  vehicle_id UUID REFERENCES vehicles(id),
  trip_id UUID REFERENCES trips(id),
  payment_method VARCHAR(50),
  receipt_url VARCHAR(500),
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Earnings table
CREATE TABLE IF NOT EXISTS earnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  source VARCHAR(255) NOT NULL,
  trip_id UUID REFERENCES trips(id),
  vehicle_id UUID REFERENCES vehicles(id),
  description TEXT,
  payment_method VARCHAR(50),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) DEFAULT 'general' CHECK (type IN ('cleaning', 'maintenance', 'inspection', 'delivery', 'pickup', 'general')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  assigned_to UUID REFERENCES staff(id),
  vehicle_id UUID REFERENCES vehicles(id),
  trip_id UUID REFERENCES trips(id),
  reservation_id VARCHAR(50),
  guest_name VARCHAR(255),
  location VARCHAR(255),
  trip_start_date TIMESTAMP WITH TIME ZONE,
  trip_end_date TIMESTAMP WITH TIME ZONE,
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  estimated_duration INTEGER,
  actual_duration INTEGER,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Import logs table
CREATE TABLE IF NOT EXISTS import_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename VARCHAR(255) NOT NULL,
  import_type VARCHAR(50) NOT NULL,
  total_records INTEGER NOT NULL,
  successful_records INTEGER NOT NULL,
  failed_records INTEGER NOT NULL,
  errors JSONB DEFAULT '[]',
  imported_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email parsing tables
CREATE TABLE IF NOT EXISTS email_parsing_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  from_pattern VARCHAR(500) NOT NULL,
  subject_pattern VARCHAR(500) NOT NULL,
  body_patterns JSONB DEFAULT '[]',
  target_table VARCHAR(100) NOT NULL,
  field_mappings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  success_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  last_triggered TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_processing_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_email VARCHAR(255) NOT NULL,
  to_email VARCHAR(255),
  subject TEXT NOT NULL,
  body_preview TEXT,
  rule_id UUID REFERENCES email_parsing_rules(id),
  target_table VARCHAR(100),
  extracted_data JSONB,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'skipped')),
  error_message TEXT,
  processing_time_ms INTEGER,
  created_record_id UUID,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default data
INSERT INTO expense_categories (name, description) VALUES
  ('Fuel', 'Vehicle fuel and gas expenses'),
  ('Maintenance', 'Vehicle maintenance and repairs'),
  ('Insurance', 'Vehicle and business insurance'),
  ('Cleaning', 'Vehicle cleaning and detailing'),
  ('Marketing', 'Advertising and promotional expenses'),
  ('Office', 'Office supplies and equipment'),
  ('Utilities', 'Electricity, internet, phone bills'),
  ('Professional Services', 'Legal, accounting, consulting fees'),
  ('Travel', 'Business travel expenses'),
  ('Other', 'Miscellaneous expenses')
ON CONFLICT (name) DO NOTHING;

INSERT INTO users (email, full_name, role) VALUES
  ('admin@example.com', 'Admin User', 'admin'),
  ('manager@example.com', 'Manager User', 'manager')
ON CONFLICT (email) DO NOTHING;

-- Sample data for testing
INSERT INTO vehicles (make, model, year, license_plate, vin, status, daily_rate, location) VALUES
  ('Toyota', 'Camry', 2023, 'ABC123', '1HGBH41JXMN109186', 'available', 89.99, 'Downtown Location'),
  ('Honda', 'Accord', 2022, 'XYZ789', '2HGBH41JXMN109187', 'available', 79.99, 'Airport Location'),
  ('Tesla', 'Model 3', 2023, 'EV2023', '5YJ3E1EA1PF123456', 'available', 129.99, 'City Center')
ON CONFLICT (license_plate) DO NOTHING;

INSERT INTO customers (first_name, last_name, email, phone) VALUES
  ('John', 'Smith', 'john.smith@email.com', '+1-555-123-4567'),
  ('Sarah', 'Johnson', 'sarah.j@email.com', '+1-555-234-5678'),
  ('Michael', 'Brown', 'michael.b@email.com', '+1-555-345-6789')
ON CONFLICT (email) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_trips_dates ON trips(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_earnings_date ON earnings(date);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

SELECT 'Database setup complete! 🎉' as message;
