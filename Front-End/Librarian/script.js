// ...existing code...
(function(){
  const API_URL = 'http://localhost/Library-Management-System/Back-End';
  const addBtn = document.getElementById('add');
  const searchBtn = document.getElementById('searchBtn');
  const searchBox = document.getElementById('searchBox');
  const tabs = document.getElementById('tabs');
  const countEl = document.getElementById('count');

  let books = [];
  let isSearching = false;

  // Load books from MySQL API on page load
  document.addEventListener('DOMContentLoaded', () => {
    loadBooksFromAPI();
  });

  // Load books from MySQL via API
  async function loadBooksFromAPI() {
    try {
      const response = await fetch(`${API_URL}/api/books.php?action=list&limit=1000`);
      const data = await response.json();
      
      if (data.success && data.books) {
        books = data.books;
        updateCount();
        render();
      }
    } catch (error) {
      console.error('Error loading books from API:', error);
    }
  }

  function save(){ 
    // Books are saved in MySQL, not localStorage
    console.log('Books are synced with MySQL database');
  }

  function updateCount(){ 
    if (countEl) {
      countEl.textContent = books.length;
    }
  }

  function escapeHtml(s){
    if(!s && s !== 0) return '';
    return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  function render(booksToRender = null){
    const booksArray = booksToRender || books;
    tabs.innerHTML = '';
    
    if(booksArray.length === 0){
      tabs.innerHTML = '<tr class="empty"><td colspan="6"><i class="fas fa-inbox"></i> No books found.</td></tr>';
      return;
    }

    // Only reverse if rendering the FULL list (not filtered)
    const iterateArray = booksToRender ? booksArray : booksArray.slice().reverse();

    iterateArray.forEach((b, idx) => {
      const actualIdx = booksToRender ? books.indexOf(b) : books.length - 1 - idx;
      const tr = document.createElement('tr');
      tr.className = 'book-row';
      tr.innerHTML = `
        <td class="book-name"><i class="fas fa-book"></i> ${escapeHtml(b.name)}</td>
        <td>${escapeHtml(b.author)}</td>
        <td>${escapeHtml(b.publisher || '-')}</td>
        <td class="pages-col">${escapeHtml(b.pages || '-')}</td>
        <td class="serial-col">${escapeHtml(b.serial || '-')}</td>
        <td class="actions-col">
          <button class="btn-delete" data-idx="${actualIdx}" title="Delete this book">
            <i class="fas fa-trash-alt"></i> Remove
          </button>
        </td>
      `;
      tabs.appendChild(tr);
    });

    // Add delete event listeners
    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', deleteBook);
    });
  }

  // Delete book function
  function deleteBook(e) {
    const btn = e.currentTarget;
    const idx = Number(btn.getAttribute('data-idx'));
    
    if(isNaN(idx)) return;
    
    if(confirm(`Delete "${books[idx].name}"?`)){
      books.splice(idx, 1);
      save();
      updateCount();
      
      if(isSearching) {
        searchTable();  // Re-search to update results
      } else {
        render();
      }
      showNotification('✅ Book deleted!');
    }
  }

  // Add book
  addBtn.addEventListener('click', () => {
    const name = document.getElementById('bookName').value.trim();
    const author = document.getElementById('authorName').value.trim();
    const publisher = document.getElementById('publisherName').value.trim();
    const pages = document.getElementById('numberPage').value.trim();
    const serial = document.getElementById('serialNumber').value.trim();

    if(!name || !author){
      alert('⚠️ Please provide at least Book Name and Author.');
      return;
    }

    books.push({ 
      name, 
      author, 
      publisher: publisher || '-', 
      pages: pages || '-',
      serial: serial || '-'
    });
    save();
    updateCount();
    
    if(!isSearching) render();
    
    document.getElementById('addForm').reset();
    document.getElementById('bookName').focus();
    
    showNotification('✅ Book added successfully!');
  });

  // Search functionality
  function searchTable(){
    const q = (searchBox.value || '').trim().toLowerCase();
    
    if(!q){ 
      isSearching = false;
      render(); 
      return; 
    }

    isSearching = true;
    const matched = books.filter(b => {
      const searchFields = [b.name, b.author, b.publisher, String(b.pages), String(b.serial)].join(' ').toLowerCase();
      return searchFields.includes(q);
    });

    if(matched.length === 0){
      tabs.innerHTML = '<tr class="empty"><td colspan="6"><i class="fas fa-search"></i> No results for "' + escapeHtml(q) + '"</td></tr>';
      return;
    }

    render(matched);
  }

  searchBtn.addEventListener('click', searchTable);
  searchBox.addEventListener('keydown', (e) => { 
    if(e.key === 'Enter') searchTable(); 
  });
  searchBox.addEventListener('input', () => {
    if(searchBox.value === '') {
      isSearching = false;
      render();  // Re-render full list (will be reversed)
    }
  });

  // Clear search button
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      searchBox.value = '';
      isSearching = false;
      render(null);
      searchBox.focus();
    });
  }

  // Show notification
  function showNotification(msg) {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = msg;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
  }

  // Initialize: Load books from localStorage or BOOKS_DATABASE
  function initializeBooks() {
    if (books.length === 0 && typeof BOOKS_DATABASE !== 'undefined' && BOOKS_DATABASE.length > 0) {
      books = BOOKS_DATABASE.map(b => ({
        name: b.name || '',
        author: b.author || '',
        publisher: b.publisher || '-',
        pages: b.pages || '-',
        serial: b.serial || '-'
      }));
      save();
    }
    updateCount();
    render();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBooks);
  } else {
    initializeBooks();
  }
})();

// Replace the broken initialization code with a proper logout handler and safe DOM-ready init
document.addEventListener('DOMContentLoaded', function() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      if (!confirm('Are you sure you want to logout?')) return;
      // Remove any login/session flag your app uses (adjust key name if needed)
      localStorage.removeItem('librarian_logged_in');
      // Optionally clear other session-only data:
      // localStorage.removeItem('currentLibrarian');
      // Redirect to main page / login page
      window.location.href = '../../index.html';
    });
  }

  // Safe initialization already handled inside the IIFE; nothing else required here.
});