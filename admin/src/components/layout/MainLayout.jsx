import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '../../lib/utils';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-neutral-bg dark:bg-dark-bg text-neutral-text dark:text-dark-text font-sans">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

            <main
                className={cn(
                    "transition-all duration-300 p-6",
                    isSidebarOpen ? "md:ml-64" : "md:ml-20"
                )}
            >
                <div className="mx-auto max-w-7xl animate-in fade-in zoom-in duration-500">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export { MainLayout };
