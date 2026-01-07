# CRUT: Campus Resource Utilization Tracker

Project Walkthrough
[CRUT Demo Video](https://youtu.be/s4swhaX5oKI)

**CRUT** is a spatial-database PoC designed to optimize campus facility management. By integrating live geospatial data with automated maintenance logic, it transforms passive building directories into active resource trackers.

## Tech Stack & APIs

- Overpass API (OpenStreetMap): Dynamic fetching of global campus building footprints and metadata.

- PostGIS (PostgreSQL): Spatial indexing and proximity-based resource querying.

- Leaflet.js: Interactive mapping and coordinate-based UI rendering.

- Chart.js: Data visualization for occupancy trends and room-type distribution.

- html2canvas / jsPDF: Client-side reporting and automated PDF generation.

## Key Features

- Global Search: Instantiate a dashboard for any university worldwide via the Overpass bridge.

- Failure Logic: Map markers dynamically turn Red when a building's internal failure rate exceeds threshold levels.

- Predictive Maintenance: SQL triggers automatically flag high-usage rooms (>80% occupancy) for routine checks.

- 3D Trend Visualization: Stacked area charts provide a "depth" view of failure incidents over time.

- Exportable Audits: Generate one-click maintenance reports for administrative review.

## Proof of Concept (PoC) Constraints

- This project serves as a technical demonstration. A production-ready implementation would require:

- Restricted Scope: Removal of global search bars; instances would be locked to a single institution's domain.

- RBAC (Role-Based Access Control): Distinct interfaces for Students (booking/viewing) vs. Faculty/Officials (maintenance logs/analytics).

- Institutional Security: Authentication via School Email (SSO/OAuth2) to ensure data privacy and accountability.

- IT Ticketing Integration: CRUT can interface with platforms like ServiceNow or Jira to automatically generate work orders from the maintenance dashboard, creating a direct link between automated failure detection and technical response.
