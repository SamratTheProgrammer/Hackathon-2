import React from 'react';
import { View, Text, TouchableOpacity, ViewProps, TouchableOpacityProps, ScrollView } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export const Card = ({ children, className, ...props }: ViewProps) => (
    <View className={`bg-surface rounded-xl p-4 shadow-sm border border-surface-highlight ${className}`} {...props}>
        {children}
    </View>
);

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    icon?: React.ReactNode;
}

export const Button = ({ title, variant = 'primary', className, icon, ...props }: ButtonProps) => {
    const baseStyle = "flex-row items-center justify-center py-3 px-4 rounded-lg";
    const variants = {
        primary: "bg-nvidia-green",
        secondary: "bg-surface-highlight border border-white/10",
        outline: "bg-transparent border border-nvidia-green",
        ghost: "bg-transparent",
    };
    const textVariants = {
        primary: "text-black font-bold",
        secondary: "text-white font-semibold",
        outline: "text-nvidia-green font-semibold",
        ghost: "text-gray-400",
    };

    return (
        <TouchableOpacity className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
            {icon && <View className="mr-2">{icon}</View>}
            <Text className={`${textVariants[variant]} text-base`}>{title}</Text>
        </TouchableOpacity>
    );
};

export const ScreenWrapper = ({ children, className }: customViewProps) => (
    <SafeAreaView className={`flex-1 bg-dark-bg ${className}`}>
        {children}
    </SafeAreaView>
);

interface customViewProps extends ViewProps {
    children: React.ReactNode;
}
