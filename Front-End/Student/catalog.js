// Catalog front-end: search, suggestions, filters, cards, detail modal, request integration
(function(){
  const API_URL = 'http://localhost/Library-Management-System/Back-End';
  const searchInput = document.getElementById('catalogSearch');
  const suggestionsEl = document.getElementById('suggestions');
  const publisherSelect = document.getElementById('filterPublisher');
  const sortSelect = document.getElementById('sortSelect');
  const chipsEl = document.getElementById('chips');
  const cardsGrid = document.getElementById('cardsGrid');
  const noBooks = document.getElementById('noBooks');

  const detailModal = document.getElementById('detailModal');
  const modalClose = document.getElementById('modalClose');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalAuthor = document.getElementById('modalAuthor');
  const modalPublisher = document.getElementById('modalPublisher');
  const modalPages = document.getElementById('modalPages');
  const modalSerial = document.getElementById('modalSerial');
  const modalSummary = document.getElementById('modalSummary');
  const modalCover = document.getElementById('modalCover');
  const modalRequestBtn = document.getElementById('modalRequestBtn');

  const REQ_KEY = 'student_requests';
  // Load books from MySQL API instead of local BOOKS_DATABASE
  let books = [];
  // Local student info (read from localStorage) to avoid depending on window.student property
  const student = JSON.parse(localStorage.getItem('student') || 'null');
  let activeChip = '';
  let currentDetailBookId = null;

  // Initialize when page loads
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
        populatePublishers();
        populateChips();
        renderBooks();
      }
    } catch (error) {
      console.error('Error loading books from API:', error);
    }
  }

  function escapeHtml(s){ if(s===null||s===undefined) return ''; return String(s).replace(/[&<>'"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[m]); }
  // Generate an SVG data URL as a placeholder cover (shows initial letter and a subtle gradient)
  function generateCoverDataUrl(title){
    const letter = (title||'?').charAt(0).toUpperCase();
    const bg1 = '#ececff';
    const bg2 = '#e6f0ff';
    const svg = `<?xml version='1.0' encoding='UTF-8'?>\n<svg xmlns='http://www.w3.org/2000/svg' width='360' height='480' viewBox='0 0 360 480'>\n  <defs>\n    <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>\n      <stop offset='0' stop-color='${bg1}' />\n      <stop offset='1' stop-color='${bg2}' />\n    </linearGradient>\n  </defs>\n  <rect width='100%' height='100%' fill='url(#g)' rx='12'/>\n  <text x='50%' y='52%' font-family='Segoe UI, Arial, sans-serif' font-size='120' fill='#b6c1ff' dominant-baseline='middle' text-anchor='middle'>${letter}</text>\n</svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  // Build publishers list
  function populatePublishers(){
    const pubs = Array.from(new Set(books.map(b => b.publisher).filter(Boolean))).sort();
    publisherSelect.innerHTML = '<option value="">All Publishers</option>' + pubs.map(p => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join('');
  }

  // Create chips for popular authors or categories (using publisher as a proxy)
  function populateChips(){
    const pubs = Array.from(new Set(books.map(b=>b.publisher).filter(Boolean))).slice(0,8);
    chipsEl.innerHTML = '';
    pubs.forEach(p => {
      const btn = document.createElement('button');
      btn.className = 'chip';
      btn.textContent = p;
      btn.addEventListener('click', () => {
        if(activeChip === p){ activeChip = ''; btn.classList.remove('active'); } else { activeChip = p; document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active')); btn.classList.add('active'); }
        renderBooks();
      });
      chipsEl.appendChild(btn);
    });
  }

  // Debounce helper
  function debounce(fn, wait){ let t; return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn.apply(this,args),wait); }; }

  // Suggestions (simple prefix match on title/author)
  function showSuggestions(q){
    const val = (q||'').trim().toLowerCase();
    if(!val){ suggestionsEl.style.display='none'; suggestionsEl.setAttribute('aria-hidden','true'); return; }
    const matches = books.filter(b => ((b.name||'')+" "+(b.author||'')).toLowerCase().includes(val)).slice(0,8);
    if(matches.length===0){ suggestionsEl.style.display='none'; suggestionsEl.setAttribute('aria-hidden','true'); return; }
    suggestionsEl.innerHTML = matches.map(m => `<div class="item" data-serial="${escapeHtml(m.serial||'')}"><strong>${escapeHtml(m.name)}</strong><div style="font-size:12px;color:#666">${escapeHtml(m.author||'')}</div></div>`).join('');
    suggestionsEl.style.display='block'; suggestionsEl.setAttribute('aria-hidden','false');
    Array.from(suggestionsEl.querySelectorAll('.item')).forEach(it => {
      it.addEventListener('click', (ev)=>{
        const s = it.getAttribute('data-serial');
        openDetailBySerial(s);
        suggestionsEl.style.display='none';
      });
    });
  }

  const debouncedSuggest = debounce((e)=>{ showSuggestions(e.target.value); renderBooks(); }, 180);

  // Render cards
  function renderBooks(){
    const q = (searchInput.value||'').trim().toLowerCase();
    const pub = publisherSelect.value;
    const sort = sortSelect.value;

    let filtered = books.filter(b => {
      if(activeChip && String(b.publisher) !== String(activeChip)) return false;
      if(pub && String(b.publisher) !== String(pub)) return false;
      if(!q) return true;
      const hay = ((b.name||'') + ' ' + (b.author||'') + ' ' + (b.publisher||'')).toLowerCase();
      return hay.includes(q);
    });

    if(sort === 'title') filtered.sort((a,b)=>String(a.name||'').localeCompare(String(b.name||'')));
    if(sort === 'author') filtered.sort((a,b)=>String(a.author||'').localeCompare(String(b.author||'')));

    cardsGrid.innerHTML = '';
    if(filtered.length === 0){ noBooks.style.display='block'; return; } else { noBooks.style.display='none'; }

      filtered.forEach((b, idx) => {
        const div = document.createElement('div'); div.className = 'card';
        const coverSrc = b.coverUrl || generateCoverDataUrl(b.name || b.title || '?');
        div.innerHTML = `
          <div class="cover-placeholder"><img class="cover-img" src="${escapeHtml(coverSrc)}" alt="Cover for ${escapeHtml(b.name||'')}"></div>
          <h3>${escapeHtml(b.name||'Untitled')}</h3>
          <div class="meta">${escapeHtml(b.author||'Unknown')}</div>
          <div class="meta">${escapeHtml(b.publisher||'-')}</div>
          <div class="actions">
            <button class="btn" data-serial="${escapeHtml(b.serial||idx)}">Details</button>
            <button class="btn btn-primary" data-req="${escapeHtml(b.serial||idx)}">Request</button>
          </div>
        `;
      // Details click
      div.querySelector('button').addEventListener('click', ()=> openDetailBySerial(b.serial || idx));
      // Request click
      div.querySelector('.btn-primary').addEventListener('click', ()=> requestBookBySerial(b.serial || idx));

      cardsGrid.appendChild(div);
    });
  }

  // Modal helpers
  function openModal(){ detailModal.setAttribute('aria-hidden','false'); detailModal.style.display='flex'; }
  function closeModal(){ detailModal.setAttribute('aria-hidden','true'); detailModal.style.display='none'; }

  function openDetailBySerial(serial){
    const book = books.find(b => String(b.serial) === String(serial) ) || books[Number(serial)] || null;
    if(!book) return alert('Book not found');
    currentDetailBookId = String(book.serial||book.name||Date.now());
    modalTitle.textContent = book.name || '-';
    modalAuthor.textContent = book.author || '-';
    modalPublisher.textContent = book.publisher || '-';
    modalPages.textContent = book.pages || '-';
    modalSerial.textContent = book.serial || '-';
    modalSummary.textContent = book.summary || (book.name ? 'No summary available.' : '');
  // Show cover image or generated placeholder in modal
  const modalCoverSrc = book.coverUrl || generateCoverDataUrl(book.name || book.title || '?');
  modalCover.innerHTML = `<img src="${escapeHtml(modalCoverSrc)}" alt="Cover for ${escapeHtml(book.name||'') }" style="width:100%;height:100%;object-fit:cover;border-radius:6px;">`;

    // update request button state
    const reqs = JSON.parse(localStorage.getItem(REQ_KEY) || '[]');
    const already = reqs.some(r => String(r.studentId) === String(student && student.id) && String(r.bookId) === String(book.serial||book.name));
    modalRequestBtn.disabled = already;
    modalRequestBtn.textContent = already ? 'Requested' : 'Request';

    openModal();
  }

  modalClose.addEventListener('click', closeModal);
  modalCloseBtn.addEventListener('click', closeModal);

  modalRequestBtn.addEventListener('click', ()=>{
    if(!currentDetailBookId) return;
    requestBookBySerial(currentDetailBookId);
    // disable after request
    modalRequestBtn.disabled = true; modalRequestBtn.textContent = 'Requested';
  });

  // Request function: same pattern as student-dashboard
  function requestBookBySerial(serial){
    if(!student || !student.id){ alert('Please login'); return; }
    const id = String(serial);
    const book = books.find(b => String(b.serial) === id) || books[Number(id)] || null;
    const reqs = JSON.parse(localStorage.getItem(REQ_KEY) || '[]');
    const already = reqs.some(r => String(r.studentId) === String(student.id) && String(r.bookId) === id);
    if(already){ alert('Already requested'); return; }
    const newReq = { studentId: student.id, bookId: id, bookName: book ? (book.name||'-') : '-', author: book ? (book.author||'-') : '-', requestedAt: Date.now(), status:'pending' };
    reqs.push(newReq); localStorage.setItem(REQ_KEY, JSON.stringify(reqs));
    alert('Requested successfully');
    // re-render to update state
    renderBooks();
  }

  // wire events
  searchInput.addEventListener('input', debouncedSuggest);
  searchInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); renderBooks(); suggestionsEl.style.display='none'; } });
  publisherSelect.addEventListener('change', renderBooks);
  sortSelect.addEventListener('change', renderBooks);
  document.addEventListener('click', (e)=>{ if(!suggestionsEl.contains(e.target) && e.target !== searchInput) { suggestionsEl.style.display='none'; } });

  // Initialisation
  function init(){
    // add small summary fallback if missing
    books = books.map(b => ({ summary: b.summary || '', ...b }));
    populatePublishers(); populateChips(); renderBooks();

    // Fill header student info
    if(student){ document.getElementById('studentName').textContent = student.name || 'Student'; document.getElementById('studentEmail').textContent = student.email || ''; }

    // Populate total count in hero
    const totalCountEl = document.getElementById('totalCount');
    if(totalCountEl) totalCountEl.textContent = books.length || 0;

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn) logoutBtn.addEventListener('click', ()=>{ localStorage.removeItem('student'); window.location.href = '../Login-system/student-login.html'; });
  }

  // Expose small helper for external code
  window.openCatalogDetail = openDetailBySerial;

  document.addEventListener('DOMContentLoaded', init);
})();
