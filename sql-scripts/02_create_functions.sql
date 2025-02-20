-- 02_create_functions.sql
-- CRUT: Campus Resource Utilization Tracker
-- Functions and stored procedures for occupancy forecasting and maintenance scheduling

-- Function to forecast room occupancy over the past 30 days
CREATE OR REPLACE FUNCTION forecast_room_occupancy(p_room_id INT) 
RETURNS NUMERIC AS $$
DECLARE
    total_hours NUMERIC := 30 * 24;  -- Total hours in 30 days
    occupied_hours NUMERIC;
    occupancy_rate NUMERIC;
BEGIN
    SELECT COALESCE(SUM(EXTRACT(EPOCH FROM (end_time - start_time)) / 3600), 0)
    INTO occupied_hours
    FROM Bookings
    WHERE room_id = p_room_id 
      AND start_time >= NOW() - INTERVAL '30 days';
    
    occupancy_rate := occupied_hours / total_hours;
    RETURN occupancy_rate;
END;
$$ LANGUAGE plpgsql;

-- Procedure to schedule maintenance for rooms with high usage (>80% occupancy)
CREATE OR REPLACE PROCEDURE schedule_maintenance_for_high_usage_rooms() 
LANGUAGE plpgsql AS $$
DECLARE
    rec RECORD;
    occ_rate NUMERIC;
BEGIN
    FOR rec IN SELECT room_id FROM Rooms LOOP
        occ_rate := forecast_room_occupancy(rec.room_id);
        IF occ_rate > 0.8 THEN
            -- If no maintenance is scheduled in the next 7 days, add a new record
            IF NOT EXISTS (
                SELECT 1 FROM Maintenance 
                WHERE room_id = rec.room_id 
                  AND scheduled_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
            ) THEN
                INSERT INTO Maintenance (room_id, scheduled_date, maintenance_type, status)
                VALUES (rec.room_id, CURRENT_DATE + INTERVAL '7 days', 'Routine Check', 'Scheduled');
            END IF;
        END IF;
    END LOOP;
END;
$$;
