import { deleteEntry } from '../utils/storage.js';

export const renderGallery = (entries) => {
    const container = document.createElement('div');

    if (entries.length === 0) {
        container.innerHTML = `
      <div style="text-align: center; color: var(--color-text-muted); margin-top: 3rem;">
        <i class="fas fa-mug-hot" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
        <h3>No entries yet</h3>
        <p>Start your journey by adding a new tea tasting.</p>
      </div>
    `;
        return container;
    }

    container.className = 'grid-layout';

    entries.forEach(entry => {
        const card = document.createElement('div');
        card.className = 'glass-panel';
        card.style.padding = '1.5rem';
        card.style.cursor = 'pointer';
        card.style.transition = 'transform 0.2s';
        card.onmouseover = () => card.style.transform = 'translateY(-5px)';
        card.onmouseout = () => card.style.transform = 'translateY(0)';

        // Color code indicator based on tea type
        const typeColors = {
            'Green': '#a8e6cf',
            'Black': '#ffaaa5',
            'Oolong': '#ffd3b6',
            'White': '#f4f4f4',
            'Pu-erh': '#6b5b95',
            'Herbal': '#dcedc1',
            'Yellow': '#fff5ba'
        };
        const teaColor = typeColors[entry.type] || '#ddd';

        card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
        <span style="background: ${teaColor}; color: #333; padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">${entry.type}</span>
        <span style="color: var(--color-text-muted); font-size: 0.85rem;">${entry.date}</span>
      </div>
      <h3 style="margin-bottom: 0.5rem; font-size: 1.25rem;">${entry.name}</h3>
      <p style="color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: 1rem;"><i class="fas fa-map-marker-alt"></i> ${entry.origin}</p>
      
      <div style="margin-bottom: 1rem;">
        ${getStarString(entry.rating)}
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 0.3rem;">
        ${entry.flavors.slice(0, 3).map(f => `<span style="font-size: 0.8rem; background: rgba(0,0,0,0.05); padding: 0.2rem 0.5rem; border-radius: 4px;">${f}</span>`).join('')}
        ${entry.flavors.length > 3 ? `<span style="font-size: 0.8rem; color: var(--color-text-muted);">+${entry.flavors.length - 3}</span>` : ''}
      </div>
    `;

        card.addEventListener('click', () => openModal(entry));
        container.appendChild(card);
    });

    return container;
};

const getStarString = (rating) => {
    let str = '';
    for (let i = 0; i < 5; i++) {
        str += `<i class="${i < rating ? 'fas' : 'far'} fa-star" style="color: var(--color-secondary);"></i>`;
    }
    return str;
};

// Modal Logic
const openModal = (entry) => {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.5)';
    modal.style.backdropFilter = 'blur(5px)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    modal.style.padding = '1rem';

    const content = document.createElement('div');
    content.className = 'glass-panel';
    content.style.background = 'var(--color-bg)';
    content.style.width = '100%';
    content.style.maxWidth = '600px';
    content.style.maxHeight = '90vh';
    content.style.overflowY = 'auto';
    content.style.padding = '2rem';
    content.style.position = 'relative';

    content.innerHTML = `
    <button id="close-modal" style="position: absolute; top: 1rem; right: 1rem; border: none; background: none; font-size: 1.5rem; cursor: pointer; color: var(--color-text-muted);"><i class="fas fa-times"></i></button>
    
    <div style="border-bottom: 1px solid var(--color-border); padding-bottom: 1rem; margin-bottom: 1.5rem;">
      <span style="color: var(--color-primary-dark); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; font-size: 0.9rem;">${entry.type}</span>
      <h2 style="font-size: 2rem; margin: 0.5rem 0;">${entry.name}</h2>
      <p style="color: var(--color-text-muted);"><i class="fas fa-store"></i> ${entry.vendor} &bull; <i class="fas fa-map-marker-alt"></i> ${entry.origin} &bull; ${entry.date}</p>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
      <div>
        <h4><i class="fas fa-clipboard-list"></i> Flavor Profile</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
          ${entry.flavors.map(f => `<span style="background: var(--color-primary); color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem;">${f}</span>`).join('')}
        </div>
      </div>
      <div>
        <h4><i class="fas fa-stopwatch"></i> Brewing</h4>
        <ul style="list-style: none; margin-top: 0.5rem; color: var(--color-text-main);">
          <li><strong>Temp:</strong> ${entry.brewing.temp}°C</li>
          <li><strong>Time:</strong> ${entry.brewing.time}s</li>
          <li><strong>Ratio:</strong> ${entry.brewing.ratio}</li>
        </ul>
      </div>
    </div>

    <div style="margin-bottom: 2rem;">
      <h4>Notes</h4>
      <p style="background: var(--color-surface); padding: 1rem; border-radius: var(--radius-md); margin-top: 0.5rem; white-space: pre-wrap;">${entry.notes}</p>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--color-border); padding-top: 1.5rem;">
      <div style="font-size: 1.5rem;">${getStarString(entry.rating)}</div>
      <button id="delete-entry" class="btn" style="background: #ef4444;"><i class="fas fa-trash"></i> Delete</button>
    </div>
  `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    content.querySelector('#close-modal').addEventListener('click', () => modal.remove());

    content.querySelector('#delete-entry').addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this entry?')) {
            deleteEntry(entry.id);
            modal.remove();
            // Re-render gallery if possible, or reload
            // Ideally we'd trigger a re-render. 
            // For now, simple reload or custom event
            document.dispatchEvent(new CustomEvent('entry-deleted'));
        }
    });

    // Prevent background scroll
    document.body.style.overflow = 'hidden';
    const cleanup = () => { document.body.style.overflow = ''; };
    const observer = new MutationObserver((mutations) => {
        if (!document.body.contains(modal)) {
            cleanup();
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true });
};
