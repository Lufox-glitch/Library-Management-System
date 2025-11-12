const API_URL = 'https://lufox-pratik.gamer.gd/Back-End';

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

    // Event listeners
    document.getElementById('searchBtn').addEventListener('click', handleSearch);
    document.getElementById('clearBtn').addEventListener('click', clearSearch);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
});

// Load books from API
async function loadBooks() {
    try {
        const response = await fetch(`${API_URL}/get_books.php`);
        const data = await response.json();
        
        if (data.success && data.books) {
            return data.books;
        }
    } catch (error) {
        console.error('Error loading books:', error);
    }
}

function loadBooksToStudentTable() {
  const tbody = document.getElementById('booksTableBody');
  if (!tbody) return;
  
  // Clear existing rows
  tbody.innerHTML = '';
  
  // Check if BOOKS_DATABASE is available
  if (typeof BOOKS_DATABASE === 'undefined' || !Array.isArray(BOOKS_DATABASE)) {
    console.warn('BOOKS_DATABASE not found');
    document.getElementById('noResults').style.display = 'block';
    return;
  }
  
  // Populate table with books
  BOOKS_DATABASE.forEach(book => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${book.name || ''}</td>
      <td>${book.author || ''}</td>
      <td>${book.publisher || ''}</td>
      <td>${book.pages || ''}</td>
      <td>${book.serial || ''}</td>
      <td>
        <button class="request-btn" onclick="requestBook(${book.serial})">
          <i class="fas fa-plus"></i> Request
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
  
  document.getElementById('noResults').style.display = 'none';
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
    alert('Book request feature coming soon!');
    // TODO: implement book request API call
}

function handleLogout() {
    localStorage.removeItem('student');
    alert('Logged out successfully');
    window.location.href = '../Login-system/student-login.html';
}