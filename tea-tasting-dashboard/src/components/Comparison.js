import { getEntries } from '../utils/storage.js';

export const renderComparison = () => {
    const container = document.createElement('div');
    const entries = getEntries();

    if (entries.length < 2) {
        container.innerHTML = `
      <div class="glass-panel" style="padding: 3rem; text-align: center;">
        <h3>Not enough data</h3>
        <p>You need at least 2 entries to use the comparison tool.</p>
      </div>
    `;
        return container;
    }

    container.className = 'glass-panel';
    container.style.padding = '2rem';

    // Selection Controls
    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.gap = '1rem';
    controls.style.marginBottom = '2rem';
    controls.innerHTML = `
    <div style="flex: 1;">
      <label>Tea A</label>
      <select id="select-a" style="margin: 0;"></select>
    </div>
    <div style="flex: 1;">
      <label>Tea B</label>
      <select id="select-b" style="margin: 0;"></select>
    </div>
  `;

    // Populate Options
    const populateOptions = (select, selectedId) => {
        select.innerHTML = '<option value="">Select a tea...</option>';
        entries.forEach(e => {
            const option = document.createElement('option');
            option.value = e.id;
            option.textContent = `${e.name} (${e.date})`;
            if (e.id === selectedId) option.selected = true;
            select.appendChild(option);
        });
    };

    const selectA = controls.querySelector('#select-a');
    const selectB = controls.querySelector('#select-b');
    populateOptions(selectA, entries[0].id);
    populateOptions(selectB, entries[1].id);

    container.appendChild(controls);

    const comparisonArea = document.createElement('div');
    container.appendChild(comparisonArea);

    const renderComparisonTable = () => {
        const teaA = entries.find(e => e.id === selectA.value);
        const teaB = entries.find(e => e.id === selectB.value);

        if (!teaA || !teaB) {
            comparisonArea.innerHTML = '<p style="text-align: center; color: var(--color-text-muted);">Please select two teas to compare.</p>';
            return;
        }

        // Identify Common Flavors
        const commonFlavors = teaA.flavors.filter(f => teaB.flavors.includes(f));
        const uniqueA = teaA.flavors.filter(f => !teaB.flavors.includes(f));
        const uniqueB = teaB.flavors.filter(f => !teaA.flavors.includes(f));

        comparisonArea.innerHTML = `
      <div class="grid-layout" style="grid-template-columns: 1fr 1fr; gap: 0; border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden;">
        <!-- Header -->
        <div style="padding: 1.5rem; background: rgba(0,0,0,0.02); border-bottom: 1px solid var(--color-border); border-right: 1px solid var(--color-border);">
          <h3 style="color: var(--color-primary-dark);">${teaA.name}</h3>
        </div>
        <div style="padding: 1.5rem; background: rgba(0,0,0,0.02); border-bottom: 1px solid var(--color-border);">
          <h3 style="color: var(--color-primary-dark);">${teaB.name}</h3>
        </div>

        <!-- Rating -->
        <div style="padding: 1rem; border-bottom: 1px solid var(--color-border); border-right: 1px solid var(--color-border);">
          <div style="font-size: 0.8rem; color: var(--color-text-muted);">Rating</div>
          <div style="font-size: 1.2rem;">${teaA.rating}/5 <i class="fas fa-star" style="color: var(--color-secondary);"></i></div>
        </div>
        <div style="padding: 1rem; border-bottom: 1px solid var(--color-border);">
          <div style="font-size: 0.8rem; color: var(--color-text-muted);">Rating</div>
          <div style="font-size: 1.2rem;">${teaB.rating}/5 <i class="fas fa-star" style="color: var(--color-secondary);"></i></div>
        </div>

        <!-- Type & Origin -->
        <div style="padding: 1rem; border-bottom: 1px solid var(--color-border); border-right: 1px solid var(--color-border);">
          <div><span style="font-weight: 500;">${teaA.type}</span> from ${teaA.origin}</div>
        </div>
        <div style="padding: 1rem; border-bottom: 1px solid var(--color-border);">
          <div><span style="font-weight: 500;">${teaB.type}</span> from ${teaB.origin}</div>
        </div>

        <!-- Brewing -->
        <div style="padding: 1rem; border-bottom: 1px solid var(--color-border); border-right: 1px solid var(--color-border);">
          <div style="font-size: 0.9rem;">${teaA.brewing.temp}°C / ${teaA.brewing.time}s</div>
        </div>
        <div style="padding: 1rem; border-bottom: 1px solid var(--color-border);">
          <div style="font-size: 0.9rem;">${teaB.brewing.temp}°C / ${teaB.brewing.time}s</div>
        </div>

        <!-- Flavors -->
        <div style="padding: 1rem; border-right: 1px solid var(--color-border);">
          <div style="display: flex; flex-wrap: wrap; gap: 0.3rem;">
            ${commonFlavors.map(f => `<span style="background: var(--color-secondary); color: white; padding: 0.1rem 0.5rem; border-radius: 10px; font-size: 0.8rem; opacity: 0.7;">${f}</span>`).join('')}
            ${uniqueA.map(f => `<span style="background: var(--color-primary); color: white; padding: 0.1rem 0.5rem; border-radius: 10px; font-size: 0.8rem;">${f}</span>`).join('')}
          </div>
        </div>
        <div style="padding: 1rem;">
          <div style="display: flex; flex-wrap: wrap; gap: 0.3rem;">
            ${commonFlavors.map(f => `<span style="background: var(--color-secondary); color: white; padding: 0.1rem 0.5rem; border-radius: 10px; font-size: 0.8rem; opacity: 0.7;">${f}</span>`).join('')}
            ${uniqueB.map(f => `<span style="background: var(--color-primary); color: white; padding: 0.1rem 0.5rem; border-radius: 10px; font-size: 0.8rem;">${f}</span>`).join('')}
          </div>
        </div>
      </div>
      
      <div style="margin-top: 1rem; text-align: center; font-size: 0.8rem; color: var(--color-text-muted);">
        <span style="background: var(--color-secondary); width: 10px; height: 10px; display: inline-block; border-radius: 50%; opacity: 0.7;"></span> Common Flavors
        <span style="background: var(--color-primary); width: 10px; height: 10px; display: inline-block; border-radius: 50%; margin-left: 1rem;"></span> Unique Flavors
      </div>
    `;
    };

    selectA.addEventListener('change', renderComparisonTable);
    selectB.addEventListener('change', renderComparisonTable);

    renderComparisonTable();

    return container;
};
