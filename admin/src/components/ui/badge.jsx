import React from 'react';
import { cn } from '../../lib/utils';

const Badge = ({ className, variant = 'default', children, ...props }) => {
    const variants = {
        default: 'border-transparent bg-primary text-white hover:bg-primary/80',
        secondary: 'border-transparent bg-neutral-bg text-neutral-text hover:bg-neutral-bg/80',
        outline: 'text-neutral-text border-neutral-muted/40',
        success: 'border-transparent bg-status-success/15 text-status-success hover:bg-status-success/25',
        pending: 'border-transparent bg-status-pending/15 text-status-pending hover:bg-status-pending/25',
        failed: 'border-transparent bg-status-failed/15 text-status-failed hover:bg-status-failed/25',
        info: 'border-transparent bg-status-info/15 text-status-info hover:bg-status-info/25',
    };

    return (
        <div className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            variants[variant],
            className
        )} {...props}>
            {children}
        </div>
    );
};

export { Badge };
