import React from 'react';

interface ButtonProps {
    text?: string;
    type?: 'button' | 'reset' | 'submit';
    color?: 'green' | 'blue' | 'red' | 'yellow' | 'purple' | 'gray' | 'orange';
    disabled?: boolean; // ✅ tambahan
    onClick?: React.MouseEventHandler<HTMLButtonElement>; // optional biar reusable
}

const Button: React.FC<ButtonProps> = ({
    text = 'Click me',
    color = 'red',
    type = 'button',
    disabled = false,
    onClick,
}) => {
    const baseClasses =
        'text-white font-semibold rounded-md px-2 py-1 transition';

    const colorClasses: Record<string, string> = {
        green: 'bg-green-500',
        orange: 'bg-orange-500',
        blue: 'bg-blue-500',
        red: 'bg-[#ff4857]',
        yellow: 'bg-yellow-500',
        purple: 'bg-purple-500',
        gray: 'bg-gray-500',
    };

    const stateClasses = disabled
        ? 'opacity-50 cursor-not-allowed'
        : 'hover:opacity-80 cursor-pointer';

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`${baseClasses} ${colorClasses[color]} ${stateClasses}`}
        >
            {text}
        </button>
    );
};

export default Button;