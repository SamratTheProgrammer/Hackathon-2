import React, { useState } from 'react';
// Input component
import { TextInput, View, Text, TextInputProps } from 'react-native';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerClassName?: string;
    icon?: React.ReactNode;
}

export function InputField({
    label,
    error,
    containerClassName,
    className,
    icon,
    onFocus,
    onBlur,
    ...props
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View className={twMerge('mb-4', containerClassName)}>
            {label && <Text className="text-neutral-text dark:text-gray-300 text-sm font-medium mb-1.5">{label}</Text>}

            <View
                className={clsx(
                    'flex-row items-center bg-white dark:bg-neutral-800 border rounded-xl overflow-hidden transition-all',
                    isFocused ? 'border-primary ring-2 ring-primary/20' : 'border-neutral-border dark:border-neutral-700',
                    error ? 'border-status-error' : '',
                    props.editable === false ? 'bg-gray-50 dark:bg-neutral-900' : ''
                )}
            >
                {icon && <View className="pl-3 pr-1">{icon}</View>}

                <TextInput
                    className={twMerge(
                        'flex-1 p-3 text-neutral-text dark:text-white text-base',
                        className
                    )}
                    placeholderTextColor="#94A3B8"
                    onFocus={(e) => {
                        setIsFocused(true);
                        onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        onBlur?.(e);
                    }}
                    {...props}
                />
            </View>

            {error && <Text className="text-status-error text-xs mt-1">{error}</Text>}
        </View>
    );
}
