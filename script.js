const officialsDB = [
    {
        id: "SEN001",
        password: "safe123",
        name: "Sen. Adebayo Johnson",
        position: "Senator",
        constituency: "Abuja Municipal",
        preOfficeWealth: 5000000,
        currentBalance: 12000000,
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
        preOfficeWealth: 10000000,
        currentBalance: 45000000,
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
        preOfficeWealth: 2000000,
        currentBalance: 15000000,
        monthlySalary: 850000,
        currentLocation: "Kano",
        postTermLocation: "N/A (Still in office)"
    },
    {
        id: "MIN004",
        password: "transparency2026",
        name: "Dr. Amina Hassan",
        position: "Minister of Health",
        constituency: "Kaduna Central",
        preOfficeWealth: 8000000,
        currentBalance: 28000000,
        monthlySalary: 1800000,
        currentLocation: "Abuja",
        postTermLocation: "Kaduna"
    },
    {
        id: "VP001",
        password: "vp2026",
        name: "Moses Miracle",
        position: "Vice President",
        constituency: "Maitama District",
        preOfficeWealth: 500000000,
        currentBalance: 1000000000,
        monthlySalary: 250000000,
        currentLocation: "Maitama, Abuja",
        postTermLocation: "Maitama, Abuja"
    },
    {
        id: "MIN005",
        password: "women2026",
        name: "Blessed Otem",
        position: "Minister of Women Affairs",
        constituency: "FCT / National",
        preOfficeWealth: 30000000,
        currentBalance: 45000000,
        monthlySalary: 25000000,
        currentLocation: "Abuja",
        postTermLocation: "Home State"
    },
    {
        id: "SEN006",
        password: "enugu2026",
        name: "Callistus Uchechuku",
        position: "Senate President",
        constituency: "Enugu East",
        preOfficeWealth: 500000000,
        currentBalance: 1600000000,
        monthlySalary: 250000000,
        currentLocation: "Enugu / Abuja",
        postTermLocation: "Enugu East"
    }
];

function formatMoney(amount) {
    return "₦" + amount.toLocaleString('en-US');
}

function loadPublicDashboard() {
    const listContainer = document.getElementById('officials-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    officialsDB.forEach(official => {
        const threshold = official.preOfficeWealth * 3;
        const isBreached = official.currentBalance > threshold;
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
                <h4>Official Profile & Location (Lock 1 & 3)</h4>
                <p><strong>Current Location:</strong> ${official.currentLocation}</p>
                <p><strong>Post-Term Domicile Plan:</strong> ${official.postTermLocation}</p>
            </div>
        `;
        
        listContainer.appendChild(card);
    });
}

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

document.addEventListener('DOMContentLoaded', loadPublicDashboard);
