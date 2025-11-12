// ...existing code...
(function(){
  const addBtn = document.getElementById('add');
  const clearBtn = document.getElementById('clearAll');
  const searchBtn = document.getElementById('searchBtn');
  const searchBox = document.getElementById('searchBox');
  const tabs = document.getElementById('tabs');
  const countEl = document.getElementById('count');

  let books = JSON.parse(localStorage.getItem('librarian_books') || '[]');
  let isSearching = false;

  function save(){ 
    localStorage.setItem('librarian_books', JSON.stringify(books)); 
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
      tabs.innerHTML = '<tr class="empty"><td colspan="5"><i class="fas fa-inbox"></i> No books found.</td></tr>';
      return;
    }

    booksArray.slice().reverse().forEach((b, idx) => {
      const actualIdx = booksToRender ? books.indexOf(b) : books.length - 1 - idx;
      const tr = document.createElement('tr');
      tr.className = 'book-row';
      tr.innerHTML = `
        <td class="book-name"><i class="fas fa-book"></i> ${escapeHtml(b.name)}</td>
        <td>${escapeHtml(b.author)}</td>
        <td>${escapeHtml(b.publisher || '-')}</td>
        <td class="pages-col">${escapeHtml(b.pages || '-')}</td>
        <td class="actions-col">
          <button data-i="${actualIdx}" class="icon-btn danger btn-delete" title="Delete this book">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      `;
      tabs.appendChild(tr);
    });
  }

  // Add book
  addBtn.addEventListener('click', () => {
    const name = document.getElementById('bookName').value.trim();
    const author = document.getElementById('authorName').value.trim();
    const publisher = document.getElementById('publisherName').value.trim();
    const pages = document.getElementById('numberPage').value.trim();

    if(!name || !author){
      alert('⚠️ Please provide at least Book Name and Author.');
      return;
    }

    books.push({ 
      name, 
      author, 
      publisher: publisher || '-', 
      pages: pages || '-' 
    });
    save();
    updateCount();
    
    if(!isSearching) render();
    
    document.getElementById('addForm').reset();
    document.getElementById('bookName').focus();
    
    showNotification('✅ Book added successfully!');
  });

  // Clear all
  clearBtn.addEventListener('click', () => {
    if(!books.length) return;
    if(confirm('🗑️ Are you sure you want to delete all books? This cannot be undone.')){
      books = [];
      save();
      updateCount();
      render();
      showNotification('✅ All books cleared!');
    }
  });

  // Delete individual book
  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-delete');
    if(!btn) return;
    const idx = Number(btn.getAttribute('data-i'));
    if(Number.isNaN(idx)) return;
    if(confirm('Delete this book?')){
      books.splice(idx, 1);
      save();
      updateCount();
      
      if(isSearching) {
        searchTable();
      } else {
        render();
      }
      showNotification('✅ Book deleted!');
    }
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
      const searchFields = [b.name, b.author, b.publisher, String(b.pages)].join(' ').toLowerCase();
      return searchFields.includes(q);
    });

    if(matched.length === 0){
      tabs.innerHTML = '<tr class="empty"><td colspan="5"><i class="fas fa-search"></i> No results for "<strong>' + escapeHtml(q) + '</strong>"</td></tr>';
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
      render();
    }
  });

  // Clear search button
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchBox.value = '';
      isSearching = false;
      render();
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
      // First time: load from BOOKS_DATABASE
      books = BOOKS_DATABASE.map(b => ({
        name: b.name || '',
        author: b.author || '',
        publisher: b.publisher || '-',
        pages: b.pages || '-'
      }));
      save();
    }
    updateCount();
    render();
  }

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    initializeBooks();
  });

  // Also initialize immediately if DOM is already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBooks);
  } else {
    initializeBooks();
  }
})();

// Initialize books on page load
document.addEventListener('DOMContentLoaded', function() {
  loadBooksToTable('tabs');
  updateBookCount();
});

// Update book count
function updateBookCount() {
  const count = document.getElementById('count');
  if (count) {
    count.textContent = BOOKS_DATABASE.length;
  }
}