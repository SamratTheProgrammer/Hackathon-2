
async function testFullFlow() {
    const API_URL = 'http://localhost:5000/api';
    const email = `full_flow_${Date.now()}@example.com`;
    const password = 'password123';

    try {
        console.log('--- STARTING FULL FLOW TEST ---');

        // 1. Signup
        console.log('1. Signup...');
        const signupRes = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Flow User', email, password, mobile: Math.floor(1000000000 + Math.random() * 9000000000).toString(), dob: '2000-01-01' })
        });
        const signupData = await signupRes.json();
        if (!signupRes.ok) throw new Error(signupData.message);
        const { accountNumber } = signupData.user;
        const token = signupData.token;
        console.log(`   [OK] Account: ${accountNumber}`);

        // 2. Lookup Account (Pre-Link Step)
        console.log('2. Lookup Account...');
        const lookupRes = await fetch(`${API_URL}/user/lookup-account`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accountNumber })
        });
        const lookupData = await lookupRes.json();
        if (!lookupRes.ok) throw new Error(lookupData.message);
        if (lookupData.email !== email) throw new Error('Email mismatch');
        console.log(`   [OK] Found Email: ${lookupData.email}`);

        // 3 & 4. (Skipped) OTP handled by frontend EmailJS
        console.log('3 & 4. (Skipped) OTP handled by frontend EmailJS');

        // New Flow: Passwordless Login via Account Number
        console.log('-> Login Via Account...');
        const loginRes = await fetch(`${API_URL}/auth/login-via-account`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accountNumber })
        });
        const loginData = await loginRes.json();
        if (!loginRes.ok) throw new Error(loginData.message);
        const newToken = loginData.token;
        console.log('   [OK] Token Received');

        // 5. Link Account (Verify Bank Account endpoint)
        console.log('5. Link Account (Verify Ownership)...');
        // This endpoint requires the USER to be logged in (token) and verifies the account belongs to them?
        // Wait, the `verify-bank-account` endpoint checks if the *accountNumber* belongs to the *token user*.
        // In the App Flow:
        // User logs into App (Authenticated).
        // User goes to Link Bank.
        // User enters Bank Account Number.
        // Server checks if that Bank Account Number matches the App User's email?
        // `user.routes.js`: 
        // `userWithAccount = findUnique({ accountNumber })`
        // `currentUser = findUnique({ id: req.userId })`
        // `if (userWithAccount.email !== currentUser.email) error`
        // So YES, the App User MUST have the same email as the Bank Account.

        // In this test script, we just signed up a user. We have their token.
        // We use that token to verify the account we just created (which is effectively their bank account in this mono-server).
        const linkRes = await fetch(`${API_URL}/user/verify-bank-account`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ accountNumber })
        });
        const linkData = await linkRes.json();
        if (!linkRes.ok) throw new Error(linkData.message);
        console.log(`   [OK] Linked. Balance: ${linkData.account.balance}`);

        console.log('--- TEST PASSED SUCCESSFULLY ---');

    } catch (error) {
        console.error('--- TEST FAILED ---');
        console.error(error.message);
    }
}

testFullFlow();
