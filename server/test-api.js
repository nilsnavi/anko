const axios = require('axios');

async function testAPI() {
    try {
        // Test health endpoint
        console.log('Testing health endpoint...');
        const healthResponse = await axios.get('http://localhost:5000/api/health');
        console.log('Health check:', healthResponse.data);

        // Test login
        console.log('\nTesting login...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            username: 'admin',
            password: 'admin123'
        });

        console.log('Login successful:', loginResponse.data);

        // Test protected route with token
        console.log('\nTesting protected route...');
        const profileResponse = await axios.get('http://localhost:5000/api/admin/profile', {
            headers: {
                'Authorization': `Bearer ${loginResponse.data.accessToken}`
            }
        });

        console.log('Profile data:', profileResponse.data);

        // Test refresh token
        console.log('\nTesting token refresh...');
        const refreshResponse = await axios.post('http://localhost:5000/api/auth/refresh', {
            refreshToken: loginResponse.data.refreshToken
        });

        console.log('Refresh successful:', refreshResponse.data);

    } catch (error) {
        console.error('Test failed:', error.response?.data || error.message);
    }
}

testAPI();