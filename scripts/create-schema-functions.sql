-- Create functions to get database schema information
-- Run this in your Supabase SQL Editor

-- Function to get all table names
CREATE OR REPLACE FUNCTION get_table_names()
RETURNS text[] AS $$
DECLARE
    table_names text[];
BEGIN
    SELECT array_agg(tablename)
    INTO table_names
    FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename NOT LIKE 'pg_%'
    AND tablename != 'schema_migrations';
    
    RETURN COALESCE(table_names, ARRAY[]::text[]);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get columns for a specific table
CREATE OR REPLACE FUNCTION get_table_columns(table_name text)
RETURNS TABLE(
    column_name text,
    data_type text,
    is_nullable text,
    column_default text,
    character_maximum_length integer
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.column_name::text,
        c.data_type::text,
        c.is_nullable::text,
        c.column_default::text,
        c.character_maximum_length
    FROM information_schema.columns c
    WHERE c.table_schema = 'public'
    AND c.table_name = $1
    ORDER BY c.ordinal_position;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_table_names() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_table_columns(text) TO anon, authenticated, service_role;

-- Test the functions
SELECT get_table_names();
