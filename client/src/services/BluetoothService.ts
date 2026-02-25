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

    async connectAndWrite(deviceId: string, payload: string): Promise<boolean> {
        const manager = this.manager;
        if (!manager) return false;

        try {
            console.log(`Connecting to ${deviceId}...`);
            const device = await manager.connectToDevice(deviceId);
            console.log(`Discovering services for ${deviceId}...`);
            await device.discoverAllServicesAndCharacteristics();

            // In a real scenario, we'd find the specific service/characteristic
            // Here we assume we just write to the first writable characteristic of the target service
            const services = await device.services();
            let characteristicFound = null;

            for (const service of services) {
                if (service.uuid.toUpperCase() === SERVICE_UUID.toUpperCase() || true) { // Relaxed for demo
                    const characteristics = await service.characteristics();
                    for (const char of characteristics) {
                        if (char.isWritableWithResponse || char.isWritableWithoutResponse) {
                            characteristicFound = char;
                            break;
                        }
                    }
                }
                if (characteristicFound) break;
            }

            if (characteristicFound) {
                // Encode payload to base64
                // A lightweight base64 encoder since atob/btoa might not be perfect in RN
                const base64Payload = Buffer.from(payload).toString('base64');

                if (characteristicFound.isWritableWithResponse) {
                    await characteristicFound.writeWithResponse(base64Payload);
                } else {
                    await characteristicFound.writeWithoutResponse(base64Payload);
                }
                console.log('Payload written successfully via Bluetooth');
                await manager.cancelDeviceConnection(deviceId);
                return true;
            } else {
                console.warn('No writable characteristic found');
                await manager.cancelDeviceConnection(deviceId);
                return false;
            }

        } catch (error) {
            console.error('BLE Connect & Write Error:', error);
            try { await manager.cancelDeviceConnection(deviceId); } catch (e) { }
            return false;
        }
    }

    startForegroundListener(onDataReceived: (data: string) => void) {
        // Real peripheral mode (acting as a GATT server to receive writes) 
        // is NOT supported natively by react-native-ble-plx.
        // It only acts as a Central.
        // To build a true P2P offline mesh, we would need a library like:
        // react-native-ble-peripheral or Google Nearby Connections API.

        // FOR THIS HACKATHON DEMO:
        // We will simulate the "listener" by having the Receiver "scan"
        // and if it finds the Payer's advertised name (e.g. "DigiDhan_Payer"),
        // it triggers the receive.

        console.log('Peripheral mode mock listener started');
    }

    async advertise() {
        console.log('Advertising not effectively supported in pure ble-plx for all android versions without extra setup.');
    }

    async enableBluetooth(): Promise<boolean> {
        if (!this.manager) return false;
        try {
            await this.manager.enable();
            return true;
        } catch (error) {
            console.log('Could not enable Bluetooth:', error);
            return false;
        }
    }
}

export const bluetoothService = new BluetoothService();
