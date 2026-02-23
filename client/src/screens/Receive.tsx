import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert, Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useOffline } from '../services/OfflineContext';
import { UiButton as Button } from '../components/ui/UiButton';
import { Card, ScreenWrapper, LoginPrompt } from '../components/ui';
import QRCode from 'react-native-qrcode-svg';
import { Bluetooth, Share2, Copy } from 'lucide-react-native';
import { bluetoothService } from '../services/BluetoothService';

export const Receive = () => {
    const { user, receiveMoney } = useOffline();
    const [isScanning, setIsScanning] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [incomingTxn, setIncomingTxn] = useState<any>(null);
    const [isCopied, setIsCopied] = useState(false);

    // Generate UPI URI
    const upiUri = `upi://pay?pa=${user?.upiId}&pn=${user?.name}&am=0`;

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Pay me securely using DigiDhan.\nMy UPI ID: ${user?.upiId}\nPayment Link: ${upiUri}`,
                title: 'My Payment Details'
            });
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    const handleCopy = async () => {
        if (user?.upiId) {
            await Clipboard.setStringAsync(user.upiId);
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        }
    };

    // Bluetooth Scanning
    const findPayer = async () => {
        const hasPerms = await bluetoothService.requestPermissions();
        if (!hasPerms) {
            Alert.alert('Permission Denied', 'Bluetooth permissions are required.');
            return;
        }

        setIsScanning(true);
        bluetoothService.startScan((device) => {
            // In a real app, we would handshake here.
            // For demo, if we find a device with a specific name or just any device for simulation
            // We will simulate finding a payer after a random delay if a device is found
            if (device) {
                bluetoothService.stopScan();
                setIsScanning(false);
                setIncomingTxn({
                    name: device.name || 'Unknown Device',
                    upiId: 'device@bank',
                    amount: 50.00
                });
                setShowConfirm(true);
            }
        });

        // Time out scan after 10 seconds if no device found (or just to stop scan)
        setTimeout(() => {
            if (isScanning) {
                bluetoothService.stopScan();
                setIsScanning(false);
                Alert.alert('No Payer Found', 'Could not find any nearby devices.');
            }
        }, 10000);
    };

    const handleAccept = async () => {
        if (!incomingTxn) return;
        const success = await receiveMoney(incomingTxn.amount, { name: incomingTxn.name, upiId: incomingTxn.upiId });
        if (success) {
            Alert.alert('Payment Received', `Received ₹${incomingTxn.amount} from ${incomingTxn.name}`);
            setShowConfirm(false);
            setIncomingTxn(null);
        } else {
            Alert.alert('Error', 'Failed to process transactions');
        }
    };

    if (showConfirm && incomingTxn) {
        return (
            <ScreenWrapper className="justify-center p-6 bg-neutral-bg dark:bg-neutral-900">
                <Card className="shadow-lg border-neutral-border dark:border-neutral-700 p-6 bg-white dark:bg-neutral-800">
                    <Text className="text-xl font-bold text-center mb-6 text-neutral-text dark:text-white">Payment Request</Text>
                    <View className="items-center mb-8">
                        <View className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full items-center justify-center mb-3 border border-primary/20">
                            <Text className="text-2xl font-bold text-primary dark:text-blue-400">{incomingTxn.name[0]}</Text>
                        </View>
                        <Text className="text-lg font-semibold text-neutral-text dark:text-white">{incomingTxn.name}</Text>
                        <Text className="text-neutral-text-secondary dark:text-neutral-400">{incomingTxn.upiId}</Text>
                    </View>

                    <Text className="text-center text-neutral-text-secondary dark:text-neutral-400 mb-2 font-medium">Sending you</Text>
                    <Text className="text-center text-4xl font-bold mb-10 text-neutral-text dark:text-white">₹{incomingTxn.amount.toFixed(2)}</Text>

                    <View className="flex-row space-x-4">
                        <Button title="Reject" variant="ghost" className="flex-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" onPress={() => setShowConfirm(false)} />
                        <Button title="Accept" className="flex-1" onPress={handleAccept} />
                    </View>
                </Card>
            </ScreenWrapper>
        );
    }

    if (!user) {
        return <LoginPrompt title="Receive Money" description="Please login to receive money via QR or Bluetooth." />;
    }

    return (
        <ScreenWrapper className="p-4 bg-neutral-bg dark:bg-neutral-900">
            <View className="items-center mt-6 mb-8">
                <Text className="text-2xl font-bold text-neutral-text dark:text-white mb-2">Receive Money</Text>
                <Text className="text-neutral-text-secondary dark:text-neutral-400">Scan QR or use Nearby Share</Text>
            </View>

            <Card className="items-center py-10 mb-6 bg-white dark:bg-neutral-800 shadow-lg mx-2 border border-neutral-border dark:border-neutral-700">
                <View className="bg-white p-2 rounded-2xl border-2 border-neutral-border/50 mb-6">
                    <QRCode
                        value={upiUri}
                        size={220}
                        color="black"
                        backgroundColor="white"
                    />
                </View>
                <Text className="font-bold text-xl mt-2 text-neutral-text dark:text-white">
                    {user?.name}
                </Text>
                <Text className="text-neutral-text-secondary dark:text-neutral-400 font-medium mt-1">{user?.upiId}</Text>
            </Card>

            <View className="flex-row justify-center space-x-4 mb-8 mx-2">
                <Button
                    title="Share QR"
                    variant="secondary"
                    onPress={handleShare}
                    icon={<Share2 size={18} color="#2563EB" />}
                    className="flex-1 bg-white dark:bg-neutral-800 border-neutral-border dark:border-neutral-700"
                />
                <Button
                    title={isCopied ? "Copied!" : "Copy ID"}
                    variant={isCopied ? "primary" : "secondary"}
                    onPress={handleCopy}
                    icon={<Copy size={18} color={isCopied ? "#FFFFFF" : "#2563EB"} />}
                    className={`flex-1 ${isCopied ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/30' : 'bg-white dark:bg-neutral-800 border-neutral-border dark:border-neutral-700'}`}
                />
            </View>

            <View className="items-center mt-auto mb-6">
                <Text className="text-neutral-text-secondary dark:text-neutral-400 font-bold mb-4">Nearby Devices</Text>

                {isScanning ? (
                    <View className="flex-row items-center bg-white dark:bg-neutral-800 px-6 py-3 rounded-full border border-neutral-border dark:border-neutral-700">
                        <ActivityIndicator size="small" color="#2563EB" />
                        <Text className="text-neutral-text dark:text-white ml-3 font-medium">Searching for payers...</Text>
                    </View>
                ) : (
                    <Button
                        title="Simulate Bluetooth Receive"
                        variant="ghost"
                        icon={<Bluetooth size={18} color="#2563EB" />}
                        onPress={findPayer}
                        className="bg-white dark:bg-neutral-800 border-neutral-border dark:border-neutral-700 text-primary"
                    />
                )}
            </View>
        </ScreenWrapper>
    );
};
