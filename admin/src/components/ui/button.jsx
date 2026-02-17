import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({
    className,
    variant = 'primary',
    size = 'default',
    isLoading = false,
    children,
    ...props
}, ref) => {
    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-light active:bg-primary-dark shadow-[0_4px_14px_0_rgba(15,23,42,0.39)] transition-all duration-200',
        secondary: 'bg-white text-neutral-text border border-neutral-muted/20 hover:bg-neutral-bg shadow-sm',
        outline: 'border-2 border-primary text-primary hover:bg-primary/5',
        ghost: 'text-neutral-text hover:bg-neutral-bg/50',
        danger: 'bg-status-failed text-white hover:bg-red-600 shadow-md',
        success: 'bg-status-success text-white hover:bg-emerald-600 shadow-md',
    };

    const sizes = {
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-4 py-2 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10 p-2 flex items-center justify-center',
    };

    return (
        <button
            ref={ref}
            className={cn(
                'inline-flex items-center justify-center rounded-lg font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
});

Button.displayName = "Button";

export { Button };
