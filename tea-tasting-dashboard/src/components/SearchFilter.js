export const renderSearchFilter = () => {
    const container = document.createElement('div');
    container.className = 'glass-panel';
    container.style.padding = '1rem';
    container.style.marginBottom = '2rem';
    container.style.display = 'flex';
    container.style.flexWrap = 'wrap';
    container.style.gap = '1rem';
    container.style.alignItems = 'center';

    container.innerHTML = `
    <div style="flex: 2; min-width: 200px;">
      <input type="text" id="search-input" placeholder="Search tea name, origin, or notes..." style="margin: 0;">
    </div>
    
    <div style="flex: 1; min-width: 150px;">
      <select id="type-filter" style="margin: 0;">
        <option value="">All Types</option>
        <option value="Green">Green</option>
        <option value="Black">Black</option>
        <option value="Oolong">Oolong</option>
        <option value="White">White</option>
        <option value="Pu-erh">Pu-erh</option>
        <option value="Herbal">Herbal</option>
        <option value="Yellow">Yellow</option>
      </select>
    </div>

    <div style="flex: 1; min-width: 150px;">
      <select id="rating-filter" style="margin: 0;">
        <option value="">Min Rating</option>
        <option value="5">5 Stars</option>
        <option value="4">4+ Stars</option>
        <option value="3">3+ Stars</option>
      </select>
    </div>

    <div style="flex: 1; min-width: 150px;">
      <select id="sort-filter" style="margin: 0;">
        <option value="date-desc">Newest First</option>
        <option value="date-asc">Oldest First</option>
        <option value="rating-desc">Highest Rated</option>
      </select>
    </div>

    <div>
      <button id="export-btn" class="btn" style="white-space: nowrap;"><i class="fas fa-file-download"></i> Export PDF</button>
    </div>
  `;

    container.querySelector('#export-btn').addEventListener('click', () => {
        container.dispatchEvent(new CustomEvent('export-data'));
    });

    const inputs = container.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const filters = {
                query: container.querySelector('#search-input').value,
                type: container.querySelector('#type-filter').value,
                rating: container.querySelector('#rating-filter').value,
                sort: container.querySelector('#sort-filter').value
            };
            container.dispatchEvent(new CustomEvent('filter-change', { detail: filters }));
        });
    });

    return container;
};
