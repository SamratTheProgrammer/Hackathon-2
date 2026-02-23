import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
    disabled?: boolean;
    loading?: boolean;
    className?: string; // For overriding styles
    textClassName?: string; // For overriding text styles
    icon?: React.ReactNode;
}

export function UiButton({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    className,
    textClassName,
    icon,
}: ButtonProps) {
    const baseStyles = 'rounded-xl flex-row items-center justify-center p-3.5';

    const variantStyles = {
        primary: '', // Handled by LinearGradient
        secondary: 'border-1.5 border-neutral-border dark:border-neutral-700 bg-transparent',
        ghost: 'bg-transparent',
    };

    const textStyles = {
        primary: 'text-white font-semibold text-base',
        secondary: 'text-primary dark:text-blue-400 font-semibold text-base',
        ghost: 'text-neutral-text-secondary dark:text-neutral-400 font-semibold text-base',
    };

    const buttonContent = (
        <>
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? 'white' : '#2563EB'} style={{ marginRight: 8 }} />
            ) : icon ? (
                <View className="mr-2">{icon}</View>
            ) : null}
            <Text className={twMerge(textStyles[variant], disabled && variant !== 'primary' && 'text-gray-400', textClassName)}>{title}</Text>
        </>
    );

    if (variant === 'primary') {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.8} disabled={disabled || loading}>
                <LinearGradient
                    colors={['#2563EB', '#10B981']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className={twMerge(baseStyles, 'shadow-sm shadow-primary/20', disabled && 'opacity-60', className)}
                >
                    {buttonContent}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            disabled={disabled || loading}
            className={twMerge(
                baseStyles,
                variantStyles[variant],
                disabled && 'bg-gray-100 border-gray-200 opacity-50',
                className
            )}
        >
            {buttonContent}
        </TouchableOpacity>
    );
}
