import { renderEntryForm } from './components/EntryForm.js';
import { renderGallery } from './components/Gallery.js';
import { renderSearchFilter } from './components/SearchFilter.js';
import { renderTools } from './components/Tools.js';
import { renderStats } from './components/Dashboard.js';
import { renderComparison } from './components/Comparison.js';
import { exportToPDF } from './utils/export.js';
import { seedData, getEntries } from './utils/storage.js';

// Initialize
seedData();

const app = document.getElementById('app');

// Router State
let currentView = 'home'; // home, gallery, add, stats

// Layout Skeleton
const renderLayout = () => {
  app.innerHTML = `
    <nav style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
      <h1 style="font-size: 2rem; color: var(--color-primary-dark); display: flex; align-items: center; gap: 0.5rem; cursor: pointer;" onclick="location.reload()">
        <i class="fas fa-leaf"></i> Tea Journal
      </h1>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button class="btn btn-secondary" id="nav-gallery"><i class="fas fa-th-large"></i> Gallery</button>
        <button class="btn btn-secondary" id="nav-add"><i class="fas fa-plus"></i> Log</button>
        <button class="btn btn-secondary" id="nav-stats"><i class="fas fa-chart-pie"></i> Stats</button>
        <button class="btn btn-secondary" id="nav-compare"><i class="fas fa-balance-scale"></i> Compare</button>
        <button class="btn btn-secondary" id="nav-tools"><i class="fas fa-stopwatch"></i> Tools</button>
        <button class="btn btn-secondary" id="theme-toggle"><i class="fas fa-moon"></i></button>
      </div>
    </nav>
    <main id="content"></main>
  `;

  // Event Listeners
  document.getElementById('nav-gallery').addEventListener('click', () => navigate('gallery'));
  document.getElementById('nav-add').addEventListener('click', () => navigate('add'));
  document.getElementById('nav-stats').addEventListener('click', () => navigate('stats'));
  document.getElementById('nav-compare').addEventListener('click', () => navigate('compare'));
  document.getElementById('nav-tools').addEventListener('click', () => navigate('tools'));

  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
  });
};

const navigate = (view) => {
  currentView = view;
  renderContent();
};

const renderContent = () => {
  const content = document.getElementById('content');
  content.innerHTML = '';

  if (currentView === 'add') {
    content.appendChild(renderEntryForm());
  } else if (currentView === 'gallery') {
    const wrapper = document.createElement('div');
    const searchFilter = renderSearchFilter();
    const galleryArea = document.createElement('div');

    // Initial Render
    let allEntries = getEntries();
    galleryArea.appendChild(renderGallery(allEntries));

    // Filter Logic
    searchFilter.addEventListener('filter-change', (e) => {
      const { query, type, rating, sort } = e.detail;
      let filtered = allEntries.filter(entry => {
        const matchesQuery = !query ||
          entry.name.toLowerCase().includes(query.toLowerCase()) ||
          entry.origin.toLowerCase().includes(query.toLowerCase()) ||
          (entry.notes && entry.notes.toLowerCase().includes(query.toLowerCase()));

        const matchesType = !type || entry.type === type;
        const matchesRating = !rating || entry.rating >= parseInt(rating);

        return matchesQuery && matchesType && matchesRating;
      });

      // Sort
      filtered.sort((a, b) => {
        if (sort === 'date-desc') return new Date(b.date) - new Date(a.date);
        if (sort === 'date-asc') return new Date(a.date) - new Date(b.date);
        if (sort === 'rating-desc') return b.rating - a.rating;
        return 0;
      });

      galleryArea.innerHTML = '';
      galleryArea.appendChild(renderGallery(filtered));
    });

    searchFilter.addEventListener('export-data', () => {
      exportToPDF(allEntries);
    });

    wrapper.appendChild(searchFilter);
    wrapper.appendChild(galleryArea);
    content.appendChild(wrapper);
  } else if (currentView === 'stats') {
    content.appendChild(renderStats());
  } else if (currentView === 'compare') {
    content.appendChild(renderComparison());
  } else if (currentView === 'tools') {
    content.appendChild(renderTools());
  } else {
    // Default Home
    content.innerHTML = `
      <div class="glass-panel" style="padding: 3rem; text-align: center;">
        <h2>Welcome to your Tea Journal</h2>
        <p style="margin: 1rem 0 2rem;">Track your tasting journey, explore new flavors, and analyze your habits.</p>
        <button class="btn" style="font-size: 1.2rem;" onclick="document.getElementById('nav-add').click()">
          Start Tasting
        </button>
      </div>
    `;
  }
};

// Initial Render
renderLayout();
renderContent();
