# CRUT - Campus Resource Utilization Tracker

## Overview

CRUT is a comprehensive system designed to monitor and optimize the usage of campus facilities—such as classrooms, labs, and lecture halls—at institutions like SUNY Plattsburgh. Leveraging PostgreSQL with PostGIS, CRUT uses advanced SQL queries, stored procedures, and functions to forecast room occupancy and schedule proactive maintenance. An interactive web-based dashboard now provides real-time insights through multiple data visualizations including:

- An occupancy histogram (bar chart)
- A room type distribution pie chart
- An occupancy trend line chart
- An interactive map centered on SUNY Plattsburgh

...

## Setup Instructions

### Database Setup

1. **Install PostgreSQL and enable PostGIS.**
2. **Execute the SQL scripts in order:**
   - `01_create_schema.sql`
   - `02_create_functions.sql`
   - `03_sample_queries.sql`
   - `04_create_indexes.sql`

### Dashboard Setup

1. Navigate to the `/dashboard` folder.
2. Open `index.html` in your web browser.
3. Explore the various charts and the map which now centers on SUNY Plattsburgh.

...

## Future Enhancements

- **Real-Time Data Integration:** Integrate IoT sensors for live occupancy tracking.
- **Predictive Analytics:** Utilize machine learning to forecast facility usage.
- **Mobile Application:** Develop a mobile app for real-time monitoring and booking.
- **User Authentication & Notifications:** Add secure logins and automated alerts for scheduling conflicts or maintenance.
- **Expanded Reporting:** Further enhance visualizations and reports with exportable formats.
