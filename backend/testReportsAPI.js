import axios from 'axios';

const testReportsAPI = async () => {
  try {
    // First, login as triage to get a token
    console.log('🔐 Logging in as triage...');
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'demo@triage.com',
      password: 'demo123'
    });
    
    console.log('✅ Login successful!');
    console.log('Token:', loginResponse.data.token.substring(0, 20) + '...');
    
    const token = loginResponse.data.token;
    
    // Now fetch reports
    console.log('\n📊 Fetching reports...');
    const reportsResponse = await axios.get('http://localhost:3000/api/reports', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Reports fetched successfully!');
    console.log('Number of reports:', reportsResponse.data.reports?.length || 0);
    console.log('\n📋 Report Details:');
    reportsResponse.data.reports?.forEach((report, index) => {
      console.log(`${index + 1}. ${report.title} - ${report.severity} - ${report.status}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

testReportsAPI();
