import { useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import { Shield, Smartphone, Key, LogOut } from "lucide-react";

const Security = () => {
    const [twoFactor, setTwoFactor] = useState(true);

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Security Settings</h1>

            <Card className="divide-y divide-gray-100 p-0">
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Secure your account with OTP.</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={twoFactor}
                            onChange={() => setTwoFactor(!twoFactor)}
                        />
                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-full text-green-600 dark:text-green-400">
                            <Key size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Change Password</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Update your login password regularly.</p>
                        </div>
                    </div>
                    <Button variant="secondary" className="text-sm py-2 px-4 h-auto">Update</Button>
                </div>

                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-full text-red-600 dark:text-red-400">
                            <LogOut size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Auto Logout</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Automatically logout after 15 mins of inactivity.</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </Card>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-4">Active Devices</h2>
            <Card className="divide-y divide-gray-100 p-0">
                <div className="p-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
                            <Smartphone size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">iPhone 14 Pro</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Mumbai, India • Currently Active</p>
                        </div>
                    </div>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">Current</span>
                </div>
                <div className="p-6 flex justify-between items-center opacity-60">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
                            <Smartphone size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Chrome on Windows</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">New Delhi, India • 2 days ago</p>
                        </div>
                    </div>
                    <button className="text-red-600 text-sm font-medium hover:underline">Remove</button>
                </div>
            </Card>
        </div>
    );
};

export default Security;
