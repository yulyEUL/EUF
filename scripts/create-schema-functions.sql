-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS get_table_names();
DROP FUNCTION IF EXISTS get_table_columns(text);
DROP FUNCTION IF EXISTS get_table_info();

-- Function to get all table names in the public schema
CREATE OR REPLACE FUNCTION get_table_names()
RETURNS TABLE(table_name text) AS $$
BEGIN
    RETURN QUERY
    SELECT t.table_name::text
    FROM information_schema.tables t
    WHERE t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
    ORDER BY t.table_name;
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
        c.character_maximum_length::integer
    FROM information_schema.columns c
    WHERE c.table_schema = 'public'
    AND c.table_name = $1
    ORDER BY c.ordinal_position;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all tables with their columns in one query
CREATE OR REPLACE FUNCTION get_table_info()
RETURNS TABLE(
    table_name text,
    column_name text,
    data_type text,
    is_nullable text,
    column_default text,
    character_maximum_length integer,
    ordinal_position integer
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.table_name::text,
        c.column_name::text,
        c.data_type::text,
        c.is_nullable::text,
        c.column_default::text,
        c.character_maximum_length::integer,
        c.ordinal_position::integer
    FROM information_schema.tables t
    LEFT JOIN information_schema.columns c ON t.table_name = c.table_name
    WHERE t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
    AND c.table_schema = 'public'
    ORDER BY t.table_name, c.ordinal_position;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_table_names() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_table_columns(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_table_info() TO anon, authenticated;

-- Test the functions
SELECT 'Testing get_table_names...' as test;
SELECT * FROM get_table_names();

SELECT 'Testing get_table_info...' as test;
SELECT table_name, COUNT(column_name) as column_count 
FROM get_table_info() 
GROUP BY table_name 
ORDER BY table_name;

SELECT 'Schema functions created successfully!' as message;
