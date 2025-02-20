-- 04_create_indexes.sql
-- CRUT: Campus Resource Utilization Tracker
-- Index creation script for performance optimization

-- Create a spatial index on the geom column in Buildings
CREATE INDEX idx_buildings_geom ON Buildings USING GIST (geom);

-- Index on Bookings start_time for efficient time-based queries
CREATE INDEX idx_bookings_start_time ON Bookings (start_time);

-- Index on Maintenance scheduled_date for quick scheduling lookups
CREATE INDEX idx_maintenance_scheduled_date ON Maintenance (scheduled_date);
