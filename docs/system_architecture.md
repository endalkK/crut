# CRUT System Architecture

## Overview

CRUT (Campus Resource Utilization Tracker) is designed to monitor and optimize the use of campus facilities such as classrooms, labs, and lecture halls. The system leverages PostgreSQL with the PostGIS extension for spatial data management, advanced SQL queries, and PL/pgSQL functions/procedures to forecast occupancy and schedule proactive maintenance. An interactive web-based dashboard provides real-time insights into usage trends and potential scheduling conflicts.

## Components

- **Database Layer:**  
  PostgreSQL with PostGIS stores facility, room, booking, and maintenance data with geospatial capabilities.

- **Business Logic Layer:**  
  PL/pgSQL functions and stored procedures process occupancy forecasting and automate maintenance scheduling.

- **Dashboard Layer:**  
  A front-end interface built with HTML/CSS/JavaScript (Chart.js and Leaflet) visualizes occupancy data and spatial facility information.

## Data Flow Diagram
