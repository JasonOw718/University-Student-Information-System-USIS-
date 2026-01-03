import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

    const variants = {
        primary: "bg-[var(--primary)] text-white hover:bg-blue-900 focus:ring-[var(--primary)] shadow-md hover:shadow-lg",
        secondary: "bg-[var(--secondary)] text-white hover:bg-blue-600 focus:ring-[var(--secondary)]",
        outline: "border-2 border-[var(--text-muted)] text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)] bg-transparent",
        ghost: "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)]",
        danger: "bg-[var(--danger)] text-white hover:bg-red-600 focus:ring-[var(--danger)]",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-5 py-2.5 text-base",
        lg: "px-6 py-3 text-lg",
    };

    const variantStyles = variants[variant];
    const sizeStyles = sizes[size];

    return (
        <button
            className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
        </button>
    );
};
