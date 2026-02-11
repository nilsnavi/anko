const axios = require('axios');

async function testRegistration() {
    try {
        console.log('Testing user registration...\n');

        // Test registration
        const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
            username: 'testuser',
            email: 'test@example.com',
            password: 'testpass123'
        });

        console.log('✅ Registration successful:');
        console.log('User:', registerResponse.data.user);
        console.log('Message:', registerResponse.data.message);

        // Test login with new user
        console.log('\nTesting login with new user...\n');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            username: 'testuser',
            password: 'testpass123'
        });

        console.log('✅ Login successful:');
        console.log('User:', loginResponse.data.user);
        console.log('Role:', loginResponse.data.user.role);
        console.log('Has admin access:', loginResponse.data.user.role === 'admin');

        // Test accessing admin profile
        console.log('\nTesting admin profile access...\n');
        const profileResponse = await axios.get('http://localhost:5000/api/admin/profile', {
            headers: {
                'Authorization': `Bearer ${loginResponse.data.accessToken}`
            }
        });

        console.log('✅ Admin profile access granted:');
        console.log('Profile data:', profileResponse.data);

        // Check all users
        console.log('\nCurrent users in system:');
        const usersResponse = await axios.get('http://localhost:5000/api/users');
        console.log(usersResponse.data);

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testRegistration();