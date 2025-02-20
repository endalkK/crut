-- 03_sample_queries.sql
-- CRUT: Campus Resource Utilization Tracker
-- Sample queries for spatial search, occupancy summary, and scheduling conflict detection

-- Sample Spatial Query: Find buildings within a specified radius (meters)
-- Replace :lon, :lat, and :radius with actual values.
SELECT building_id, building_name,
       ST_Distance(geom, ST_SetSRID(ST_Point(:lon, :lat), 4326)) AS distance
FROM Buildings
WHERE ST_DWithin(geom, ST_SetSRID(ST_Point(:lon, :lat), 4326), :radius);

-- Create or replace a view summarizing room occupancy and booking metrics
CREATE OR REPLACE VIEW RoomOccupancySummary AS
SELECT r.room_id, r.room_number, bld.building_name,
       COUNT(b.booking_id) AS booking_count,
       COALESCE(AVG(EXTRACT(EPOCH FROM (b.end_time - b.start_time)) / 3600), 0) AS avg_booking_duration
FROM Rooms r
JOIN Buildings bld ON r.building_id = bld.building_id
LEFT JOIN Bookings b ON r.room_id = b.room_id
GROUP BY r.room_id, r.room_number, bld.building_name;

-- Query to detect overlapping bookings (scheduling conflicts)
SELECT b1.booking_id AS booking1, b2.booking_id AS booking2, b1.room_id
FROM Bookings b1
JOIN Bookings b2 
  ON b1.room_id = b2.room_id
  AND b1.booking_id <> b2.booking_id
  AND b1.start_time < b2.end_time
  AND b2.start_time < b1.end_time;
