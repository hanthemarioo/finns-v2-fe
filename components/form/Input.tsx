import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = "", required, ...props }) => {
    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500"
                    }`}
                required={required}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};