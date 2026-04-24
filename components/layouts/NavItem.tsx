import clsx from "clsx";
import FeatherIcon, { FeatherIconName } from "feather-icons-react";
import Link from "next/link";

interface NavItemProps {
    href: string;
    label: string;
    icon?: FeatherIconName;
    active: boolean;
    isChild?: boolean;
}
export const baseItemClass =
    "flex items-center p-2 rounded-md hover:bg-white hover:text-[#fd7d14c0] dark:hover:bg-white";

export const getItemClass = (active: boolean) =>
    clsx(baseItemClass, {
        "text-white dark:text-white": !active,
        "bg-white text-[#fd7d14c0]": active,
    });

export function NavItem({ href, label, icon, active, isChild }: NavItemProps) {


    return (
        <li className={clsx("p-1", { "ml-6 text-sm": isChild })}>
            <Link href={href} className={getItemClass(active)}>
                {icon && <FeatherIcon icon={icon} className="rounded p-1" />}
                <span className="ml-3">{label}</span>
            </Link>
        </li>
    );
}