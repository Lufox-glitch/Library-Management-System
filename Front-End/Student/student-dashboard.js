const API_URL = 'http://localhost/Library-Management-System/Back-End';

// Load student data from localStorage
document.addEventListener('DOMContentLoaded', function() {
    const student = JSON.parse(localStorage.getItem('student'));
    
    if (!student) {
        window.location.href = '../Login-system/student-login.html';
        return;
    }

    // Display student info
    document.getElementById('studentName').textContent = student.name || 'Student';
    document.getElementById('studentEmail').textContent = student.email || 'N/A';
    document.getElementById('studentId').textContent = student.id || 'N/A';
    document.getElementById('welcomeName').textContent = student.name || 'Student';

    // Load books to table
    loadBooksToStudentTable();
    
    // Load student requests from API
    loadStudentRequests();

    // Event listeners
    document.getElementById('searchBtn').addEventListener('click', handleSearch);
    document.getElementById('clearBtn').addEventListener('click', clearSearch);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Toggle requests section
    const requestToggleBtn = document.getElementById('requestToggleBtn');
    if (requestToggleBtn) {
        requestToggleBtn.addEventListener('click', function() {
            const section = document.querySelector('.requests-section');
            if (section) {
                const isHidden = section.style.display === 'none';
                section.style.display = isHidden ? 'block' : 'none';
                if (isHidden) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }
});

// Load books from MySQL API
async function loadBooks() {
    try {
        const response = await fetch(`${API_URL}/api/books.php?action=list&limit=1000`);
        const data = await response.json();
        
        if (data.success && data.books) {
            return data.books;
        }
    } catch (error) {
        console.error('Error loading books from API:', error);
        return [];
    }
}

// Load student's book requests from API
async function loadStudentRequests() {
    try {
        const response = await fetch(`${API_URL}/api/requests.php?action=list`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success && data.requests) {
            displayStudentRequests(data.requests);
        }
    } catch (error) {
        console.error('Error loading requests:', error);
    }
}

// Display student requests
function displayStudentRequests(requests) {
    const requestList = document.querySelector('.requests-section');
    if (!requestList) return;
    
    if (!requests || requests.length === 0) {
        requestList.innerHTML = '<div class="no-requests">No book requests yet. Start requesting books!</div>';
        return;
    }
    
    let html = '<div class="request-items">';
    requests.forEach(req => {
        html += `
            <div class="request-item" style="padding:12px;border:1px solid #eee;margin-bottom:8px;border-radius:6px;display:flex;justify-content:space-between;align-items:center;">
                <div style="flex:1">
                    <strong>${req.book_name || '-'}</strong>
                    <div style="color:#666;font-size:0.9em">${req.author || '-'}</div>
                    <div style="color:#888;font-size:0.8em">Status: <span style="font-weight:bold;color:${req.status === 'pending' ? '#ff6b6b' : '#51cf66'}">${req.status}</span></div>
                    ${req.due_date ? `<div style="color:#888;font-size:0.8em">Due: ${new Date(req.due_date).toLocaleDateString()}</div>` : ''}
                </div>
                <div style="margin-left:12px">
                    ${req.status === 'pending' ? `<button class="btn-cancel" data-request-id="${req.id}" style="background:#f2f2f2;border:1px solid #ddd;padding:6px 10px;border-radius:4px;cursor:pointer;">Cancel</button>` : '<button disabled style="background:#f2f2f2;border:1px solid #ddd;padding:6px 10px;border-radius:4px;color:#999;">Approved</button>'}
                </div>
            </div>
        `;
    });
    html += '</div>';
    requestList.innerHTML = html;
    
    // Attach cancel handlers
    document.querySelectorAll('.btn-cancel').forEach(btn => {
        btn.addEventListener('click', function() {
            const requestId = this.getAttribute('data-request-id');
            cancelStudentRequest(requestId);
        });
    });
    
    // Update request count
    const requestCount = document.getElementById('requestCount');
    if (requestCount) {
        requestCount.textContent = requests.length;
    }
}

async function loadBooksToStudentTable() {
  const tbody = document.getElementById('booksTableBody');
  if (!tbody) return;
  
  // Clear existing rows
  tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Loading books...</td></tr>';
  
  // Load books from MySQL API
  const books = await loadBooks();
  
  if (!books || books.length === 0) {
    console.warn('No books found from API');
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No books available</td></tr>';
    return;
  }
  
  // Populate table with books from MySQL
  books.forEach(book => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${book.name || ''}</td>
      <td>${book.author || ''}</td>
      <td>${book.publisher || ''}</td>
      <td>${book.pages || ''}</td>
      <td>${book.serial || ''}</td>
      <td>
        <button class="request-btn" onclick="requestBook(${book.id})">
          <i class="fas fa-plus"></i> Request
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function displayBooks(books) {
    const tbody = document.getElementById('booksTableBody');
    tbody.innerHTML = '';
    
    books.forEach(book => {
        const row = `
            <tr>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.publisher}</td>
                <td>${book.pages}</td>
                <td>${book.serial_number}</td>
                <td>
                    <button class="btn-request" onclick="requestBook(${book.id})">
                        <i class="fas fa-plus"></i> Request
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#booksTableBody tr');
    let found = false;

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
            found = true;
        } else {
            row.style.display = 'none';
        }
    });

    document.getElementById('noResults').style.display = found ? 'none' : 'block';
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.querySelectorAll('#booksTableBody tr').forEach(row => {
        row.style.display = '';
    });
    document.getElementById('noResults').style.display = 'none';
}

function requestBook(bookId) {
    const student = JSON.parse(localStorage.getItem('student'));
    
    if (!student || !student.id) {
        alert('Please login first');
        return;
    }

    // Call API to request book
    fetch(`${API_URL}/api/requests.php?action=create`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book_id: bookId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('✅ Book requested successfully!');
            loadBooksToStudentTable(); // Reload to show updated status
            loadStudentRequests(); // Load requests
        } else {
            alert('❌ ' + (data.error || 'Failed to request book'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('❌ Error requesting book');
    });
}

function handleLogout() {
    localStorage.removeItem('student');
    alert('Logged out successfully');
    window.location.href = '../Login-system/student-login.html';
}

// Cancel a book request
function cancelStudentRequest(requestId) {
    if (!confirm('Are you sure you want to cancel this request?')) {
        return;
    }
    
    fetch(`${API_URL}/api/requests.php?action=cancel`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: requestId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('✅ Request cancelled successfully');
            loadStudentRequests(); // Reload requests
        } else {
            alert('❌ ' + (data.error || 'Failed to cancel request'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('❌ Error cancelling request');
    });
}

(function () {
  // Simple helper
  const $ = (sel) => document.querySelector(sel);
  const booksTableBody = document.getElementById('booksTableBody');
  const requestList = document.getElementById('requestList');
  const noRequestsHtml = '<div class="no-requests"><i class="fas fa-smile-wink" style="font-size: 32px; margin-bottom: 10px; display: block; color: #ccc;"></i>No requests yet. Start requesting books!</div>';

  // Keys
  const REQ_KEY = 'student_requests';

  // Load current student (HTML already checks but we need data)
  const student = JSON.parse(localStorage.getItem('student') || 'null');

  // header controls we added
  const requestToggleBtn = document.getElementById('requestToggleBtn');
  const requestCountEl = document.getElementById('requestCount');

  function saveRequests(reqs) {
    localStorage.setItem(REQ_KEY, JSON.stringify(reqs || []));
  }
  function loadRequests() {
    return JSON.parse(localStorage.getItem(REQ_KEY) || '[]');
  }

  function getBookId(book, idx) {
    // Use serial if available, otherwise fallback to index-based id
    return (book.serial && String(book.serial).trim()) || `idx-${idx}`;
  }

  function renderBooks() {
    const books = (typeof BOOKS_DATABASE !== 'undefined' && Array.isArray(BOOKS_DATABASE)) ? BOOKS_DATABASE : [];
    const requests = loadRequests().filter(r => r.studentId === (student && student.id));
    booksTableBody.innerHTML = '';

    if (books.length === 0) {
      booksTableBody.innerHTML = '<tr><td colspan="6" style="color:#777;text-align:center;"><i class="fas fa-inbox"></i> No books available.</td></tr>';
      return;
    }

    books.forEach((b, idx) => {
      const bookId = getBookId(b, idx);
      const alreadyRequested = requests.some(r => r.bookId === bookId);
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td class="book-name"><i class="fas fa-book"></i> ${escapeHtml(b.name || '-')}</td>
        <td>${escapeHtml(b.author || '-')}</td>
        <td>${escapeHtml(b.publisher || '-')}</td>
        <td class="pages-col">${escapeHtml(b.pages || '-')}</td>
        <td class="serial-col">${escapeHtml(b.serial || '-')}</td>
        <td class="actions-col">
          <button class="btn-request" data-bookid="${escapeHtml(bookId)}" ${alreadyRequested ? 'disabled' : ''}>
            <i class="fas fa-paper-plane"></i> ${alreadyRequested ? 'Requested' : 'Request'}
          </button>
        </td>
      `;
      booksTableBody.appendChild(tr);
    });

    // attach handlers
    document.querySelectorAll('.btn-request').forEach(btn => {
      btn.addEventListener('click', handleRequestClick);
    });
  }

  function renderRequests() {
    const allReqs = loadRequests();
    const myReqs = allReqs.filter(r => r.studentId === (student && student.id));
    if (!myReqs.length) {
      requestList.innerHTML = noRequestsHtml;
      updateRequestCount();
      return;
    }

    requestList.innerHTML = '<div class="request-items"></div>';
    const container = requestList.querySelector('.request-items');

    myReqs.forEach((r, i) => {
      const div = document.createElement('div');
      div.className = 'request-item';
      div.style = 'padding:8px;border:1px solid #eee;margin-bottom:8px;border-radius:6px;display:flex;justify-content:space-between;align-items:center;';
      div.innerHTML = `
        <div style="flex:1">
          <strong>${escapeHtml(r.bookName || r.title || '-')}</strong>
          <div style="color:#666;font-size:0.9em">${escapeHtml(r.author || '-')}</div>
          <div style="color:#888;font-size:0.8em">Requested on: ${new Date(r.requestedAt).toLocaleString()}</div>
        </div>
        <div style="margin-left:12px">
          <button class="btn-cancel" data-bookid="${escapeHtml(r.bookId)}" style="background:#f2f2f2;border:1px solid #ddd;padding:6px 10px;border-radius:4px;cursor:pointer;">Cancel</button>
        </div>
      `;
      container.appendChild(div);
    });

    // attach cancel handlers
    requestList.querySelectorAll('.btn-cancel').forEach(btn => {
      btn.addEventListener('click', cancelRequest);
    });

    updateRequestCount();
  }

  function handleRequestClick(e) {
    const btn = e.currentTarget;
    const bookId = btn.getAttribute('data-bookid');
    if (!student || !student.id) {
      alert('Please login first');
      return;
    }

    const books = (typeof BOOKS_DATABASE !== 'undefined' && Array.isArray(BOOKS_DATABASE)) ? BOOKS_DATABASE : [];
    // Find book by id (match serial or index fallback)
    const book = findBookById(bookId, books);
    const allReqs = loadRequests();
    const already = allReqs.some(r => r.studentId === student.id && r.bookId === bookId);
    if (already) {
      btn.disabled = true;
      btn.textContent = 'Requested';
      updateRequestCount();
      return;
    }

    const newReq = {
      studentId: student.id,
      bookId,
      bookName: book ? (book.name || book.title || '-') : '-',
      author: book ? (book.author || '-') : '-',
      requestedAt: Date.now(),
      status: 'pending'
    };
    allReqs.push(newReq);
    saveRequests(allReqs);

    // update UI
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Requested';
    renderRequests();
    // if requests section hidden, open it
    showRequestsSection();
  }

  function cancelRequest(e) {
    const btn = e.currentTarget;
    const rawBookId = btn.getAttribute('data-bookid');
    const bookId = String(rawBookId);

    if (!confirm('Cancel this request?')) return;

    const allReqs = loadRequests();
    const filtered = allReqs.filter(r => {
      // normalize both sides to string to avoid type mismatches
      return !(String(r.studentId) === String(student && student.id) && String(r.bookId) === bookId);
    });

    // if nothing changed, nothing to do
    if (filtered.length === allReqs.length) {
      console.warn('Request not found for cancellation:', bookId);
      return;
    }

    saveRequests(filtered);
    renderRequests();
    renderBooks();
    updateRequestCount();
  }

  function findBookById(bookId, books) {
    for (let i = 0; i < books.length; i++) {
      const id = getBookId(books[i], i);
      if (String(id) === String(bookId)) return books[i];
    }
    return null;
  }

  // update the small top badge / button state
  function updateRequestCount() {
    if (!requestCountEl) return;
    const cnt = loadRequests().filter(r => r.studentId === (student && student.id)).length;
    requestCountEl.textContent = cnt;
    if (requestToggleBtn) {
      requestToggleBtn.disabled = false; // allow viewing even if zero, optional: disable if zero: cnt === 0
    }
  }

  function toggleRequests() {
    const section = document.querySelector('.requests-section');
    if (!section) return;
    const isHidden = section.style.display === 'none' || section.classList.contains('hidden');
    if (isHidden) {
      section.style.display = 'block';
      section.scrollIntoView({ behavior: 'smooth' });
    } else {
      section.style.display = 'none';
    }
  }

  function showRequestsSection() {
    const section = document.querySelector('.requests-section');
    if (!section) return;
    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth' });
  }

  // minimal escapeHtml (same as other script)
  function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  // init on load
  document.addEventListener('DOMContentLoaded', function () {
    // set student info in header if available
    if (student) {
      const nameEl = document.getElementById('studentName');
      const emailEl = document.getElementById('studentEmail');
      const idEl = document.getElementById('studentId');
      const welcomeEl = document.getElementById('welcomeName');
      if (nameEl) nameEl.textContent = student.name || student.fullname || 'Student';
      if (emailEl) emailEl.textContent = student.email || '';
      if (idEl) idEl.textContent = student.id || '';
      if (welcomeEl) welcomeEl.textContent = student.name || student.fullname || 'Student';
    }

    // wire up header button
    if (requestToggleBtn) {
      requestToggleBtn.addEventListener('click', function (ev) {
        toggleRequests();
      });
    }

    renderBooks();
    renderRequests();
    updateRequestCount();
  });
})();