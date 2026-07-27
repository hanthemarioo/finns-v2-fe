"use client";

import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { NavItem } from "./NavItem";
import { Dropdown } from "./Dropdown";
import { FeatherIconName } from "feather-icons-react";

interface SidebarProps {
    isOpen?: boolean;
}

type MenuItem = {
    label: string;
    icon: FeatherIconName;
    href?: string;
    key?: string;
    roles?: string[];
    children?: {
        label: string;
        href: string;
    }[];
};

const MENU: MenuItem[] = [
    {
        label: "Dashboard",
        icon: "bar-chart-2",
        href: "/dashboard",
    },
    {
        label: "Farm",
        icon: "home",
        href: "/farms",
        roles: ["super_admin", "admin"],
    },
    {
        label: "Users",
        icon: "users",
        href: "/users",
        roles: ["super_admin"],
    },
    {
        label: "Flock",
        icon: "layers",
        href: "/flocks",
        roles: ["super_admin", "admin"],
    },
    {
        label: "Produksi",
        icon: "plus-circle",
        key: "produksi",
        children: [
            { label: "Fase Layer", href: "/production/layers" },
            { label: "Fase Grower", href: "/production/growers" },
        ],
    },
    {
        label: "Report",
        icon: "file-text",
        key: "report",
        children: [
            { label: "Report Fase Layer", href: "/report/layers" },
            { label: "Report Fase Grower", href: "/report/growers" },
        ],
    },
];

export default function Sidebar({ isOpen }: SidebarProps) {
    const pathname = usePathname();
    const [role, setRole] = useState<string | null>(null);
    const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
        {}
    );

    const visibleMenu = useMemo(() => {
        return MENU.filter((item) => !item.roles || (role && item.roles.includes(role)));
    }, [role]);

    const isActive = (path: string) => pathname.startsWith(path);

    const toggleDropdown = (key: string) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    // auto open dropdown based on active route
    useEffect(() => {
        const updated: Record<string, boolean> = {};

        visibleMenu.forEach((item) => {
            if (item.children && item.key) {
                updated[item.key] = item.children.some((child) =>
                    pathname.startsWith(child.href)
                );
            }
        });

        setOpenDropdowns(updated);
    }, [pathname, visibleMenu]);

    useEffect(() => {
        const data = localStorage.getItem("user");
        if (data) {
            setRole(JSON.parse(data)?.role ?? null);
        }
    }, []);

    return (
        <aside
            className={clsx(
                "sm:translate-x-0 dark:bg-[#fd7e14] fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-[#152B28]",
                {
                    "-translate-x-full": !isOpen,
                    "translate-x-0": isOpen,
                }
            )}
        >
            <div className="h-full px-2 pb-4 overflow-y-auto text-md">
                <ul className="space-y-2 font-medium">
                    {visibleMenu.map((item) => {
                        // dropdown
                        if (item.children && item.key) {
                            return (
                                <Dropdown
                                    key={item.key}
                                    label={item.label}
                                    icon={item.icon}
                                    isOpen={openDropdowns[item.key]}
                                    onClick={() => toggleDropdown(item.key!)}
                                >
                                    {item.children.map((child) => (
                                        <NavItem
                                            key={child.href}
                                            href={child.href}
                                            label={child.label}
                                            active={isActive(child.href)}
                                            isChild
                                        />
                                    ))}
                                </Dropdown>
                            );
                        }

                        // single nav
                        return (
                            <NavItem
                                key={item.href}
                                href={item.href!}
                                icon={item.icon}
                                label={item.label}
                                active={isActive(item.href!)}
                            />
                        );
                    })}
                </ul>
            </div>
        </aside>
    );
}
