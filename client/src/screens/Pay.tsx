import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useOffline } from '../services/OfflineContext';
import { UiButton as Button } from '../components/ui/UiButton';
import { InputField as Input } from '../components/ui/InputField';
import { Card, ScreenWrapper, LoginPrompt } from '../components/ui';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Search, User as UserIcon, CheckCircle, XCircle, Bluetooth } from 'lucide-react-native';
import { bluetoothService } from '../services/BluetoothService';

type Step = 'scan' | 'amount' | 'confirm' | 'result';

export const Pay = () => {
    const { user, offlineWallet, bankBalance, isOfflineMode, sendMoney } = useOffline();
    const [step, setStep] = useState<Step>('scan');
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [payee, setPayee] = useState({ name: '', upiId: '' });
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [txnResult, setTxnResult] = useState<'success' | 'failure' | null>(null);
    const [isConnectingBluetooth, setIsConnectingBluetooth] = useState(false);

    const handleBarCodeScanned = ({ type, data }: { type: string, data: string }) => {
        setScanned(true);
        try {
            // New format: upi://pay?pa=...&pn=...&deviceId=...
            if (data.startsWith('upi://')) {
                const params = new URLSearchParams(data.split('?')[1]);
                const pa = params.get('pa');
                const pn = params.get('pn');
                const pDeviceId = params.get('deviceId'); // Custom param for offline BLE
                if (pa) {
                    handlePayeeSelect(pn || 'Merchant', pa, pDeviceId);
                    return;
                }
            }
            handlePayeeSelect('Unknown', data, null);
        } catch (e) {
            Alert.alert('Invalid QR', 'Could not parse UPI QR code.');
            setScanned(false);
        }
    };

    const handlePayeeSelect = (name: string, upiId: string, deviceId: string | null = null) => {
        setPayee({ name, upiId });
        // Store device ID temporarily for offline use
        if (deviceId) {
            (payee as any).deviceId = deviceId;
        }
        setStep('amount');
    };

    const handleConfirm = async () => {
        const amt = parseFloat(amount);
        if (!amt || amt <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount');
            return;
        }

        if (isOfflineMode) {
            setIsConnectingBluetooth(true);
            const hasPerms = await bluetoothService.requestPermissions();
            if (hasPerms) {
                await bluetoothService.enableBluetooth();
            } else {
                Alert.alert('Permission Denied', 'Bluetooth permissions are required for offline payments.');
                setIsConnectingBluetooth(false);
                return;
            }

            const deviceId = (payee as any).deviceId;

            if (deviceId) {
                // Real attempt to connect and write over BLE
                const payload = JSON.stringify({
                    amount: amt,
                    payerName: user?.name,
                    payerUpiId: user?.upiId,
                    note: note,
                    timestamp: new Date().toISOString()
                });

                const connected = await bluetoothService.connectAndWrite(deviceId, payload);
                if (connected) {
                    const success = await sendMoney(amt, payee, note);
                    setTxnResult(success ? 'success' : 'failure');
                } else {
                    Alert.alert('Connection Failed', 'Could not transfer data to payee device.');
                    setTxnResult('failure');
                }
                setIsConnectingBluetooth(false);
                setStep('result');

            } else {
                // Fallback simulation if no device ID was in QR (e.g. testing)
                setTimeout(async () => {
                    const success = await sendMoney(amt, payee, note);
                    setTxnResult(success ? 'success' : 'failure');
                    setIsConnectingBluetooth(false);
                    setStep('result');
                }, 2500);
            }

        } else {
            // Online flow -> instant transfer or network simulation
            const success = await sendMoney(amt, payee, note);
            setTxnResult(success ? 'success' : 'failure');
            setStep('result');
        }
    };

    const reset = () => {
        setStep('scan');
        setPayee({ name: '', upiId: '' });
        setAmount('');
        setNote('');
        setTxnResult(null);
        setScanned(false);
        setIsConnectingBluetooth(false);
    };

    const renderScanStep = () => {
        if (!permission) return <View />;

        if (!permission.granted) {
            return (
                <View className="items-center justify-center p-6 bg-white dark:bg-neutral-800 rounded-xl m-4 shadow-sm">
                    <Text className="text-neutral-text dark:text-white text-center mb-4 font-medium">Camera access is needed to scan QR codes</Text>
                    <Button onPress={requestPermission} title="Grant Permission" />
                </View>
            );
        }

        return (
            <View>
                <Text className="text-2xl font-bold text-neutral-text dark:text-white mb-6">Scan & Pay</Text>

                <View className="h-80 w-full overflow-hidden rounded-3xl border-4 border-primary/20 relative bg-black mb-6 shadow-lg">
                    <CameraView
                        style={{ flex: 1 }}
                        facing="back"
                        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                    >
                        <View className="flex-1 items-center justify-center">
                            <View className="w-60 h-60 border-2 border-white/80 rounded-2xl" />
                        </View>
                    </CameraView>
                </View>

                <Text className="text-center text-neutral-text-secondary dark:text-neutral-400 mb-4 font-medium">- OR -</Text>

                <Text className="text-lg font-bold text-neutral-text dark:text-white mb-3">Pay to Contact</Text>
                <Input
                    placeholder="Search name or number"
                    icon={<Search size={20} color="#94A3B8" />}
                    className="bg-white dark:bg-neutral-800 dark:text-white dark:border-neutral-700"
                />

                <View>
                    {['Alice Smith', 'Bob Jones', 'Charlie Brown'].map((name, i) => (
                        <TouchableOpacity
                            key={i}
                            className="flex-row items-center p-3 bg-white dark:bg-neutral-800 rounded-xl mb-2 border border-neutral-border dark:border-neutral-700 shadow-sm active:bg-gray-50 dark:active:bg-neutral-700"
                            onPress={() => handlePayeeSelect(name, `${name.toLowerCase().replace(' ', '')}@bank`)}
                        >
                            <View className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full items-center justify-center mr-3 border border-primary/10">
                                <UserIcon size={20} color="#2563EB" />
                            </View>
                            <View>
                                <Text className="font-semibold text-neutral-text dark:text-white">{name}</Text>
                                <Text className="text-neutral-text-secondary dark:text-neutral-400 text-xs">{name.toLowerCase().replace(' ', '')}@bank</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    };

    const renderAmountStep = () => (
        <View>
            <Text className="text-xl font-bold text-neutral-text dark:text-white mb-6">Enter Amount</Text>

            <Card className="items-center mb-8 py-8 bg-white dark:bg-neutral-800 border-neutral-border dark:border-neutral-700">
                <Text className="text-neutral-text-secondary dark:text-neutral-400 mb-1 text-sm font-medium">Paying to {payee.name}</Text>
                <Text className="text-xs text-primary bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full mb-4">{payee.upiId}</Text>

                <View className="flex-row items-center justify-center">
                    <Text className="text-4xl font-bold text-neutral-text dark:text-white mr-1">₹</Text>
                    <TextInput
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="0"
                        placeholderTextColor="#cbd5e1"
                        keyboardType="numeric"
                        className="text-5xl font-bold text-neutral-text dark:text-white text-center min-w-[60px]"
                        autoFocus
                    />
                </View>
            </Card>

            <Input
                value={note}
                onChangeText={setNote}
                placeholder="Add a note (optional)"
                className="bg-white dark:bg-neutral-800 dark:text-white mb-8 dark:border-neutral-700"
            />

            <Button title="Continue" onPress={() => setStep('confirm')} />
            <Button title="Cancel" variant="ghost" onPress={reset} className="mt-2" />
        </View>
    );

    const renderConfirmStep = () => (
        <View>
            <Text className="text-xl font-bold text-neutral-text dark:text-white mb-6">Confirm Payment</Text>

            <Card className="mb-6 border-neutral-border dark:border-neutral-700 bg-white dark:bg-neutral-800 p-5">
                <View className="flex-row justify-between mb-4">
                    <Text className="text-neutral-text-secondary dark:text-neutral-400 font-medium">To</Text>
                    <View className="items-end">
                        <Text className="font-bold text-neutral-text dark:text-white text-lg">{payee.name}</Text>
                        <Text className="text-xs text-neutral-text-secondary dark:text-neutral-400">{payee.upiId}</Text>
                    </View>
                </View>

                <View className="flex-row justify-between mb-6">
                    <Text className="text-neutral-text-secondary dark:text-neutral-400 font-medium mt-2">Amount</Text>
                    <Text className="font-bold text-4xl text-neutral-text dark:text-white">₹{amount}</Text>
                </View>

                <View className="h-[1px] bg-neutral-border dark:bg-neutral-700 mb-4" />

                <View className="flex-row justify-between items-center">
                    <Text className="text-neutral-text-secondary dark:text-neutral-400 font-medium">From</Text>
                    <View className="items-end">
                        <Text className="font-semibold text-neutral-text dark:text-white">{isOfflineMode ? 'Offline Wallet' : 'Bank Account'}</Text>
                        <Text className="text-xs text-neutral-text-secondary dark:text-neutral-400">
                            Bal: ₹{(isOfflineMode ? offlineWallet?.balance : bankBalance)?.toFixed(2)}
                        </Text>
                    </View>
                </View>

                {note ? (
                    <View className="mt-4 bg-neutral-bg dark:bg-neutral-900 p-3 rounded-lg">
                        <Text className="text-center text-neutral-text-secondary dark:text-neutral-400 text-sm italic">"{note}"</Text>
                    </View>
                ) : null}
            </Card>

            {isOfflineMode && (offlineWallet?.balance || 0) < parseFloat(amount) && (
                <Text className="text-status-error text-center mb-4 font-medium">Insufficient Offline Balance</Text>
            )}

            {isConnectingBluetooth ? (
                <View className="mb-4 items-center bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-primary/20">
                    <Bluetooth size={24} color="#2563EB" className="mb-2" />
                    <Text className="text-primary dark:text-blue-400 font-semibold text-center">Connecting & Sending via Bluetooth...</Text>
                </View>
            ) : null}

            <Button
                title="Pay Now"
                onPress={handleConfirm}
                disabled={isConnectingBluetooth || (isOfflineMode && (offlineWallet?.balance || 0) < parseFloat(amount))}
                className={isOfflineMode && (offlineWallet?.balance || 0) < parseFloat(amount) ? 'opacity-50' : 'shadow-lg shadow-primary/30'}
            />
            <Button title="Back" variant="ghost" onPress={() => setStep('amount')} disabled={isConnectingBluetooth} className="mt-2" />
        </View>
    );

    const renderResultStep = () => (
        <View className="items-center justify-center flex-1 py-10">
            <View className={`rounded-full p-6 mb-6 ${txnResult === 'success' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                {txnResult === 'success' ? (
                    <CheckCircle size={80} color="#10B981" />
                ) : (
                    <XCircle size={80} color="#EF4444" />
                )}
            </View>

            <Text className="text-2xl font-bold mt-4 mb-2 text-neutral-text dark:text-white">
                {txnResult === 'success' ? (isOfflineMode ? 'Payment Pending' : 'Payment Successful') : 'Payment Failed'}
            </Text>

            <Text className="text-neutral-text-secondary dark:text-neutral-400 text-center mb-8 px-8 leading-6">
                {txnResult === 'success'
                    ? `Successfully sent ₹${amount} to ${payee.name}`
                    : 'The transaction could not be completed. Please try again.'}
            </Text>

            {isOfflineMode && txnResult === 'success' && (
                <View className="bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-full border border-orange-100 dark:border-orange-900/50 mb-4">
                    <Text className="text-orange-700 dark:text-orange-400 text-xs font-medium">
                        Offline Transaction - Will sync when online
                    </Text>
                </View>
            )}

            {isOfflineMode && txnResult === 'success' && (
                <View className="flex-row items-center justify-center bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full border border-blue-100 dark:border-blue-900/50 mb-8">
                    <Bluetooth size={14} color="#2563EB" className="mr-2" />
                    <Text className="text-blue-700 dark:text-blue-400 text-xs font-medium">
                        Transferred securely via Bluetooth
                    </Text>
                </View>
            )}

            <Button title="Done" onPress={reset} className="w-full" />
        </View>
    );

    if (!user) {
        return <LoginPrompt title="Scan & Pay" description="Please login to make payments." />;
    }

    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>
                {step === 'scan' && renderScanStep()}
                {step === 'amount' && renderAmountStep()}
                {step === 'confirm' && renderConfirmStep()}
                {step === 'result' && renderResultStep()}
            </ScrollView>
        </ScreenWrapper>
    );
};
