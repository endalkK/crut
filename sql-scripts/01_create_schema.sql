-- Schema creation script for CRUT

-- Enable PostGIS extension for spatial data support
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create Buildings table with spatial data
CREATE TABLE Buildings (
    building_id SERIAL PRIMARY KEY,
    building_name VARCHAR(100) NOT NULL,
    geom GEOMETRY(Point, 4326)  -- Stores latitude/longitude coordinates for building location
);

-- Create Rooms table referencing Buildings
CREATE TABLE Rooms (
    room_id SERIAL PRIMARY KEY,
    building_id INT REFERENCES Buildings(building_id) ON DELETE CASCADE,
    room_number VARCHAR(10) NOT NULL,
    capacity INT CHECK (capacity > 0),
    room_type VARCHAR(50)  -- e.g., Classroom, Lab, Lecture Hall
);

-- Create Bookings table with time validity check
CREATE TABLE Bookings (
    booking_id SERIAL PRIMARY KEY,
    room_id INT REFERENCES Rooms(room_id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    event_name VARCHAR(200) NOT NULL,
    CHECK (end_time > start_time)
);

-- Create Maintenance table with constrained status values
CREATE TABLE Maintenance (
    maintenance_id SERIAL PRIMARY KEY,
    room_id INT REFERENCES Rooms(room_id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    maintenance_type VARCHAR(50),  -- e.g., Routine Check, Deep Cleaning
    status VARCHAR(50) CHECK (status IN ('Scheduled', 'Completed', 'Postponed'))
);
-- Maintanance 
ALTER TABLE Maintenance 
ADD COLUMN actual_completion_date DATE,
ADD COLUMN cost NUMERIC(10, 2),
ADD COLUMN is_failure BOOLEAN DEFAULT FALSE; -- TRUE if the room actually broke down

-- Track if a maintenance event was a "Failure" (unplanned)
ALTER TABLE Maintenance ADD COLUMN is_failure BOOLEAN DEFAULT FALSE;
ALTER TABLE Maintenance ADD COLUMN resolution_notes TEXT;

-- Index for the Line Chart queries
CREATE INDEX idx_maintenance_failure ON Maintenance (is_failure) WHERE is_failure = TRUE;