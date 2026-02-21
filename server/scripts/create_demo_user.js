
async function ensureDemoUser() {
    const API_URL = 'http://localhost:5000/api';
    const email = 'demo_bank_user@example.com';
    const password = 'password123';
    const name = 'Demo User';

    try {
        console.log('1. Attempting Login...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        let user;

        if (loginRes.ok) {
            const data = await loginRes.json();
            user = data.user;
            console.log('   Login successful.');
        } else {
            console.log('   Login failed, attempting Signup...');
            const signupRes = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, mobile: '9999999999', dob: '1990-01-01' })
            });
            const data = await signupRes.json();

            if (signupRes.ok) {
                user = data.user;
                console.log('   Signup successful.');
            } else {
                console.log('   Signup failed:', data.message);
                // Maybe user exists but password changed?
                // Just try to find user by email using lookup?
                // No, lookup requires account number.
                return;
            }
        }

        if (user) {
            console.log('------------------------------------------------');
            console.log('DEMO_ACCOUNT_NUMBER:' + user.accountNumber);
            console.log('DEMO_EMAIL:' + user.email);
            console.log('DEMO_PASSWORD:' + password);
            console.log('------------------------------------------------');
        }

    } catch (error) {
        console.log('Script Error:', error.message);
    }
}

ensureDemoUser();
