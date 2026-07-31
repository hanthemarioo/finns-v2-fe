"use client";

import React, { useState } from "react";
import FeatherIcon from "feather-icons-react";

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
    label: string;
    error?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
    label,
    error,
    className = "",
    required,
    ...props
}) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <input
                    type={isVisible ? "text" : "password"}
                    className={`w-full border rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500"
                        }`}
                    required={required}
                    {...props}
                />
                <button
                    type="button"
                    onClick={() => setIsVisible((current) => !current)}
                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-gray-500 hover:text-gray-700"
                    aria-label={isVisible ? "Sembunyikan password" : "Tampilkan password"}
                >
                    <FeatherIcon icon={isVisible ? "eye-off" : "eye"} size={18} />
                </button>
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};
