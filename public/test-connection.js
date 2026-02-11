// Test connection between frontend and backend
fetch('http://localhost:5000/api/health')
    .then(response => response.json())
    .then(data => console.log('Backend health check:', data))
    .catch(error => console.error('Backend connection error:', error));

// Test login from browser
fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
    })
})
    .then(response => response.json())
    .then(data => console.log('Login test result:', data))
    .catch(error => console.error('Login test error:', error));