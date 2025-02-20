// main.js for CRUT Dashboard

// --- Occupancy Histogram (Bar Chart) ---
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

// --- Initialize Map Centered on SUNY Plattsburgh ---
const map = L.map('map').setView([44.69, -73.46], 15); // Updated coordinates for SUNY Plattsburgh
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Example marker for a building at SUNY Plattsburgh (update with real data as needed)
L.marker([44.69, -73.46]).addTo(map)
    .bindPopup('CRUT Example Building - SUNY Plattsburgh')
    .openPopup();

// --- Additional Data Visualization: Room Type Distribution (Pie Chart) ---
const roomTypeCtx = document.getElementById('roomTypeChart').getContext('2d');
const roomTypeChart = new Chart(roomTypeCtx, {
    type: 'pie',
    data: {
        labels: ['Classroom', 'Lab', 'Lecture Hall', 'Seminar Room'],
        datasets: [{
            label: 'Room Types',
            data: [40, 25, 20, 15], // Dummy data: percentage distribution
            backgroundColor: [
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 99, 132, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)'
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true
    }
});

// --- Additional Data Visualization: Occupancy Trend (Line Chart) ---
const occupancyTrendCtx = document.getElementById('occupancyTrendChart').getContext('2d');
const occupancyTrendChart = new Chart(occupancyTrendCtx, {
    type: 'line',
    data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], // Dummy timeline labels
        datasets: [{
            label: 'Average Occupancy Rate',
            data: [0.65, 0.70, 0.80, 0.75], // Dummy trend data
            fill: false,
            borderColor: 'rgba(153, 102, 255, 1)',
            tension: 0.1
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
