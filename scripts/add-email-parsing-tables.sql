-- Add email parsing related tables to existing schema

-- Email parsing rules table
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

-- Email processing log table (more detailed than import_logs)
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

-- Insert default parsing rules
INSERT INTO email_parsing_rules (name, from_pattern, subject_pattern, body_patterns, target_table, field_mappings) VALUES
(
  'Turo Booking Confirmations',
  '*@turo.com',
  'Trip confirmed*',
  '["Trip ID:", "Guest:", "Vehicle:", "Start:", "End:", "Total:"]',
  'trips',
  '{
    "tripId": "trip\\s*(?:id|#):\\s*([A-Z0-9-]+)",
    "guest": "guest:\\s*([^\\n\\r]+)",
    "vehicle": "vehicle:\\s*([^\\n\\r]+)",
    "startDate": "start:\\s*([^\\n\\r]+)",
    "endDate": "end:\\s*([^\\n\\r]+)",
    "total": "total:\\s*\\$?([0-9,]+\\.?[0-9]*)",
    "location": "(?:pickup|location):\\s*([^\\n\\r]+)"
  }'
),
(
  'Stripe Payment Notifications',
  '*@stripe.com',
  'Payment received*',
  '["Amount:", "Customer:", "Payment ID:"]',
  'earnings',
  '{
    "amount": "(?:amount|total):\\s*\\$?([0-9,]+\\.?[0-9]*)",
    "customer": "(?:customer|from):\\s*([^\\n\\r]+)",
    "paymentId": "(?:payment|transaction)\\s*(?:id|#):\\s*([A-Z0-9_-]+)",
    "date": "(?:date|on):\\s*([^\\n\\r]+)"
  }'
),
(
  'Maintenance Service Notifications',
  '*@*service*.com',
  'Service completed*',
  '["Vehicle:", "Service:", "Cost:", "Mileage:"]',
  'maintenance_records',
  '{
    "vehicle": "vehicle:\\s*([^\\n\\r]+)",
    "serviceType": "(?:service|type):\\s*([^\\n\\r]+)",
    "cost": "(?:cost|total|amount):\\s*\\$?([0-9,]+\\.?[0-9]*)",
    "mileage": "(?:mileage|miles):\\s*([0-9,]+)",
    "date": "(?:date|on):\\s*([^\\n\\r]+)"
  }'
)
ON CONFLICT DO NOTHING;

-- Create indexes for email processing
CREATE INDEX IF NOT EXISTS idx_email_processing_log_status ON email_processing_log(status);
CREATE INDEX IF NOT EXISTS idx_email_processing_log_processed_at ON email_processing_log(processed_at);
CREATE INDEX IF NOT EXISTS idx_email_processing_log_from_email ON email_processing_log(from_email);
CREATE INDEX IF NOT EXISTS idx_email_parsing_rules_active ON email_parsing_rules(is_active);

-- Create trigger to update rule statistics
CREATE OR REPLACE FUNCTION update_parsing_rule_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'success' AND (OLD.status IS NULL OR OLD.status != 'success') THEN
    UPDATE email_parsing_rules 
    SET success_count = success_count + 1,
        last_triggered = NOW()
    WHERE id = NEW.rule_id;
  ELSIF NEW.status = 'failed' AND (OLD.status IS NULL OR OLD.status != 'failed') THEN
    UPDATE email_parsing_rules 
    SET error_count = error_count + 1,
        last_triggered = NOW()
    WHERE id = NEW.rule_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_parsing_rule_stats_trigger
  AFTER INSERT OR UPDATE ON email_processing_log
  FOR EACH ROW
  EXECUTE FUNCTION update_parsing_rule_stats();

-- Success message
SELECT 'Email parsing tables created successfully! 📧' as message;
