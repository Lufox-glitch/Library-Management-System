const API_URL = 'https://lufox-pratik.gamer.gd/Back-End';

// add safe BOOKS variable and loader
let BOOKS = [];
function ensureBooks() {
  if (typeof BOOKS_DATABASE !== 'undefined' && Array.isArray(BOOKS_DATABASE)) {
    BOOKS = BOOKS_DATABASE;
  } else {
    console.warn('BOOKS_DATABASE is not defined. Make sure ../Librarian/book-data.js is present and defines BOOKS_DATABASE.');
    BOOKS = []; // fallback empty list
  }
}

// Load student data from localStorage
document.addEventListener('DOMContentLoaded', function() {
  // ensure books loaded before rendering
  ensureBooks();

  // Load student info from localStorage
  const student = JSON.parse(localStorage.getItem('student'));
  if (student) {
    document.getElementById('studentName').textContent = student.name || 'Student';
    document.getElementById('studentEmail').textContent = student.email || 'email@example.com';
    document.getElementById('studentId').textContent = student.id || 'S001';
    document.getElementById('welcomeName').textContent = student.name?.split(' ')[0] || 'Student';
  }

  // Load books into table
  loadBooksToStudentTable();
  
  // Search functionality
  document.getElementById('searchBtn').addEventListener('click', handleSearch);
  document.getElementById('clearBtn').addEventListener('click', handleClear);
  document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);

  // Display initial requests
  displayStudentRequests();
});

// Load books to student table
function loadBooksToStudentTable() {
  const tbody = document.getElementById('booksTableBody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  if (!BOOKS || BOOKS.length === 0) {
    tbody.innerHTML = '<tr class="empty-state"><td colspan="5" style="text-align: center; padding: 40px;"><i class="fas fa-inbox" style="font-size: 32px; opacity: 0.3; margin-bottom: 10px; display: block;"></i>No books available yet.</td></tr>';
    return;
  }

  BOOKS.forEach(book => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="book-title"><i class="fas fa-book"></i> ${escapeHtml(book.name)}</td>
      <td>${escapeHtml(book.author)}</td>
      <td>${escapeHtml(book.publisher || '-')}</td>
      <td>${escapeHtml(book.pages || '-')}</td>
      <td>
        <button class="btn-request" onclick="requestBook('${book.name.replace(/'/g, "\\'")}')">
          <i class="fas fa-plus"></i> Request
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Search books
function handleSearch() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const tbody = document.getElementById('booksTableBody');
  const noResults = document.getElementById('noResults');
  
  if (!query) {
    loadBooksToStudentTable();
    if (noResults) noResults.style.display = 'none';
    return;
  }

  if (!BOOKS || BOOKS.length === 0) {
    if (noResults) noResults.style.display = 'block';
    tbody.innerHTML = '';
    return;
  }

  const filtered = BOOKS.filter(book =>
    book.name.toLowerCase().includes(query) ||
    book.author.toLowerCase().includes(query) ||
    (book.publisher || '').toLowerCase().includes(query)
  );

  tbody.innerHTML = '';
  if (filtered.length === 0) {
    if (noResults) noResults.style.display = 'block';
  } else {
    if (noResults) noResults.style.display = 'none';
    filtered.forEach(book => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="book-title"><i class="fas fa-book"></i> ${escapeHtml(book.name)}</td>
        <td>${escapeHtml(book.author)}</td>
        <td>${escapeHtml(book.publisher || '-')}</td>
        <td>${escapeHtml(book.pages || '-')}</td>
        <td>
          <button class="btn-request" onclick="requestBook('${book.name.replace(/'/g, "\\'")}')">
            <i class="fas fa-plus"></i> Request
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }
}

// Clear search
function handleClear() {
  document.getElementById('searchInput').value = '';
  loadBooksToStudentTable();
  document.getElementById('noResults').style.display = 'none';
}

// Escape HTML
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Request book
function requestBook(bookName) {
  const student = JSON.parse(localStorage.getItem('student'));
  const requests = JSON.parse(localStorage.getItem('student_requests')) || [];
  
  const request = {
    id: Date.now(),
    studentId: student.id,
    studentName: student.name,
    bookName: bookName,
    requestDate: new Date().toLocaleDateString(),
    status: 'Pending'
  };
  
  requests.push(request);
  localStorage.setItem('student_requests', JSON.stringify(requests));
  
  alert(`✅ Book "${bookName}" requested successfully!`);
  displayStudentRequests();
}

// Display student requests
function displayStudentRequests() {
  const student = JSON.parse(localStorage.getItem('student'));
  const requests = JSON.parse(localStorage.getItem('student_requests')) || [];
  const requestList = document.getElementById('requestList');
  
  const studentRequests = requests.filter(r => r.studentId === student.id);
  
  if (studentRequests.length === 0) {
    requestList.innerHTML = `
      <div class="no-requests">
        <i class="fas fa-smile-wink"></i> No requests yet. Start requesting books!
      </div>
    `;
    return;
  }

  requestList.innerHTML = studentRequests.map(req => `
    <div class="request-item">
      <div class="request-info">
        <h4>${escapeHtml(req.bookName)}</h4>
        <p><strong>Requested:</strong> ${req.requestDate}</p>
      </div>
      <div class="request-status ${req.status.toLowerCase()}">
        ${req.status}
      </div>
    </div>
  `).join('');
}

// Logout
function handleLogout() {
  localStorage.removeItem('student');
  window.location.href = '../Login-system/student-login.html';
}