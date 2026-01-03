import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onRightIconClick?: () => void;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    leftIcon,
    rightIcon,
    onRightIconClick,
    className = '',
    id,
    ...props
}) => {
    const inputId = id || props.name;

    return (
        <div className="w-full space-y-1">
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-[var(--text-secondary)]">
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                        {leftIcon}
                    </div>
                )}
                <input
                    id={inputId}
                    className={`
            w-full rounded-lg border border-gray-300 bg-white 
            ${leftIcon ? 'pl-10' : 'px-3'} 
            ${rightIcon ? 'pr-10' : 'pr-3'}
            py-2.5
            text-[var(--text-primary)] placeholder-[var(--text-muted)]
            focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent
            transition-colors
            disabled:bg-gray-50 disabled:text-gray-500
            ${error ? 'border-[var(--danger)] focus:ring-[var(--danger)]' : ''}
            ${className}
          `}
                    {...props}
                />
                {rightIcon && (
                    <div
                        className={`absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-muted)] ${onRightIconClick ? 'cursor-pointer hover:text-[var(--text-primary)]' : ''}`}
                        onClick={onRightIconClick}
                    >
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
        </div>
    );
};
