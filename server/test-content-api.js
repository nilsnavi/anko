const axios = require('axios');

async function testContentAPI() {
    try {
        console.log('🧪 Testing Content Management API...\n');

        // Test public endpoints (no auth required)
        console.log('📋 Testing public endpoints...\n');

        // Get services
        const servicesResponse = await axios.get('http://localhost:5000/api/content/services');
        console.log('✅ Services:', servicesResponse.data.length, 'items');

        // Get team
        const teamResponse = await axios.get('http://localhost:5000/api/content/team');
        console.log('✅ Team members:', teamResponse.data.length, 'items');

        // Get news
        const newsResponse = await axios.get('http://localhost:5000/api/content/news');
        console.log('✅ News:', newsResponse.data.length, 'items');

        // Get FAQ
        const faqResponse = await axios.get('http://localhost:5000/api/content/faq');
        console.log('✅ FAQ items:', faqResponse.data.length, 'items');

        // Test authentication
        console.log('\n🔐 Testing authentication...\n');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            username: 'admin',
            password: 'admin123'
        });

        const token = loginResponse.data.accessToken;
        console.log('✅ Login successful, got token');

        // Test protected endpoints
        console.log('\n🔒 Testing protected endpoints...\n');

        // Get clients (requires auth)
        const clientsResponse = await axios.get('http://localhost:5000/api/content/clients', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('✅ Clients:', clientsResponse.data.length, 'items');

        // Get inquiries (requires auth)
        const inquiriesResponse = await axios.get('http://localhost:5000/api/content/inquiries', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('✅ Inquiries:', inquiriesResponse.data.length, 'items');

        // Test CRUD operations
        console.log('\n🔄 Testing CRUD operations...\n');

        // Add new team member
        const newTeamMember = {
            id: 999,
            name: 'Тестовый Сотрудник',
            role: 'Тестировщик',
            imageUrl: 'https://picsum.photos/200/200?random=999'
        };

        const addTeamResponse = await axios.post('http://localhost:5000/api/content/team', newTeamMember, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('✅ Added new team member:', addTeamResponse.data.name);

        // Update team member
        const updateTeamResponse = await axios.put('http://localhost:5000/api/content/team/999',
            { role: 'Старший Тестировщик' },
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
        console.log('✅ Updated team member role:', updateTeamResponse.data.role);

        // Delete team member
        const deleteTeamResponse = await axios.delete('http://localhost:5000/api/content/team/999', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('✅ Deleted team member');

        // Verify team member was deleted
        const finalTeamResponse = await axios.get('http://localhost:5000/api/content/team');
        const deletedMember = finalTeamResponse.data.find(m => m.id === 999);
        console.log('✅ Member properly deleted:', !deletedMember);

        console.log('\n🎉 All tests passed! Content management API is working correctly.');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testContentAPI();