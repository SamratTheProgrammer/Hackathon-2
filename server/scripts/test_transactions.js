
async function testTransactions() {
    const API_URL = 'http://localhost:5000/api';
    const email = `tx_test_${Date.now()}@example.com`;
    const password = 'password123';
    const name = 'Tx Test User';

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
        console.log(`   Signup successful. Token: ${token.substring(0, 10)}...`);

        // 2. Add Money (Credit) - MUST set status to Success for it to add to balance immediately
        console.log('2. Adding Money (Credit)...');
        const addRes = await fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount: 1000, type: 'credit', remarks: 'Initial Deposit', status: 'Success' })
        });
        const addData = await addRes.json();
        if (!addRes.ok) throw new Error(addData.message || 'Add money failed');
        console.log('   Add Money Success:', addData.message);
        console.log('   New Balance:', addData.newBalance);

        // 3. Send Money (Debit)
        console.log('3. Sending Money (Debit)...');
        const sendRes = await fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount: 200, type: 'debit', remarks: 'Bill Payment', to: 'Electricity Board', status: 'Success' })
        });
        const sendData = await sendRes.json();
        if (!sendRes.ok) throw new Error(sendData.message || 'Send money failed');
        console.log('   Send Money Success:', sendData.message);

        // 4. Fetch Transactions
        console.log('4. Fetching Transactions...');
        const fetchRes = await fetch(`${API_URL}/transactions`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const transactions = await fetchRes.json();

        if (!fetchRes.ok) throw new Error('Failed to fetch transactions');

        console.log(`   Fetched ${transactions.length} transactions.`);

        // Verify Content
        const creditTx = transactions.find(t => t.type === 'credit');
        const debitTx = transactions.find(t => t.type === 'debit');

        if (creditTx && debitTx) {
            console.log('   [PASS] Found both credit and debit transactions.');
            console.log('   Sample Credit:', JSON.stringify(creditTx));
            console.log('   Sample Debit:', JSON.stringify(debitTx));
        } else {
            console.error('   [FAIL] Missing transactions.');
            console.log('   Transactions:', JSON.stringify(transactions));
        }

    } catch (error) {
        console.error('Test Failed:', error.message);
    }
}

testTransactions();
