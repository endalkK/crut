# CRUT - Campus Resource Utilization Tracker

## Overview

CRUT is a comprehensive system designed to monitor and optimize the usage of campus facilities—such as classrooms, labs, and lecture halls. By leveraging PostgreSQL with the PostGIS extension, CRUT uses advanced SQL queries, stored procedures, and functions to forecast room occupancy and schedule proactive maintenance. An interactive web-based dashboard provides real-time insights into occupancy trends, scheduling conflicts, and geospatial visualization of facilities.

## Features

- **Database Schema:**  
  Well-structured tables for Facilities, Rooms, Bookings, and Maintenance with enforced constraints.
- **Spatial Queries:**  
  Utilize PostGIS for location-based queries to identify nearby facilities.
- **Occupancy Forecasting:**  
  Functions to compute room occupancy over a rolling 30-day period.
- **Automated Maintenance Scheduling:**  
  Stored procedures to schedule maintenance when usage exceeds specified thresholds.
- **Interactive Dashboard:**  
  A web interface using Chart.js and Leaflet to display occupancy charts and facility maps.
- **Performance Optimizations:**  
  Indexed spatial data and time-based queries for efficient operations.

## Repository Structure
