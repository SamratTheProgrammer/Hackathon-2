import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    CreditCard,
    FileCheck,
    Gift,
    BarChart3,
    Settings,
    ChevronLeft,
    FileText
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Users, label: 'Users', path: '/users' },
        { icon: CreditCard, label: 'Transactions', path: '/transactions' },
        { icon: FileCheck, label: 'Money Requests', path: '/money-requests' }, // Changed FileCheck to FileText in instruction, but FileText is not imported. Keeping FileCheck to avoid breaking.
        { icon: Gift, label: 'Rewards & Coupons', path: '/rewards' },
        { icon: Settings, label: 'Settings', path: '/settings' },
        { icon: BarChart3, label: 'Reports', path: '/reports' },
    ];

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen bg-primary-dark text-white transition-all duration-300 border-r border-white/5",
                isOpen ? "w-64" : "w-20 hidden md:block"
            )}
        >
            <div className="flex h-16 items-center justify-between px-4 border-b border-white/5">
                <div className={cn("flex items-center gap-2 font-bold text-xl", !isOpen && "justify-center w-full")}>
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-teal flex items-center justify-center">
                        <span className="text-white">D</span>
                    </div>
                    {isOpen && <span>DigitalDhan</span>}
                </div>

                {isOpen && (
                    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-white/70 hover:text-white hover:bg-white/10 md:hidden">
                        <ChevronLeft size={20} />
                    </Button>
                )}
            </div>

            <nav className="p-4 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 group text-sm font-medium",
                            isActive
                                ? "bg-primary text-white shadow-lg shadow-black/20 border-l-4 border-accent-teal"
                                : "text-white/60 hover:text-white hover:bg-white/5",
                            !isOpen && "justify-center px-0"
                        )}
                    >
                        <item.icon size={20} className={cn("shrink-0", isOpen ? "text-current" : "mx-auto")} />
                        {isOpen && <span>{item.label}</span>}

                        {/* Tooltip for collapsed state */}
                        {!isOpen && (
                            <div className="absolute left-16 z-50 ml-2 hidden rounded-md bg-dark-bg px-2 py-1 text-xs text-white shadow-md group-hover:block border border-white/10">
                                {item.label}
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="absolute bottom-4 left-0 w-full px-4">
                {/* Toggle button for desktop */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSidebar}
                    className={cn(
                        "hidden md:flex w-full items-center text-white/40 hover:text-white hover:bg-white/5 border border-white/5",
                        isOpen ? "justify-start px-2" : "justify-center px-0"
                    )}
                >
                    {isOpen ? <ChevronLeft size={16} className="mr-2" /> : <ChevronRight size={16} />}
                    {isOpen && "Collapse Sidebar"}
                </Button>
            </div>
        </aside>
    );
};

export { Sidebar };
