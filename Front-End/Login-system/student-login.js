(function() {
  const API_BASE = 'https://yourdomain.infinityfreeapp.com/backend/php'; // Update with your domain
  const form = document.querySelector('form') || document.getElementById('loginForm');
  const emailInput = document.getElementById('email') || document.querySelector('input[type="email"]');
  const passwordInput = document.getElementById('password') || document.querySelector('input[type="password"]');
  const loginBtn = document.getElementById('loginBtn') || document.querySelector('.btn-login');
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

  // Local validation (client-side only)
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

  // Mock student database (for local/demo mode)
  const MOCK_STUDENTS = [
    { id: 1, email: 'student1@example.com', password: 'password123', name: 'John Doe' },
    { id: 2, email: 'student2@example.com', password: 'password123', name: 'Jane Smith' },
    { id: 3, email: 'demo@example.com', password: 'demo123', name: 'Demo Student' }
  ];

  // Local login (mock database)
  function loginLocal(email, password) {
    const student = MOCK_STUDENTS.find(s => s.email === email && s.password === password);
    if (student) {
      return { success: true, student };
    }
    return { success: false, error: 'Invalid email or password' };
  }

  // Remote login (via PHP API)
  async function loginRemote(email, password) {
    try {
      const res = await fetch(`${API_BASE}/login_student.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, student: data.student };
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
      showSuccess(`Welcome, ${result.student.name}!`);
      // Store student data in localStorage
      localStorage.setItem('student', JSON.stringify(result.student));
      // Redirect to student dashboard
      setTimeout(() => {
        window.location.href = '../Student/student-dashboard.html';
      }, 1500);
    } else {
      showError(result.error);
      loginBtn.disabled = false;
      loginBtn.textContent = 'Login';
    }
  }

  // Attach event listener
  form.addEventListener('submit', handleLogin);
  
  // Optional: Login on Enter key
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') form.dispatchEvent(new Event('submit'));
  });

  // Optional: Show/hide password toggle
  const togglePasswordBtn = document.querySelector('.toggle-password');
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', () => {
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;
      togglePasswordBtn.innerHTML = type === 'password' 
        ? '<i class="fas fa-eye"></i>' 
        : '<i class="fas fa-eye-slash"></i>';
    });
  }
})();