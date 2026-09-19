// MOCK DATABASE with Monthly History for Feature 3
const officialsDB = [
    {
        id: "VP001", password: "vp2026", name: "Moses Miracle", position: "Vice President",
        constituency: "Maitama District", preOfficeWealth: 500000000, currentBalance: 1000000000,
        monthlySalary: 250000000, currentLocation: "Maitama, Abuja", postTermLocation: "Maitama, Abuja",
        history: [{m:"Jan 2026", b:500000000}, {m:"Feb 2026", b:750000000}, {m:"Mar 2026", b:1000000000}]
    },
    {
        id: "MIN005", password: "women2026", name: "Blessed Otem", position: "Minister of Women Affairs",
        constituency: "FCT / National", preOfficeWealth: 30000000, currentBalance: 45000000,
        monthlySalary: 25000000, currentLocation: "Abuja", postTermLocation: "Home State",
        history: [{m:"Jan 2026", b:30000000}, {m:"Feb 2026", b:35000000}, {m:"Mar 2026", b:45000000}]
    },
    {
        id: "SEN006", password: "enugu2026", name: "Callistus Uchechuku", position: "Senate President",
        constituency: "Enugu East", preOfficeWealth: 500000000, currentBalance: 1600000000,
        monthlySalary: 250000000, currentLocation: "Enugu / Abuja", postTermLocation: "Enugu East",
        history: [{m:"Jan 2026", b:500000000}, {m:"Feb 2026", b:1000000000}, {m:"Mar 2026", b:1600000000}]
    },
    {
        id: "SEN001", password: "safe123", name: "Sen. Adebayo Johnson", position: "Senator",
        constituency: "Abuja Municipal", preOfficeWealth: 5000000, currentBalance: 12000000,
        monthlySalary: 1050000, currentLocation: "Abuja", postTermLocation: "N/A",
        history: [{m:"Jan 2026", b:5000000}, {m:"Feb 2026", b:8000000}, {m:"Mar 2026", b:12000000}]
    }
];

let publicReports = []; // Feature 4: Stores citizen reports

function formatMoney(amount) { return "₦" + amount.toLocaleString('en-US'); }

// FEATURE 2: Statistics Dashboard Logic
function updateStats() {
    let totalOfficials = officialsDB.length;
    let flaggedCount = 0;
    let totalWealth = 0;
    let totalExcess = 0;

    officialsDB.forEach(o => {
        totalWealth += o.currentBalance;
        let threshold = o.preOfficeWealth * 3;
        if (o.currentBalance > threshold) {
            flaggedCount++;
            totalExcess += (o.currentBalance - threshold);
        }
    });

    document.getElementById('stat-total').textContent = totalOfficials;
    document.getElementById('stat-flagged').textContent = flaggedCount;
    document.getElementById('stat-wealth').textContent = formatMoney(totalWealth);
    document.getElementById('stat-excess').textContent = formatMoney(totalExcess);
}

// FEATURE 1 & 5: Search, Filter, and Sort Logic
function renderOfficials() {
    const searchVal = document.getElementById('searchInput').value.toLowerCase();
    const filterVal = document.getElementById('filterStatus').value;
    const sortVal = document.getElementById('sortStatus').value;
    const listContainer = document.getElementById('officials-list');
    
    listContainer.innerHTML = '';

    // Filter
    let filtered = officialsDB.filter(o => {
        let matchesSearch = o.name.toLowerCase().includes(searchVal) || o.position.toLowerCase().includes(searchVal);
        let threshold = o.preOfficeWealth * 3;
        let isFlagged = o.currentBalance > threshold;
        let matchesFilter = filterVal === 'all' || (filterVal === 'flagged' && isFlagged) || (filterVal === 'clean' && !isFlagged);
        return matchesSearch && matchesFilter;
    });

    // Sort
    if (sortVal === 'highest-balance') {
        filtered.sort((a, b) => b.currentBalance - a.currentBalance);
    } else if (sortVal === 'highest-excess') {
        filtered.sort((a, b) => {
            let exA = Math.max(0, a.currentBalance - (a.preOfficeWealth * 3));
            let exB = Math.max(0, b.currentBalance - (b.preOfficeWealth * 3));
            return exB - exA;
        });
    }

    // Render
    filtered.forEach(o => {
        const threshold = o.preOfficeWealth * 3;
        const isBreached = o.currentBalance > threshold;
        const excess = isBreached ? o.currentBalance - threshold : 0;

        const card = document.createElement('div');
        card.className = `official-card ${isBreached ? 'breached' : 'safe'}`;
        
        // FEATURE 3: Timeline HTML
        let timelineHtml = '<ul class="timeline-list">';
        o.history.forEach(h => {
            timelineHtml += `<li><span>${h.m}</span> <span>${formatMoney(h.b)}</span></li>`;
        });
        timelineHtml += '</ul>';

        card.innerHTML = `
            <div class="card-header">
                <h3>${o.name}</h3>
                <span class="position-badge">${o.position}</span>
            </div>
            <div class="financials">
                <div class="fin-item"><span class="label">Pre-Office:</span><span class="value">${formatMoney(o.preOfficeWealth)}</span></div>
                <div class="fin-item"><span class="label">Current:</span><span class="value highlight">${formatMoney(o.currentBalance)}</span></div>
                <div class="fin-item"><span class="label">3x Limit:</span><span class="value">${formatMoney(threshold)}</span></div>
            </div>
            ${isBreached ? `<div class="alarm-box">🚨 THRESHOLD BREACHED! Excess: ${formatMoney(excess)}</div>` : `<div class="status-box">✅ Within Limits</div>`}
            
            <!-- Interactive Buttons -->
            <div class="action-buttons">
                <button class="btn-action" onclick="toggleTimeline('${o.id}')">📊 View Wealth Timeline</button>
                <button class="btn-action report-btn" onclick="openReportModal('${o.name}')">🚨 Report Suspicious Wealth</button>
            </div>

            <!-- Hidden Timeline -->
            <div id="timeline-${o.id}" class="timeline-container" style="display:none;">
                <h4>Wealth Accumulation History</h4>
                ${timelineHtml}
            </div>

            <div class="profile-info">
                <p><strong>Location:</strong> ${o.currentLocation} | <strong>Post-Term Plan:</strong> ${o.postTermLocation}</p>
            </div>
        `;
        listContainer.appendChild(card);
    });
}

// Feature 3: Toggle Timeline
function toggleTimeline(id) {
    const el = document.getElementById(`timeline-${id}`);
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

// Feature 4: Report Modal Logic
function openReportModal(name) {
    document.getElementById('reportModal').style.display = 'flex';
    document.getElementById('reportTarget').textContent = name;
}
function closeReportModal() {
    document.getElementById('reportModal').style.display = 'none';
}
function submitReport() {
    const details = document.getElementById('reportDetails').value;
    if(details.trim() === "") return alert("Please enter details.");
    
    publicReports.push({ target: document.getElementById('reportTarget').textContent, details: details, date: new Date().toLocaleDateString() });
    alert("Report submitted anonymously to the public ledger. Thank you for your civic duty.");
    document.getElementById('reportDetails').value = "";
    closeReportModal();
}

// Event Listeners for Search/Sort
document.getElementById('searchInput').addEventListener('input', renderOfficials);
document.getElementById('filterStatus').addEventListener('change', renderOfficials);
document.getElementById('sortStatus').addEventListener('change', renderOfficials);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    renderOfficials();
});
