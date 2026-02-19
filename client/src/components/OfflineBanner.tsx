import React from 'react';
import { View, Text } from 'react-native';
import { WifiOff } from 'lucide-react-native';

export const OfflineBanner = () => (
    <View className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 flex-row items-center justify-center p-2 mb-4 rounded-lg">
        <WifiOff size={16} color="#f97316" />
        <Text className="text-orange-800 dark:text-orange-400 font-medium ml-2">Offline Mode Active</Text>
    </View>
);
