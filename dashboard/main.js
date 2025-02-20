// main.js for CRUT Dashboard

// Dummy data for the occupancy chart
const ctx = document.getElementById('occupancyChart').getContext('2d');
const occupancyChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Room 101', 'Room 102', 'Lab A', 'Lab B'],
        datasets: [{
            label: 'Occupancy Rate',
            data: [0.75, 0.60, 0.90, 0.50],
            backgroundColor: 'rgba(0, 77, 153, 0.5)',
            borderColor: 'rgba(0, 77, 153, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                max: 1
            }
        }
    }
});

// Initialize a Leaflet map for facility locations
const map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// (Optional) Add markers to the map using real facility data
L.marker([51.505, -0.09]).addTo(map)
    .bindPopup('CRUT Example Facility')
    .openPopup();
