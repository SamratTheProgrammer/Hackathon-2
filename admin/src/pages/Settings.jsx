import React, { useState } from 'react';
import {
    User,
    Lock,
    Bell,
    Globe,
    Shield,
    Smartphone,
    ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { cn } from '../lib/utils';

const SettingsTab = ({ icon: Icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={cn(
            "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all",
            isActive
                ? "bg-primary text-white shadow-md"
                : "text-neutral-muted hover:bg-neutral-bg hover:text-neutral-text dark:hover:bg-white/5 dark:hover:text-white"
        )}
    >
        <Icon size={18} />
        {label}
    </button>
);

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="text-neutral-muted">Manage your account settings and preferences.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 space-y-2">
                    <SettingsTab icon={User} label="General" isActive={activeTab === 'general'} onClick={() => setActiveTab('general')} />
                    <SettingsTab icon={Lock} label="Security" isActive={activeTab === 'security'} onClick={() => setActiveTab('security')} />
                    <SettingsTab icon={Bell} label="Notifications" isActive={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
                    <SettingsTab icon={Globe} label="Localization" isActive={activeTab === 'localization'} onClick={() => setActiveTab('localization')} />
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    {activeTab === 'general' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="h-20 w-20 rounded-full bg-neutral-bg flex items-center justify-center text-2xl font-bold text-neutral-muted border-2 border-dashed border-neutral-muted/30">
                                            AD
                                        </div>
                                        <Button variant="outline" size="sm">Change Avatar</Button>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">First Name</label>
                                            <Input defaultValue="Admin" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Last Name</label>
                                            <Input defaultValue="User" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Email Address</label>
                                            <Input defaultValue="admin@digitaldhan.com" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Phone Number</label>
                                            <Input defaultValue="+91 98765 43210" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <Button>Save Changes</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Password Management</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Current Password</label>
                                        <Input type="password" />
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">New Password</label>
                                            <Input type="password" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Confirm New Password</label>
                                            <Input type="password" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <Button>Update Password</Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Two-Factor Authentication</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between p-4 border rounded-lg bg-neutral-bg/30">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                                <Shield size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">Text Message (SMS)</h4>
                                                <p className="text-sm text-neutral-muted">Use your mobile phone to receive security codes.</p>
                                            </div>
                                        </div>
                                        <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                            <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                                            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
