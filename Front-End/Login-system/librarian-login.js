/**
 * Librarian Login — Local Backend (PHP)
 * Uses http://localhost/Library-Management-System/Back-End/api
 */
(function() {
  // Local API endpoint
  const API_BASE = 'http://localhost/Library-Management-System/Back-End/api';

  // Get form elements
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.getElementById('loginBtn');
  const errorMsg = document.getElementById('errorMsg');
  const successMsg = document.getElementById('successMsg');

  // Debug: Log what we found
  console.log('Form:', form);
  console.log('Email input:', emailInput);
  console.log('Password input:', passwordInput);
  console.log('Login button:', loginBtn);
  console.log('Error message element:', errorMsg);
  console.log('Success message element:', successMsg);

  if (!form || !emailInput || !passwordInput || !loginBtn) {
    console.error('❌ Required form elements not found!');
    console.error('Missing:', {
      form: !form ? 'MISSING' : 'found',
      emailInput: !emailInput ? 'MISSING' : 'found',
      passwordInput: !passwordInput ? 'MISSING' : 'found',
      loginBtn: !loginBtn ? 'MISSING' : 'found'
    });
    return;
  }
  
  console.log('✅ All form elements found!');

  // Show error message
  function showError(msg) {
    console.error('❌ Error:', msg);
    if (errorMsg) {
      errorMsg.textContent = msg;
      errorMsg.classList.add('show');
      errorMsg.style.display = 'block';
      setTimeout(() => {
        errorMsg.classList.remove('show');
        errorMsg.style.display = 'none';
      }, 5000);
    } else {
      alert('Error: ' + msg);
    }
  }

  // Show success message
  function showSuccess(msg) {
    console.log('✅ Success:', msg);
    if (successMsg) {
      successMsg.textContent = msg;
      successMsg.classList.add('show');
      successMsg.style.display = 'block';
      setTimeout(() => {
        successMsg.classList.remove('show');
        successMsg.style.display = 'none';
      }, 3000);
    } else {
      alert('Success: ' + msg);
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

  // Remote login via backend API
  async function loginRemote(email, password) {
    try {
      console.log('Attempting login with email:', email);
      const res = await fetch(`${API_BASE}/auth.php?action=login`, {
        method: 'POST',
        credentials: 'include',  // important for session cookies
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      console.log('API Response:', res.status, data);
      
      if (data.success && data.user) {
        return { success: true, librarian: data.user };
      }
      return { success: false, error: data.error || 'Login failed' };
    } catch (e) {
      console.error('Login error:', e);
      return { success: false, error: 'Network error. Ensure backend is running.' };
    }
  }

  // Handle login
  async function handleLogin(e) {
    e.preventDefault();
    console.log('📝 Login form submitted');
    
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    console.log('📋 Form data:', { email, password });

    if (!validateLocal(email, password)) {
      console.log('❌ Local validation failed');
      loginBtn.disabled = false;
      loginBtn.textContent = 'Login';
      return;
    }

    console.log('✅ Local validation passed, attempting API login...');
    // Try backend login
    const result = await loginRemote(email, password);

    console.log('📊 Login result:', result);

    if (result.success) {
      showSuccess('Welcome, ' + result.librarian.name + '!');
      console.log('💾 Storing librarian data in localStorage');
      // Store librarian data in localStorage
      localStorage.setItem('librarian', JSON.stringify(result.librarian));
      // Redirect to librarian dashboard
      console.log('🔄 Redirecting to dashboard...');
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
  console.log('📌 Attaching form submit listener');
  form.addEventListener('submit', handleLogin);

  // Login on Enter key
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      console.log('⌨️ Enter key pressed');
      form.dispatchEvent(new Event('submit'));
    }
  });

  // Password toggle functionality
  const toggleBtn = document.getElementById('togglePassword');
  if (toggleBtn) {
    console.log('✅ Password toggle button found');
    toggleBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = '🙈';
      } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '👁️';
      }
    });
  } else {
    console.warn('⚠️ Password toggle button not found');
  }
  
  console.log('🎉 Librarian login script loaded successfully!');
});
