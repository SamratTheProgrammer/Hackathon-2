import React from 'react';
import { View, Text } from 'react-native';
import { UiButton as Button } from './UiButton';
import { User } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

interface LoginPromptProps {
    title?: string;
    description?: string;
}

export const LoginPrompt: React.FC<LoginPromptProps> = ({
    title = "Login Required",
    description = "Please login to access this feature."
}) => {
    const navigation = useNavigation<any>();

    return (
        <View className="flex-1 items-center justify-center p-6 bg-neutral-bg dark:bg-neutral-900">
            <View className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full items-center justify-center mb-6 border border-primary/20">
                <User size={40} color="#2563EB" />
            </View>
            <Text className="text-2xl font-bold text-neutral-text dark:text-white mb-2 text-center">{title}</Text>
            <Text className="text-neutral-text-secondary dark:text-neutral-400 text-center mb-8 px-4 leading-6">
                {description}
            </Text>
            <Button
                title="Login / Sign Up"
                onPress={() => navigation.navigate('Login')}
                variant="primary"
                className="w-full shadow-lg shadow-primary/30"
            />
        </View>
    );
};
