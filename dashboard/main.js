// --- Initialize Map immediately ---
const map = L.map('map').setView([44.69, -73.46], 15); 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Global variables
let occupancyChart, roomTypeChart, occupancyTrendChart;

function initCharts() {
    // 1. Bar Chart [Existing]
    const barCtx = document.getElementById('occupancyChart').getContext('2d');
    occupancyChart = new Chart(barCtx, {
        type: 'bar',
        data: { labels: [], datasets: [{ label: 'Occupancy Rate', data: [], backgroundColor: 'rgba(0, 77, 153, 0.5)' }] },
        options: { scales: { y: { beginAtZero: true, max: 1 } } }
    });

    // 2. Pie Chart [Existing]
    const pieCtx = document.getElementById('roomTypeChart').getContext('2d');
    roomTypeChart = new Chart(pieCtx, {
        type: 'pie',
        data: { labels: [], datasets: [{ data: [], backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#1f7e16ff'] }] }
    });

    // 3. FIX: Initializing the 3D Failure Trend Chart
    const lineCtx = document.getElementById('occupancyTrendChart').getContext('2d');
    occupancyTrendChart = new Chart(lineCtx, {
        type: 'line',
        data: { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], datasets: [] },
        options: {
            responsive: true,
            plugins: { title: { display: true, text: 'Building Failure Rates (3D Stacked View)' } },
            scales: {
                y: { stacked: true, beginAtZero: true, title: { display: true, text: 'Incidents' } },
                x: { stacked: true }
            }
        }
    });
}
initCharts();

function categorizeBuilding(el) {
    const type = (el.type || "").toLowerCase();
    const name = (el.name || "").toLowerCase();

    // 1. Maintenance & Facilities (New Category)
    if (name.includes('maintenance') || name.includes('warehouse') || name.includes('shop') || 
        type === 'garage' || type === 'parking') {
        return 'Maintenance & Facilities';
    }

    // 2. Residential (Dorms and Apartments)
    if (type === 'dormitory' || type === 'apartments' || type === 'residential' || 
        name.includes('hall') || name.includes('house')) {
        return 'Residential';
    }

    // 3. Medical (Stanford has many hospitals/clinics)
    if (type === 'hospital' || name.includes('medical') || name.includes('center') || 
        name.includes('clinic') || name.includes('cancer')) {
        return 'Medical/Health';
    }

    // 4. Academic (Labs, Schools, and Engineering)
    if (type === 'school' || type === 'university' || name.includes('lab') || 
        name.includes('engineering') || name.includes('library')) {
        return 'Academic';
    }

    // 5. Dining (Catching dining halls)
    if (name.includes('dining') || name.includes('cafe') || name.includes('kitchen')) {
        return 'Dining';
    }

    return 'Other/General';
}

// --- Function to update the Maintenance Summary Table ---
function updateMaintenanceTable(failedRooms) {
    const tableBody = document.getElementById('maintenance-table-body');
    tableBody.innerHTML = ''; // Clear existing rows

    if (failedRooms.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No critical failures reported.</td></tr>';
        return;
    }

    failedRooms.forEach(room => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${room.name}</strong></td>
            <td>${room.building}</td>
            <td style="color: #d9534f;">Critical Failure</td>
            <td><span class="status-badge">Urgent Repair</span></td>
        `;
        tableBody.appendChild(row);
    });
}

// --- NEW: 3D-Style Trend 
function updateTrendChart(buildingNames) {
    // pick the top 3 buildings to show in the 3D trend to keep it clean
    const topBuildings = buildingNames.slice(0, 3);
    const colors = [
        { border: '#FF6384', bg: 'rgba(255, 99, 132, 0.5)' },
        { border: '#36A2EB', bg: 'rgba(54, 162, 235, 0.5)' },
        { border: '#FFCE56', bg: 'rgba(255, 206, 86, 0.5)' }
    ];

    const newDatasets = topBuildings.map((name, i) => ({
        label: `${name} Failures`,
        data: Array.from({ length: 4 }, () => Math.floor(Math.random() * 5)), // Random 0-5 failures
        borderColor: colors[i].border,
        backgroundColor: colors[i].bg,
        fill: true, // This creates the "area" for the 3D look
        tension: 0.4, // Smooth curves
        pointRadius: 2
    }));

    occupancyTrendChart.data.datasets = newDatasets;
    occupancyTrendChart.update();
}
async function updateDashboardForUniversity() {
    const uniName = document.getElementById('university-search').value;
    if (!uniName) return alert("Please enter a university name.");

    const query = `[out:json][timeout:25];
        area[name="${uniName}"]->.searchArea;
        (way["building"](area.searchArea); relation["building"](area.searchArea););
        out center;`;

    try {
        const response = await fetch("https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query));
        const data = await response.json();
        
        if (!data.elements || data.elements.length === 0) return alert("No buildings found for this location. Try 'Stanford University'.");

        // 1. Map Update
        const first = data.elements[0].center;
        map.flyTo([first.lat, first.lon], 16);
        map.eachLayer(l => { if (l instanceof L.Marker) map.removeLayer(l); });

        const distribution = { 
        'Academic': 0, 
        'Residential': 0, 
        'Medical/Health': 0, 
        'Maintenance & Facilities': 0, 
        'Dining': 0, 
        'Other/General': 0 
        };
        const barLabels = [];
        const barData = [];

        data.elements.forEach((el, index) => {
            const name = el.tags.name || `Building ${index + 1}`;
            L.marker([el.center.lat, el.center.lon]).addTo(map).bindPopup(name);

            // Populate bar chart data (first 10 buildings)
            if (index < 10) {
                barLabels.push(name);
                barData.push(Math.random().toFixed(2));
            }

            // Populate pie chart distribution
            const buildingInfo = {
            name: el.tags ? el.tags.name : el.name,
            type: el.tags ? el.tags.building : el.type
            };

            const category = categorizeBuilding(buildingInfo);
            distribution[category]++;
        });

        // 2. Update Bar Chart
        occupancyChart.data.labels = barLabels;
        occupancyChart.data.datasets[0].data = barData;
        occupancyChart.update();

        /// Update the Pie Chart 
        roomTypeChart.data.labels = Object.keys(distribution);
        roomTypeChart.data.datasets[0].data = Object.values(distribution);
        roomTypeChart.update();

        updateTrendChart(barLabels);

        const failedRooms = [];
    
        data.elements.forEach((el, index) => {
            const name = el.tags.name || `Building ${index + 1}`;
            const category = categorizeBuilding(el.tags || el);

            // Simulation: Flag the first 3 buildings found as 'Failed'
            if (index < 3) {
                failedRooms.push({
                    name: `Room ${Math.floor(Math.random() * 500)}`,
                    building: name
                });
                
                // Highlight failed buildings on the map with a RED marker
                L.circleMarker([el.center.lat, el.center.lon], {
                    color: 'red',
                    radius: 10,
                    fillOpacity: 0.9
                }).addTo(map).bindPopup(`<b>${name}</b><br>STATUS: CRITICAL FAILURE`);
            }
        });

        updateMaintenanceTable(failedRooms);
        updateTrendChart(barLabels); 

    } catch (error) {
        console.error("Fetch error:", error);
    }
}

async function exportDashboardToPDF() {
    const { jsPDF } = window.jspdf;
    const dashboard = document.querySelector('main'); // Selects the main content area
    const exportBtn = document.getElementById('export-btn');
    
    // Feedback: Change button text while processing
    exportBtn.innerText = "Generating PDF...";
    exportBtn.disabled = true;

    try {
        // Use html2canvas to capture the dashboard as an image
        const canvas = await html2canvas(dashboard, {
            scale: 2, // Higher scale for better PDF quality
            useCORS: true, // Crucial for loading OpenStreetMap tiles in the PDF
            logging: false
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // Add the image to the PDF
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        
        // Save the file with a dynamic name
        const uniName = document.getElementById('university-search').value || "Campus";
        pdf.save(`CRUT_Report_${uniName.replace(/\s+/g, '_')}.pdf`);

    } catch (error) {
        console.error("PDF Export failed:", error);
        alert("Failed to generate PDF. Please try again.");
    } finally {
        exportBtn.innerText = "📥 Download Report (PDF)";
        exportBtn.disabled = false;
    }
}