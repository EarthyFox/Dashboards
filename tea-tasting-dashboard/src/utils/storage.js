const STORAGE_KEY = 'tea_journal_entries';

export const getEntries = () => {
    const entries = localStorage.getItem(STORAGE_KEY);
    return entries ? JSON.parse(entries) : [];
};

export const saveEntry = (entry) => {
    const entries = getEntries();
    // Add ID and timestamp if not present
    const newEntry = {
        ...entry,
        id: entry.id || Date.now().toString(),
        createdAt: entry.createdAt || new Date().toISOString()
    };

    // Update if exists, otherwise add
    const index = entries.findIndex(e => e.id === newEntry.id);
    if (index !== -1) {
        entries[index] = newEntry;
    } else {
        entries.unshift(newEntry); // Newest first
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return newEntry;
};

export const deleteEntry = (id) => {
    const entries = getEntries();
    const filtered = entries.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

// Seed some data if empty
export const seedData = () => {
    if (getEntries().length === 0) {
        const demoData = [
            {
                id: '1',
                name: 'High Mountain Oolong',
                origin: 'Alishan, Taiwan',
                type: 'Oolong',
                vendor: 'Floating Leaves',
                rating: 5,
                date: '2024-05-20',
                flavors: ['Floral', 'Creamy', 'Vegetal'],
                brewing: { temp: 95, time: 50, ratio: '1g/15ml' },
                notes: 'Absolutely stunning milky texture. The floral aroma fills the room.',
                image: null
            },
            {
                id: '2',
                name: 'Longjing (Dragon Well)',
                origin: 'Hangzhou, China',
                type: 'Green',
                vendor: 'Teavivre',
                rating: 4,
                date: '2024-04-10',
                flavors: ['Chestnut', 'Vegetal', 'Sweet'],
                brewing: { temp: 80, time: 60, ratio: '1g/50ml' },
                notes: 'Classic nutty flavor. Needs cooler water to avoid bitterness.',
                image: null
            }
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));
    }
};
