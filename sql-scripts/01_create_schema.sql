-- 01_create_schema.sql
-- CRUT: Campus Resource Utilization Tracker
-- Schema creation script for CRUT

-- Enable PostGIS extension for spatial data support
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create Facilities table with spatial data
CREATE TABLE Facilities (
    facility_id SERIAL PRIMARY KEY,
    facility_name VARCHAR(100) NOT NULL,
    building VARCHAR(100),
    geom GEOMETRY(Point, 4326)  -- Stores latitude/longitude coordinates
);

-- Create Rooms table with proper constraints
CREATE TABLE Rooms (
    room_id SERIAL PRIMARY KEY,
    facility_id INT REFERENCES Facilities(facility_id) ON DELETE CASCADE,
    room_number VARCHAR(10) NOT NULL,
    capacity INT CHECK (capacity > 0),
    room_type VARCHAR(50)  -- e.g., Classroom, Lab, Lecture Hall
);

-- Create Bookings table with a check to ensure valid time ranges
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
