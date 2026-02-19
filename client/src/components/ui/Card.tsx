import React from 'react';
import { View, ViewProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface CardProps extends ViewProps {
    variant?: 'standard' | 'glass';
    className?: string;
}

export function Card({ children, variant = 'standard', className, ...props }: CardProps) {
    const baseStyles = 'rounded-2xl p-4';

    // Note: Glassmorphism often requires absolute positioning of background layers or specific libraries (like expo-blur). 
    // For now, we'll simulate a semi-transparent look if "glass" is requested, or sticking to the design guide.
    // The design guide asked for a glassmorphism option: 
    // Bg: rgba(255, 255, 255, 0.7), Backdrop blur (can't do real backdrop blur easily in standard RN View without expo-blur, using rgba for now)

    const variantStyles = {
        standard: 'bg-white border border-neutral-border shadow-sm shadow-black/5',
        glass: 'bg-white/70 border border-white/20 shadow-sm shadow-black/5', // Fallback for glass without BlurView
    };

    return (
        <View
            className={twMerge(baseStyles, variantStyles[variant], className)}
            {...props}
        >
            {children}
        </View>
    );
}
