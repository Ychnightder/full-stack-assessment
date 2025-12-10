-- Create the database
-- CREATE DATABASE bridge_db ;

-- Connect to the new database
\c bridge_db;

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create the bridges table
CREATE TABLE IF NOT EXISTS bridges (
    bridge_id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    location GEOMETRY(Point, 4326)
);

-- Create the bridge_manager user
CREATE USER bridge_manager WITH PASSWORD 'g0lden_gat3';

-- Grant privileges to bridge_manager
GRANT ALL PRIVILEGES ON DATABASE bridge_db TO bridge_manager;
GRANT ALL PRIVILEGES ON SCHEMA public TO bridge_manager;
GRANT ALL PRIVILEGES ON TABLE bridges TO bridge_manager;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO bridge_manager;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO bridge_manager;
