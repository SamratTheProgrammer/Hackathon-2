import React from 'react';
import { ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';

interface ScreenWrapperProps extends ViewProps {
    className?: string;
    children: React.ReactNode;
}

export function ScreenWrapper({ className, children, ...props }: ScreenWrapperProps) {
    return (
        <SafeAreaView className={twMerge('flex-1 bg-neutral-bg dark:bg-neutral-900', className)} edges={['top', 'left', 'right']} {...props}>
            {children}
        </SafeAreaView>
    );
}
