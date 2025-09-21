-- Create functions to get database schema information
-- Run this AFTER creating the main schema

-- Function to get all table names
CREATE OR REPLACE FUNCTION get_table_names()
RETURNS TEXT[] AS $$
DECLARE
    table_names TEXT[];
BEGIN
    SELECT array_agg(tablename::TEXT)
    INTO table_names
    FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename NOT LIKE 'pg_%'
    AND tablename != 'schema_migrations';
    
    RETURN COALESCE(table_names, ARRAY[]::TEXT[]);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get columns for a specific table
CREATE OR REPLACE FUNCTION get_table_columns(table_name TEXT)
RETURNS TABLE(
    column_name TEXT,
    data_type TEXT,
    is_nullable TEXT,
    column_default TEXT,
    character_maximum_length INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.column_name::TEXT,
        c.data_type::TEXT,
        c.is_nullable::TEXT,
        c.column_default::TEXT,
        c.character_maximum_length
    FROM information_schema.columns c
    WHERE c.table_schema = 'public'
    AND c.table_name = $1
    ORDER BY c.ordinal_position;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to all roles
GRANT EXECUTE ON FUNCTION get_table_names() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_table_columns(TEXT) TO anon, authenticated, service_role;

-- Test the functions
SELECT 'Schema functions created successfully!' as status;
SELECT get_table_names() as available_tables;
