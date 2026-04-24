import clsx from "clsx";
import FeatherIcon, { FeatherIconName } from "feather-icons-react";
import { baseItemClass } from "./NavItem";

interface DropdownProps {
    label: string;
    icon: FeatherIconName;
    isOpen: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

export function Dropdown({ label, icon, isOpen, onClick, children }: DropdownProps) {
    return (
        <li className="p-1">
            <button
                onClick={onClick}
                className={clsx(baseItemClass, "w-full text-white")}
            >
                <FeatherIcon icon={icon} className="rounded p-1" />
                <span className="ml-3 flex-1 text-left">{label}</span>
                <FeatherIcon
                    icon="chevron-right"
                    size={16}
                    className={clsx(
                        "transition-transform duration-300 ease-in-out",
                        {
                            "rotate-90": isOpen,
                            "rotate-0": !isOpen,
                        }
                    )}
                />
            </button>

            {isOpen && (
                <ul className="mt-1 space-y-1 text-gray-200">
                    {children}
                </ul>
            )}
        </li>
    );
}