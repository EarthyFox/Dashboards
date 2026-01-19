import { saveEntry } from '../utils/storage.js';

export const renderEntryForm = () => {
    const container = document.createElement('div');
    container.className = 'glass-panel';
    container.style.padding = '2rem';
    container.style.maxWidth = '800px';
    container.style.margin = '0 auto';

    container.innerHTML = `
    <h2 style="margin-bottom: 1.5rem; text-align: center; color: var(--color-primary-dark);">New Tea Session</h2>
    <form id="tea-form">
      <div class="grid-layout" style="grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div>
          <label>Tea Name</label>
          <input type="text" name="name" required placeholder="e.g. Iron Goddess of Mercy" />
        </div>
        <div>
          <label>Origin</label>
          <input type="text" name="origin" placeholder="e.g. Anxi, Fujian" />
        </div>
      </div>

      <div class="grid-layout" style="grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div>
          <label>Type</label>
          <select name="type">
            <option value="Green">Green</option>
            <option value="Black">Black</option>
            <option value="Oolong">Oolong</option>
            <option value="White">White</option>
            <option value="Pu-erh">Pu-erh</option>
            <option value="Herbal">Herbal</option>
            <option value="Yellow">Yellow</option>
          </select>
        </div>
        <div>
          <label>Vendor</label>
          <input type="text" name="vendor" placeholder="Where did you buy it?" />
        </div>
      </div>
      
      <div style="margin-bottom: 1rem;">
        <label>Date</label>
        <input type="date" name="date" required value="${new Date().toISOString().split('T')[0]}" />
      </div>

      <h4 style="margin: 1.5rem 0 0.5rem;">Brewing Parameters</h4>
      <div class="grid-layout" style="grid-template-columns: repeat(3, 1fr); gap: 1rem;">
        <div>
          <label>Temp (°C)</label>
          <input type="number" name="temp" placeholder="95" />
        </div>
        <div>
          <label>Time (sec)</label>
          <input type="number" name="time" placeholder="30" />
        </div>
        <div>
          <label>Ratio</label>
          <input type="text" name="ratio" placeholder="1g/15ml" />
        </div>
      </div>

      <h4 style="margin: 1.5rem 0 0.5rem;">Notes</h4>
      <textarea name="notes" rows="4" placeholder="Describe the aroma, taste, and texture..."></textarea>

      <h4 style="margin: 1.5rem 0 0.5rem;">Rating</h4>
      <div class="rating-input" style="font-size: 1.5rem; color: var(--color-secondary); cursor: pointer; margin-bottom: 1rem;">
        <i class="far fa-star" data-val="1"></i>
        <i class="far fa-star" data-val="2"></i>
        <i class="far fa-star" data-val="3"></i>
        <i class="far fa-star" data-val="4"></i>
        <i class="far fa-star" data-val="5"></i>
        <input type="hidden" name="rating" id="rating-value" value="0">
      </div>

      <h4 style="margin: 1.5rem 0 0.5rem;">Flavor Tags</h4>
      <div id="flavor-tags" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">
        <!-- Inject tags via JS -->
      </div>
      <input type="hidden" name="flavors" id="flavors-value" />

      <button type="submit" class="btn" style="width: 100%; justify-content: center;">
        <i class="fas fa-save"></i> Save Entry
      </button>
    </form>
  `;

    // Rating Logic
    const stars = container.querySelectorAll('.rating-input i');
    const ratingInput = container.querySelector('#rating-value');
    stars.forEach(star => {
        star.addEventListener('click', (e) => {
            const val = e.target.dataset.val;
            ratingInput.value = val;
            stars.forEach(s => {
                if (s.dataset.val <= val) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                } else {
                    s.classList.remove('fas');
                    s.classList.add('far');
                }
            });
        });
    });

    // Flavor Tags Logic
    const FLAVORS = ['Vegetal', 'Floral', 'Fruity', 'Spicy', 'Nutty', 'Creamy', 'Woody', 'Earthy', 'Smoky', 'Mineral', 'Sweet', 'Bitter', 'Astringent'];
    const flavorContainer = container.querySelector('#flavor-tags');
    const flavorsInput = container.querySelector('#flavors-value');
    const selectedFlavors = new Set();

    FLAVORS.forEach(flavor => {
        const chip = document.createElement('span');
        chip.textContent = flavor;
        chip.style.padding = '0.5rem 1rem';
        chip.style.borderRadius = '20px';
        chip.style.border = '1px solid var(--color-primary)';
        chip.style.cursor = 'pointer';
        chip.style.fontSize = '0.9rem';
        chip.style.transition = 'all 0.2s';
        chip.style.color = 'var(--color-primary-dark)';
        chip.style.background = 'rgba(255,255,255,0.5)';

        chip.addEventListener('click', () => {
            if (selectedFlavors.has(flavor)) {
                selectedFlavors.delete(flavor);
                chip.style.background = 'rgba(255,255,255,0.5)';
                chip.style.color = 'var(--color-primary-dark)';
            } else {
                selectedFlavors.add(flavor);
                chip.style.background = 'var(--color-primary)';
                chip.style.color = 'white';
            }
            flavorsInput.value = Array.from(selectedFlavors).join(',');
        });
        flavorContainer.appendChild(chip);
    });

    // Submit Handler
    const form = container.querySelector('#tea-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const entry = {
            name: formData.get('name'),
            origin: formData.get('origin'),
            type: formData.get('type'),
            vendor: formData.get('vendor'),
            date: formData.get('date'),
            rating: parseInt(formData.get('rating')),
            flavors: formData.get('flavors') ? formData.get('flavors').split(',') : [],
            brewing: {
                temp: formData.get('temp'),
                time: formData.get('time'),
                ratio: formData.get('ratio')
            },
            notes: formData.get('notes')
        };

        saveEntry(entry);
        alert('Entry Saved!');
        form.reset();
        selectedFlavors.clear();
        Array.from(flavorContainer.children).forEach(chip => {
            chip.style.background = 'rgba(255,255,255,0.5)';
            chip.style.color = 'var(--color-primary-dark)';
        });
        // Reset stars
        stars.forEach(s => {
            s.classList.remove('fas');
            s.classList.add('far');
        });

        // Potentially navigate back to gallery here
    });

    return container;
};
