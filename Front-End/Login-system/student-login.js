const API_URL = 'https://lufox-pratik.gamer.gd/Back-End/student.php';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

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
            // Save student to localStorage
            localStorage.setItem('student', JSON.stringify(data.student));
            alert('Login successful!');
            window.location.href = '../Student/student-dashboard.html';
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        alert('Login error. Please try again.');
        console.error(error);
    }
});