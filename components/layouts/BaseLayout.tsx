"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { NavigationProgress } from "./NavigationProgress";

export default function BaseLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            <NavigationProgress />
            <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Sidebar isOpen={isSidebarOpen} />
            <div className="min-h-screen bg-gray-100 p-2 mt-4 sm:ml-64">
                <div className="p-4 mt-8">{children}</div>
                <Footer />
            </div>
        </>
    );
}
