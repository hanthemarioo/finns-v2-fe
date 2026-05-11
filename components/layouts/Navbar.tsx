"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FeatherIcon from "feather-icons-react";
import { useRouter } from 'next/navigation';
import { logout } from "@/lib/auth";

interface NavbarProps {
    onToggleSidebar: () => void;
}

interface User {
    id: number
    email: string
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const confirmed = window.confirm("Yakin ingin logout?");
        if (!confirmed) return;

        try {
            await logout();
            console.log('Logout berhasil');
            router.push('/login');
        } catch (err: unknown) {
            console.log(err instanceof Error ? err.message : 'Unknown error');
        }
    };

    useEffect(() => {
        const data = localStorage.getItem("user");
        if (data) {
            setUser(JSON.parse(data));
        }
    }, [])

    return (
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <button
                            type="button"
                            onClick={onToggleSidebar}
                            className="inline-flex items-center p-2 text-sm text-gray-400 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        >
                            <span className="sr-only">Open sidebar</span>
                            <FeatherIcon icon="menu" size={20} />
                        </button>
                        <Link href="#" className="flex ml-2 md:mr-24">
                            <span className="text-[#fd7e14] text-2xl font-semibold">Si Ternak</span>
                        </Link>
                    </div>
                    {user && (
                        <div className="relative mx-8 cursor-pointer" onClick={toggleDropdown}>
                            <button
                                type="button"
                                className="flex items-center text-sm focus:ring-2 focus:ring-gray-300"
                            >
                                <div className="mx-4 text-left hidden md:block">
                                    <h1 className="text-md font-bold">{user.email}</h1>
                                </div>
                                <div className="mx-4 text-left md:hidden">
                                    <FeatherIcon icon="user" />
                                </div>
                                <FeatherIcon icon="chevron-down" size={15} className={`dropdown-toggle duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-4 w-48 z-50 text-base  divide-y divide-gray-100 rounded shadow">
                                    <div className="px-4 py-3">
                                        <p className="text-sm text-gray-700">{user.email}</p>
                                    </div>
                                    <ul className="py-1">
                                        <li>
                                            <button
                                                onClick={handleSubmit}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Sign out
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
