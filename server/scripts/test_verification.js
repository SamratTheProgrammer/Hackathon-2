
async function testVerification() {
    const API_URL = 'http://localhost:5000/api';
    const email = `test_${Date.now()}@example.com`;
    const password = 'password123';
    const name = 'Test User';

    try {
        console.log('1. Signing up...');
        const signupRes = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, mobile: Math.floor(1000000000 + Math.random() * 9000000000).toString(), dob: '2000-01-01' })
        });

        const signupData = await signupRes.json();
        if (!signupRes.ok) throw new Error(signupData.message);

        const token = signupData.token;
        const user = signupData.user;
        const accountNumber = user.accountNumber;
        console.log(`   Signup successful. Token: ${token.substring(0, 10)}...`);
        console.log(`   Account Number: ${accountNumber}`);

        // 2. Verify Bank Account with CORRECT account number
        console.log('2. Verifying with CORRECT account number...');
        const verifyRes = await fetch(`${API_URL}/user/verify-bank-account`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ accountNumber })
        });
        const verifyData = await verifyRes.json();

        if (!verifyRes.ok) {
            console.error('   FAILED:', verifyData.message);
        } else {
            console.log('   Verification Success:', verifyData.message);
            if (verifyData.account.accountNumber !== accountNumber) {
                console.error('   MISMATCH! Returned account number is wrong.');
            }
        }

        // 3. Verify with WRONG account number
        console.log('3. Verifying with WRONG account number...');
        const wrongVerifyRes = await fetch(`${API_URL}/user/verify-bank-account`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ accountNumber: '000000000000' })
        });
        const wrongData = await wrongVerifyRes.json();

        if (!wrongVerifyRes.ok) {
            console.log('   Correctly failed:', wrongData.message);
        } else {
            console.error('   FAILED: Should have returned error');
        }

    } catch (error) {
        console.error('Test Failed:', error.message);
    }
}

testVerification();
