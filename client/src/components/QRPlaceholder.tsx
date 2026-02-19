import React from 'react';
import { View, Text } from 'react-native';
import { QrCode, Scan } from 'lucide-react-native';

export const QRPlaceholder = ({ mode = 'scan' }: { mode?: 'scan' | 'generate' }) => (
    <View className="items-center justify-center p-8 bg-surface rounded-2xl border-2 border-dashed border-nvidia-green/50">
        {mode === 'scan' ? (
            <Scan size={80} color="#8BFA35" />
        ) : (
            <QrCode size={120} color="#ffffff" />
        )}
        <Text className="text-gray-400 mt-4 text-center">
            {mode === 'scan' ? 'Align QR code within frame' : 'Scan this QR to pay'}
        </Text>
    </View>
);
