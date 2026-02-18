import React, { useState, useEffect } from 'react';
import { Bell, Search, Menu, Sun, Moon } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

const Header = ({ toggleSidebar, isSidebarOpen }) => {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    return (
        <header className={cn(
            "sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-muted/10 bg-white/80 px-6 backdrop-blur-md transition-all duration-300 dark:bg-dark-bg/80 dark:border-white/5",
            isSidebarOpen ? "md:ml-64" : "md:ml-20"
        )}>
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="mr-2 md:hidden"
                >
                    <Menu size={20} />
                </Button>

                <div className="relative hidden sm:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-muted" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="h-9 w-64 rounded-lg border border-neutral-muted/20 bg-neutral-bg pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:bg-white/5 dark:text-white dark:border-white/10"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsDark(!isDark)}
                    className="text-neutral-muted hover:text-primary"
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </Button>

                <Button variant="ghost" size="icon" className="text-neutral-muted hover:text-primary relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-status-failed ring-2 ring-white dark:ring-dark-bg"></span>
                </Button>

                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-primary-light flex items-center justify-center text-white text-xs font-bold ring-2 ring-white/20">
                    AD
                </div>
            </div>
        </header>
    );
};

export { Header };
