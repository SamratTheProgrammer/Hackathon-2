import { BleManager, Device, BleError, ScanMode } from 'react-native-ble-plx';
import { PermissionsAndroid, Platform } from 'react-native';

const SERVICE_UUID = '0000180D-0000-1000-8000-00805F9B34FB'; // Example UUID (Heart Rate Service for demo, replace with custom)

class BluetoothService {
    manager: BleManager | null = null;

    constructor() {
        try {
            this.manager = new BleManager();
        } catch (error) {
            console.warn('Bluetooth Manager could not be initialized. Are you running in Expo Go? Native modules for BLE are not available in Expo Go. Use a Development Build.', error);
        }
    }

    async requestPermissions(): Promise<boolean> {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
            ]);

            return (
                granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
                granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
                granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED
            );
        }
        return true;
    }

    startScan(onDeviceFound: (device: Device) => void) {
        const manager = this.manager;
        if (!manager) {
            console.warn('Bluetooth not initialized');
            return;
        }
        manager.startDeviceScan([SERVICE_UUID], { allowDuplicates: false, scanMode: ScanMode.LowLatency }, (error, device) => {
            if (error) {
                console.log('BLE Scan Error:', error);
                return;
            }
            if (device && device.name) {
                onDeviceFound(device);
            }
        });
    }

    stopScan() {
        const manager = this.manager;
        if (!manager) return;
        manager.stopDeviceScan();
    }

    async advertise() {
        // Advertising is complex on react-native-ble-plx and often requires native modules or different libraries for generic advertising. 
        // For this demo, we will focus on scanning. A real offline payment system would use a library like react-native-nearby-messages or platform specific APIs.
        console.log('Advertising not effectively supported in pure ble-plx for all android versions without extra setup.');
    }
}

export const bluetoothService = new BluetoothService();
