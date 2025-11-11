const API_URL = 'https://lufox-pratik.gamer.gd/Back-End/student.php';

document.addEventListener('DOMContentLoaded', function() {
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

    // Mock student database
    const MOCK_STUDENTS = [
        { id: 1, email: 'pratikhumagain17@gmail.com', password: 'pratik123', name: 'Pratik Humagain', roll_no: 'BEI-001', department: 'Engineering' },
        { id: 2, email: 'asutoshbade123@gmail.com', password: 'asutosh123', name: 'Asutosh Bade', roll_no: 'BEI-002', department: 'Engineering' },
        { id: 3, email: 'demo@example.com', password: 'demo123', name: 'Demo Student', roll_no: 'BEI-003', department: 'Science' },
        { id: 4, email: 'student@example.com', password: 'student123', name: 'John Doe', roll_no: 'BEI-004', department: 'Engineering' },
        { id: 5, email: 'jane@example.com', password: 'jane123', name: 'Jane Smith', roll_no: 'BCS-001', department: 'Computer Science' }
    ];

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

    // Mock login (local)
    function loginMock(email, password) {
        const student = MOCK_STUDENTS.find(s => s.email === email && s.password === password);
        if (student) {
            return { 
                success: true, 
                student: {
                    id: student.id,
                    name: student.name,
                    email: student.email,
                    roll_no: student.roll_no,
                    department: student.department
                }
            };
        }
        return { 
            success: false, 
            error: 'Invalid email or password' 
        };
    }

    // Database login via API
    async function loginDatabase(email, password) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                return { 
                    success: true, 
                    student: data.student 
                };
            }
            return { 
                success: false, 
                error: data.error || 'Login failed' 
            };
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                error: 'Network error. Please try again.' 
            };
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

        // Try database login first
        let result = await loginDatabase(email, password);

        // Fallback to mock login if database fails
        if (!result.success) {
            console.log('Database login failed, trying mock login...');
            result = loginMock(email, password);
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

    // Login on Enter key
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') form.dispatchEvent(new Event('submit'));
    });

    // Toggle password visibility
    const togglePasswordBtn = document.querySelector('.toggle-password');
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            const icon = togglePasswordBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        });
    }
});