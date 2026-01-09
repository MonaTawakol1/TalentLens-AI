const fetch = require('node-fetch'); // or native fetch if node 18+

const BASE_URL = 'http://localhost:3000/auth';
const TIMESTAMP = Date.now();
const USER = {
    email: `test_${TIMESTAMP}@example.com`,
    password: 'password123',
    fullName: 'Test User'
};

async function run() {
    console.log('--- STARTING AUTH TEST ---');

    // 1. REGISTER
    console.log(`\n1. Registering user: ${USER.email}`);
    const regRes = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(USER)
    });
    const regData = await regRes.json();
    console.log('Status:', regRes.status);
    console.log('Response:', regData);

    if (regRes.status !== 201) {
        console.error('Registration failed');
        return;
    }

    // 2. LOGIN
    console.log(`\n2. Logging in...`);
    const loginRes = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: USER.email, password: USER.password })
    });
    const loginData = await loginRes.json();
    console.log('Status:', loginRes.status);
    console.log('Token received:', loginData.access_token ? 'YES' : 'NO');

    if (loginRes.status !== 200 || !loginData.access_token) {
        console.error('Login failed');
        return;
    }

    const token = loginData.access_token;

    // 3. GET ME (Protected)
    console.log(`\n3. Fetching /me (Protected Route)...`);
    const meRes = await fetch(`${BASE_URL}/me`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const meData = await meRes.json();
    console.log('Status:', meRes.status);
    console.log('User Data:', meData);

    if (meRes.status === 200 && meData.email === USER.email) {
        console.log('\n✅ SUCCESS: Full Auth Flow verified!');
    } else {
        console.error('\n❌ FAILED: /me check did not return correct user');
    }
}

// Polyfill for node < 18 if needed, though most envs have it. 
// If run fails, I'll switch to standard http
run().catch(console.error);
