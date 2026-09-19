// MOCK DATABASE: This simulates the backend database
const officialsDB = [
    {
        id: "SEN001",
        password: "safe123",
        name: "Sen. Adebayo Johnson",
        position: "Senator",
        constituency: "Abuja Municipal",
        preOfficeWealth: 5000000, // 5 Million Naira before office
        currentBalance: 12000000, // 12 Million now (Safe, threshold is 15M)
        monthlySalary: 1050000,
        currentLocation: "Abuja",
        postTermLocation: "N/A (Still in office)"
    },
    {
        id: "GOV002",
        password: "alarm123",
        name: "Gov. Chinedu Okafor",
        position: "Governor",
        constituency: "Enugu State",
        preOfficeWealth: 10000000, // 10 Million before office
        currentBalance: 45000000, // 45 Million now (ALARM! Threshold is 30M)
        monthlySalary: 2500000,
        currentLocation: "Enugu",
        postTermLocation: "N/A (Still in office)"
    },
    {
        id: "REP003",
        password: "pass123",
        name: "Rep. Fatima Bello",
        position: "House of Reps",
        constituency: "Kano North",
        preOfficeWealth: 2000000, // 2 Million before office
        currentBalance: 15000000, // 15 Million now (ALARM! Threshold is 6M)
        monthlySalary: 850000,
        currentLocation: "Kano",
        postTermLocation: "N/A (Still in office)"
    }
    {
    id: "MIN004",
    password: "transparency2026",
    name: "Dr. Amina Hassan",
    position: "Minister of Health",
    constituency: "Kaduna Central",
    preOfficeWealth: 8000000,
    currentBalance: 28000000,  // This will trigger ALARM (3x of 8M = 24M)
    monthlySalary: 1800000,
    currentLocation: "Abuja",
    postTermLocation: "Kaduna"
    },
];

// Function to format numbers as currency (Naira)
function formatMoney(amount) {
    return "₦" + amount.toLocaleString('en-US');
}

// Function to render the public dashboard
function loadPublicDashboard() {
    const listContainer = document.getElementById('officials-list');
    if (!listContainer) return; // Stop if we are not on the homepage

    listContainer.innerHTML = ''; // Clear existing

    officialsDB.forEach(official => {
        const threshold = official.preOfficeWealth * 3;
        const isBreached = official.currentBalance > threshold;
        
        // Calculate how much they exceeded by
        const excess = isBreached ? official.currentBalance - threshold : 0;

        const card = document.createElement('div');
        card.className = `official-card ${isBreached ? 'breached' : 'safe'}`;
        
        card.innerHTML = `
            <div class="card-header">
                <h3>${official.name}</h3>
                <span class="position-badge">${official.position} - ${official.constituency}</span>
            </div>
            
            <div class="financials">
                <div class="fin-item">
                    <span class="label">Pre-Office Wealth:</span>
                    <span class="value">${formatMoney(official.preOfficeWealth)}</span>
                </div>
                <div class="fin-item">
                    <span class="label">Current Balance:</span>
                    <span class="value highlight">${formatMoney(official.currentBalance)}</span>
                </div>
                <div class="fin-item">
                    <span class="label">3x Threshold Limit:</span>
                    <span class="value">${formatMoney(threshold)}</span>
                </div>
            </div>

            ${isBreached ? `
                <div class="alarm-box">
                    🚨 THRESHOLD BREACHED! Automatic Investigation Triggered.
                    <br><small>Excess wealth: ${formatMoney(excess)}</small>
                </div>
            ` : `
                <div class="status-box">
                    ✅ Within Acceptable Limits
                </div>
            `}

            <div class="profile-info">
                <h4>Official Profile & Location</h4>
                <p><strong>Current Location:</strong> ${official.currentLocation}</p>
                <p><strong>Post-Term Domicile Plan:</strong> ${official.postTermLocation}</p>
            </div>
        `;
        
        listContainer.appendChild(card);
    });
}

// Function to handle Official Login
function handleLogin() {
    const idInput = document.getElementById('officialId');
    const passInput = document.getElementById('password');
    const errorDiv = document.getElementById('loginError');
    const dashboard = document.getElementById('officialDashboard');
    const loginForm = document.getElementById('loginForm');

    if (!idInput) return;

    const id = idInput.value.trim();
    const pass = passInput.value;

    const official = officialsDB.find(o => o.id === id && o.password === pass);

    if (official) {
        // Login successful
        loginForm.style.display = 'none';
        dashboard.style.display = 'block';
        
        document.getElementById('dashName').textContent = official.name;
        document.getElementById('dashPosition').textContent = `${official.position} - ${official.constituency}`;
        document.getElementById('dashBalance').textContent = formatMoney(official.currentBalance);
        document.getElementById('dashSalary').textContent = formatMoney(official.monthlySalary);
        
        const threshold = official.preOfficeWealth * 3;
        document.getElementById('dashThreshold').textContent = formatMoney(threshold);
        
        const alertBox = document.getElementById('dashAlert');
        if (official.currentBalance > threshold) {
            alertBox.style.display = 'block';
            alertBox.innerHTML = `🚨 CRITICAL ALERT: Your account has exceeded the 3x threshold by ${formatMoney(official.currentBalance - threshold)}. An automatic investigation has been flagged to the public.`;
        } else {
            alertBox.style.display = 'none';
        }
    } else {
        errorDiv.style.display = 'block';
        errorDiv.textContent = 'Invalid Official ID or Password.';
    }
}

// Load dashboard if on homepage
document.addEventListener('DOMContentLoaded', loadPublicDashboard);
