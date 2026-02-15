/**
 * Librarian Login — Local Backend (PHP)
 * Uses http://localhost/Library-Management-System/Back-End/api
 */

// Local API endpoint
const API_BASE = 'http://localhost/Library-Management-System/Back-End/api';

// Get form elements
const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const errorMsg = document.getElementById('errorMsg');
const successMsg = document.getElementById('successMsg');

console.log('🔧 Librarian login script initializing...');
console.log('Form:', form);
console.log('Email input:', emailInput);
console.log('Password input:', passwordInput);
console.log('Login button:', loginBtn);

if (!form || !emailInput || !passwordInput || !loginBtn) {
  console.error('❌ Critical: Required form elements not found!');
}

// Show error message
function showError(msg) {
  console.error('❌ ERROR:', msg);
  if (errorMsg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
    errorMsg.style.color = 'red';
  }
}

// Show success message
function showSuccess(msg) {
  console.log('✅ SUCCESS:', msg);
  if (successMsg) {
    successMsg.textContent = msg;
    successMsg.style.display = 'block';
    successMsg.style.color = 'green';
  }
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate input
function validateInput(email, password) {
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

// Login function
async function handleLogin(e) {
  e.preventDefault();
  console.log('📝 Login attempt starting...');
  
  loginBtn.disabled = true;
  loginBtn.textContent = 'Logging in...';

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  console.log('📋 Email:', email);
  console.log('📋 Password length:', password.length);

  // Validate
  if (!validateInput(email, password)) {
    console.log('❌ Validation failed');
    loginBtn.disabled = false;
    loginBtn.textContent = 'Login';
    return;
  }

  console.log('✅ Validation passed');

  // Try API login
  try {
    console.log('🔗 Sending request to API...');
    const response = await fetch(`${API_BASE}/auth.php?action=login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    console.log('� API Response Status:', response.status);
    const data = await response.json();
    console.log('📡 API Response Data:', data);

    if (data.success && data.user) {
      console.log('✅ Login successful!');
      showSuccess(`Welcome, ${data.user.name}!`);
      localStorage.setItem('librarian', JSON.stringify(data.user));
      console.log('💾 Data saved to localStorage');
      
      setTimeout(() => {
        console.log('🔄 Redirecting to dashboard...');
        window.location.href = '../Librarian/Librarian-dashboard.html';
      }, 1500);
    } else {
      const errorMsg = data.error || 'Login failed';
      console.error('❌ API Error:', errorMsg);
      showError(errorMsg);
      loginBtn.disabled = false;
      loginBtn.textContent = 'Login';
    }
  } catch (error) {
    console.error('❌ Network Error:', error);
    showError('Network error. Please try again.');
    loginBtn.disabled = false;
    loginBtn.textContent = 'Login';
  }
}

// Attach listeners
if (form) {
  console.log('📌 Attaching form submit listener');
  form.addEventListener('submit', handleLogin);
}

// Password toggle
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
}

console.log('🎉 Librarian login script loaded successfully!');
