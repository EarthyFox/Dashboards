import { getEntries } from '../utils/storage.js';

export const renderStats = () => {
    const container = document.createElement('div');
    const entries = getEntries();

    if (entries.length === 0) {
        container.innerHTML = `
      <div class="glass-panel" style="padding: 3rem; text-align: center;">
        <h3>No data to analyze yet</h3>
        <p>Log some teas to see your stats!</p>
      </div>
    `;
        return container;
    }

    container.className = 'grid-layout';

    // Summary Cards
    const summaryDiv = document.createElement('div');
    summaryDiv.style.gridColumn = '1 / -1';
    summaryDiv.style.display = 'flex';
    summaryDiv.style.gap = '1rem';
    summaryDiv.style.flexWrap = 'wrap';

    const totalTeas = entries.length;
    const avgRating = (entries.reduce((acc, curr) => acc + curr.rating, 0) / totalTeas).toFixed(1);
    const distinctVendors = new Set(entries.map(e => e.vendor)).size;

    const createCard = (title, value, icon) => `
    <div class="glass-panel" style="padding: 1.5rem; flex: 1; min-width: 200px; display: flex; align-items: center; justify-content: space-between;">
      <div>
        <div style="font-size: 0.9rem; color: var(--color-text-muted);">${title}</div>
        <div style="font-size: 2rem; font-weight: 600; color: var(--color-primary-dark);">${value}</div>
      </div>
      <i class="${icon}" style="font-size: 2.5rem; color: var(--color-secondary); opacity: 0.2;"></i>
    </div>
  `;

    summaryDiv.innerHTML = `
    ${createCard('Total Teas', totalTeas, 'fas fa-mug-hot')}
    ${createCard('Avg Rating', avgRating, 'fas fa-star')}
    ${createCard('Vendor Count', distinctVendors, 'fas fa-store')}
  `;
    container.appendChild(summaryDiv);

    // Charts
    const createChartContainer = (title) => {
        const div = document.createElement('div');
        div.className = 'glass-panel';
        div.style.padding = '1.5rem';
        div.style.minHeight = '300px';
        div.innerHTML = `<h3 style="margin-bottom: 1rem;">${title}</h3><canvas></canvas>`;
        return div;
    };

    const typeChartCtx = createChartContainer('Tea Types').querySelector('canvas');
    const flavorChartCtx = createChartContainer('Top Flavors').querySelector('canvas');

    container.appendChild(typeChartCtx.parentElement);
    container.appendChild(flavorChartCtx.parentElement);

    // Process Data
    // Type Data
    const typeCounts = {};
    entries.forEach(e => { typeCounts[e.type] = (typeCounts[e.type] || 0) + 1; });

    // Flavor Data
    const flavorCounts = {};
    entries.forEach(e => {
        e.flavors.forEach(f => {
            flavorCounts[f] = (flavorCounts[f] || 0) + 1;
        });
    });
    const sortedFlavors = Object.entries(flavorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    setTimeout(() => {
        // Type Chart
        new Chart(typeChartCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(typeCounts),
                datasets: [{
                    data: Object.values(typeCounts),
                    backgroundColor: ['#a8e6cf', '#ffaaa5', '#ffd3b6', '#f4f4f4', '#6b5b95', '#dcedc1', '#fff5ba'],
                    borderWidth: 0
                }]
            },
            options: { responsive: true, plugins: { legend: { position: 'right' } } }
        });

        // Flavor Chart
        new Chart(flavorChartCtx, {
            type: 'bar',
            data: {
                labels: sortedFlavors.map(x => x[0]),
                datasets: [{
                    label: 'Frequency',
                    data: sortedFlavors.map(x => x[1]),
                    backgroundColor: '#8da399',
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { x: { beginAtZero: true, ticks: { precision: 0 } } }
            }
        });
    }, 0);

    return container;
};
