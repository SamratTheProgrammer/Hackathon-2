
async function testLookup() {
    const API_URL = 'http://localhost:5000/api';

    // 1. Create a user to find
    const email = `lookup_test_${Date.now()}@example.com`;
    const password = 'password123';
    const name = 'Lookup User';

    try {
        console.log('1. Signing up target user...');
        const signupRes = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, mobile: Math.floor(1000000000 + Math.random() * 9000000000).toString(), dob: '2000-01-01' })
        });
        const signupData = await signupRes.json();
        if (!signupRes.ok) throw new Error(signupData.message);
        const { accountNumber } = signupData.user;
        console.log(`   User created. Account: ${accountNumber}, Email: ${email}`);

        // 2. Lookup the account (Publicly)
        console.log('2. Looking up account...');
        const lookupRes = await fetch(`${API_URL}/user/lookup-account`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accountNumber })
        });

        const lookupData = await lookupRes.json();
        if (!lookupRes.ok) throw new Error(lookupData.message);

        console.log(`   Lookup Result: ${JSON.stringify(lookupData)}`);

        if (lookupData.email === email) {
            console.log('   [PASS] Email matches.');
        } else {
            console.error('   [FAIL] Email mismatch.');
        }

    } catch (error) {
        console.error('Test Failed:', error.message);
    }
}

testLookup();
