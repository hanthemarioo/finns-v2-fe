// components/Input.tsx
import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    name: string;
    showLabel?: boolean;
    error?: string;
    wrapperClassName?: string;
}

const Input: React.FC<InputProps> = ({
    label,
    showLabel = true,
    type = 'text',
    name,
    error,
    className = '',
    wrapperClassName = '',
    id,
    ...props
}) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-') || undefined;

    return (
        <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
            {showLabel && label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                type={type}
                name={name}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:border-blue-500 ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
                {...props}
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
};

export default Input;
