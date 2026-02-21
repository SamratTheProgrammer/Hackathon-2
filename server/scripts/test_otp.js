
async function testOtpFlow() {
    const API_URL = 'http://localhost:5000/api';

    // Use the known demo user
    const email = 'demo_bank_user@example.com';
    let accountNumber = '';

    // 1. Get Account Number first
    try {
        console.log('1. Getting Account Number...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: 'password123' })
        });
        const loginData = await loginRes.json();
        if (!loginRes.ok) throw new Error('Login failed');
        accountNumber = loginData.user.accountNumber;
        console.log(`   Account: ${accountNumber}`);

        // 2. Lookup (Pre-req)
        console.log('2. Verification: Lookup...');
        const lookupRes = await fetch(`${API_URL}/user/lookup-account`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accountNumber })
        });
        if (!lookupRes.ok) throw new Error('Lookup failed');
        console.log('   Lookup OK.');

        // 3. Send OTP
        console.log('3. Sending OTP...');
        const sendOtpRes = await fetch(`${API_URL}/user/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accountNumber })
        });
        const sendOtpData = await sendOtpRes.json();
        if (!sendOtpRes.ok) throw new Error(sendOtpData.message);

        console.log('   Send OK.');
        const otp = sendOtpData.dev_otp;
        if (!otp) throw new Error('Dev OTP not returned (check server logs if email failed)');
        console.log(`   Received OTP: ${otp}`);

        // 4. Verify OTP
        console.log('4. Verifying OTP...');
        const verifyRes = await fetch(`${API_URL}/user/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accountNumber, otp })
        });
        const verifyData = await verifyRes.json();
        if (!verifyRes.ok) throw new Error(verifyData.message);

        console.log('   [PASS] OTP Verification Successful');

    } catch (error) {
        console.error('Test Failed:', error.message);
    }
}

testOtpFlow();
