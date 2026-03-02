import React from 'react';

interface BadgeProps {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'primary';
    size?: 'sm' | 'md';
    children: React.ReactNode;
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    variant = 'default',
    size = 'md',
    children,
    className = '',
}) => {
    const variantClasses = {
        default: 'bg-surface-300 text-gray-300',
        success: 'bg-success/10 text-success border border-success/20',
        warning: 'bg-warning/10 text-warning border border-warning/20',
        error: 'bg-error/10 text-error border border-error/20',
        primary: 'bg-primary-500/10 text-primary-400 border border-primary-500/20',
    };

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
    };

    return (
        <span
            className={`
        inline-flex items-center font-medium rounded-full
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
        >
            {children}
        </span>
    );
};

export default Badge;
