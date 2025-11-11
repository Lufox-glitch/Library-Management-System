// ...existing code...
(function(){
  const addBtn = document.getElementById('add');
  const clearBtn = document.getElementById('clearAll');
  const searchBtn = document.getElementById('searchBtn');
  const searchBox = document.getElementById('searchBox');
  const tabs = document.getElementById('tabs');
  const countEl = document.getElementById('count');

  let books = JSON.parse(localStorage.getItem('librarian_books') || '[]');

  function save(){ localStorage.setItem('librarian_books', JSON.stringify(books)); }
  function updateCount(){ countEl.textContent = books.length; }

  function render(){
    tabs.innerHTML = '';
    if(books.length === 0){
      tabs.innerHTML = '<tr class="empty"><td colspan="6">No books yet. Add one using the form.</td></tr>';
      updateCount();
      return;
    }
    books.slice().reverse().forEach((b, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(b.name)}</td>
        <td>${escapeHtml(b.author)}</td>
        <td>${escapeHtml(b.publisher || '-')}</td>
        <td>${escapeHtml(b.pages || '-')}</td>
        <td>${escapeHtml(b.serial || '-')}</td>
        <td class="actions-col">
          <button data-i="${books.length - 1 - idx}" class="icon-btn danger btn-delete" title="Delete"><i class="fas fa-trash-alt"></i></button>
        </td>
      `;
      tabs.appendChild(tr);
    });
    updateCount();
  }

  function escapeHtml(s){
    if(!s && s !== 0) return '';
    return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  addBtn.addEventListener('click', () => {
    const name = document.getElementById('bookName').value.trim();
    const author = document.getElementById('authorName').value.trim();
    const publisher = document.getElementById('publisherName').value.trim();
    const pages = document.getElementById('numberPage').value.trim();
    const serial = document.getElementById('serialNumber').value.trim();

    if(!name || !author){
      alert('Please provide at least Book Name and Author.');
      return;
    }

    books.push({ name, author, publisher, pages: pages || '-', serial: serial || '-' });
    save();
    render();
    document.getElementById('addForm').reset();
    document.getElementById('bookName').focus();
  });

  clearBtn.addEventListener('click', () => {
    if(!books.length) return;
    if(confirm('Clear all books?')){ books = []; save(); render(); }
  });

  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-delete');
    if(!btn) return;
    const idx = Number(btn.getAttribute('data-i'));
    if(Number.isNaN(idx)) return;
    if(confirm('Delete this book?')){
      books.splice(idx,1);
      save();
      render();
    }
  });

  function searchTable(){
    const q = (searchBox.value || '').trim().toLowerCase();
    if(!q){ render(); return; }
    // simple filter on client-side array
    const matched = books.filter(b => {
      return [b.name,b.author,b.publisher,b.pages,b.serial].join(' ').toLowerCase().includes(q);
    });
    tabs.innerHTML = '';
    if(matched.length === 0){
      tabs.innerHTML = '<tr class="empty"><td colspan="6">No results found.</td></tr>';
      return;
    }
    matched.slice().reverse().forEach((b, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(b.name)}</td>
        <td>${escapeHtml(b.author)}</td>
        <td>${escapeHtml(b.publisher || '-')}</td>
        <td>${escapeHtml(b.pages || '-')}</td>
        <td>${escapeHtml(b.serial || '-')}</td>
        <td><button class="icon-btn" disabled title="Search result"><i class="fas fa-search"></i></button></td>
      `;
      tabs.appendChild(tr);
    });
  }

  searchBtn.addEventListener('click', searchTable);
  searchBox.addEventListener('keydown', (e) => { if(e.key === 'Enter') searchTable(); });

  // initial render
  render();
})();
 // ...existing code...