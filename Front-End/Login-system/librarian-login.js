(function() {
  const API_BASE = 'https://yourdomain.infinityfreeapp.com/backend/php'; // Update with your domain
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.getElementById('loginBtn');
  const errorMsg = document.getElementById('errorMsg');
  const successMsg = document.getElementById('successMsg');

  if (!form || !emailInput || !passwordInput || !loginBtn) {
    console.error('Required form elements not found');
    return;
  }

  // Show error message
  function showError(msg) {
    if (errorMsg) {
      errorMsg.textContent = msg;
      errorMsg.classList.add('show');
      setTimeout(() => errorMsg.classList.remove('show'), 5000);
    } else {
      alert('Error: ' + msg);
    }
  }

  // Show success message
  function showSuccess(msg) {
    if (successMsg) {
      successMsg.textContent = msg;
      successMsg.classList.add('show');
      setTimeout(() => successMsg.classList.remove('show'), 3000);
    }
  }

  // Email validation
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Local validation
  function validateLocal(email, password) {
    if (!email.trim()) {
      showError('Please enter your email address');
      return false;
    }
    if (!isValidEmail(email)) {
      showError('Please enter a valid email address');
      return false;
    }
    if (!password) {
      showError('Please enter your password');
      return false;
    }
    if (password.length < 6) {
      showError('Password must be at least 6 characters');
      return false;
    }
    return true;
  }

  // Mock librarian database
  const MOCK_LIBRARIANS = [
    { id: 1, email: 'pratikhumagain17@gmail.com', password: 'pratik123', name: 'Pratik Humagain', role: 'librarian' },
    { id: 2, email: 'asutoshbade123@gmail.com', password: 'asutosh123', name: 'Asutosh Bade', role: 'admin' },
    { id: 3, email: 'demo@example.com', password: 'demo123', name: 'Demo Librarian', role: 'librarian' }
  ];

  // Local login
  function loginLocal(email, password) {
    const librarian = MOCK_LIBRARIANS.find(l => l.email === email && l.password === password);
    if (librarian) {
      return { success: true, librarian };
    }
    return { success: false, error: 'Invalid email or password' };
  }

  // Remote login
  async function loginRemote(email, password) {
    try {
      const res = await fetch(`${API_BASE}/login_librarian.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, librarian: data.librarian };
      }
      return { success: false, error: data.error || 'Login failed' };
    } catch (e) {
      console.error('Remote login error:', e);
      return { success: false, error: 'Network error. Try local mode.' };
    }
  }

  // Handle login
  async function handleLogin(e) {
    e.preventDefault();
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!validateLocal(email, password)) {
      loginBtn.disabled = false;
      loginBtn.textContent = 'Login';
      return;
    }

    // Try remote login first, fall back to local
    let result = await loginRemote(email, password);
    if (!result.success) {
      result = loginLocal(email, password);
    }

    if (result.success) {
      showSuccess(`Welcome, ${result.librarian.name}!`);
      // Store librarian data in localStorage
      localStorage.setItem('librarian', JSON.stringify(result.librarian));
      // Redirect to librarian dashboard
      setTimeout(() => {
        window.location.href = '../Librarian/Librarian-dashboard.html';
      }, 1500);
    } else {
      showError(result.error);
      loginBtn.disabled = false;
      loginBtn.textContent = 'Login';
    }
  }

  // Attach event listener
  form.addEventListener('submit', handleLogin);

  // Login on Enter key
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') form.dispatchEvent(new Event('submit'));
  });

  // Toggle password visibility
  const togglePasswordBtn = document.getElementById('togglePassword');
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      togglePasswordBtn.textContent = type === 'password' ? '👁️' : '🙈';
    });
  }
});