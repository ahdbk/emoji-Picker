document.addEventListener('DOMContentLoaded', function() {
  const emojiContainer = document.getElementById('emoji-container');
  const tabs = document.querySelectorAll('.tab-btn');
  const searchInput = document.getElementById('search-input');
  let currentCategory = 'smileys-emotion';
  let allEmojis = [];
  let currentEmojis = [];

  // Function to handle theme changes
  function handleThemeChange(e) {
    if (e.matches) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  // Listen for theme changes
  const darkThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  handleThemeChange(darkThemeQuery);
  darkThemeQuery.addListener(handleThemeChange);

  // Function to fetch all emojis
  function fetchAllEmojis() {
    emojiContainer.innerHTML = 'Loading emojis...';
    
    fetch(`https://emoji-api.com/emojis?access_key=1db41f0f1c75ff21e2b59d647db61fd29f2cd1dc`)
      .then(response => response.json())
      .then(data => {
        allEmojis = data;
        loadEmojis(currentCategory);
      })
      .catch(error => {
        emojiContainer.innerHTML = 'Error loading emojis. Please try again later.';
        console.error('Error:', error);
      });
  }
  
  // Function to load emojis for a category
  function loadEmojis(category) {
    if (searchInput.value) {
      // If there's a search term, don't filter by category
      return;
    }
    
    currentEmojis = allEmojis.filter(emoji => 
      emoji.group?.toLowerCase() === category.toLowerCase()
    );
    displayEmojis(currentEmojis);
  }

  // Function to display emojis
  function displayEmojis(emojis) {
    // Remove old animation class
    emojiContainer.classList.remove('emoji-container-slide');
    
    emojiContainer.innerHTML = '';
    
    if (emojis.length === 0) {
      emojiContainer.innerHTML = 'No emojis found';
      return;
    }
    
    // Force reflow
    void emojiContainer.offsetWidth;
    
    // Add animation class
    emojiContainer.classList.add('emoji-container-slide');
    
    emojis.forEach(emojiData => {
      const emojiElement = document.createElement('div');
      emojiElement.className = 'emoji';
      emojiElement.textContent = emojiData.character;
      emojiElement.title = emojiData.unicodeName;
      
      emojiElement.addEventListener('click', () => {
        navigator.clipboard.writeText(emojiData.character);
        
        // Visual feedback
        emojiElement.style.backgroundColor = '#e0e0e0';
        setTimeout(() => {
          emojiElement.style.backgroundColor = '';
        }, 200);
      });

      emojiContainer.appendChild(emojiElement);
    });
  }

  // Search functionality
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    if (!searchTerm) {
      // If search is cleared, show current category
      loadEmojis(currentCategory);
      return;
    }

    // Search through all emojis, not just current category
    const filteredEmojis = allEmojis.filter(emoji => 
      emoji.unicodeName.toLowerCase().includes(searchTerm) ||
      emoji.group?.toLowerCase().includes(searchTerm) ||
      emoji.subGroup?.toLowerCase().includes(searchTerm) ||
      (emoji.tags && emoji.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );
    displayEmojis(filteredEmojis);
  });

  // Add click handlers to tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.dataset.category === currentCategory) return;
      
      // Add click effect
      tab.style.transform = 'scale(0.95)';
      setTimeout(() => {
        tab.style.transform = '';
      }, 100);
      
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Load emojis for selected category
      currentCategory = tab.dataset.category;
      searchInput.value = ''; // Clear search when changing categories
      loadEmojis(currentCategory);
    });
  });

  // Initial load of all emojis
  fetchAllEmojis();
}); 