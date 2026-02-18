import { useState, useEffect } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import { Shield, Smartphone, Key, LogOut, Check, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useTransactions } from "../context/TransactionContext";

const Security = () => {
    const { logout } = useTransactions();
    const [settings, setSettings] = useState({
        twoFactorEnabled: false,
        autoLogout: true
    });
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);

    // Password Change State
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [settingsRes, devicesRes] = await Promise.all([
                axios.get(`${API_URL}/security/settings`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_URL}/security/devices`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setSettings(settingsRes.data);
            setDevices(devicesRes.data);
        } catch (error) {
            console.error("Error fetching security data", error);
            // toast.error("Failed to load security settings");
        } finally {
            setLoading(false);
        }
    };

    const toggleSetting = async (key) => {
        const newValue = !settings[key];
        // Optimistic update
        setSettings(prev => ({ ...prev, [key]: newValue }));

        try {
            await axios.put(`${API_URL}/security/settings`,
                { [key]: newValue },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`${key === 'twoFactorEnabled' ? 'Two-Factor Auth' : 'Auto Logout'} updated`);
        } catch (error) {
            // Revert on failure
            setSettings(prev => ({ ...prev, [key]: !newValue }));
            toast.error("Failed to update setting");
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        try {
            await axios.post(`${API_URL}/security/change-password`,
                {
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Password updated successfully");
            setShowPasswordModal(false);
            setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update password");
        }
    };

    const removeDevice = async (id) => {
        try {
            await axios.delete(`${API_URL}/security/devices/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDevices(devices.filter(d => d.id !== id));
            toast.success("Device removed");
        } catch (error) {
            toast.error("Failed to remove device");
        }
    };

    if (loading) return <div>Loading security settings...</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Security Settings</h1>

            <Card className="divide-y divide-gray-100 dark:divide-gray-800 p-0">
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
                            checked={settings.twoFactorEnabled || false}
                            onChange={() => toggleSetting('twoFactorEnabled')}
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
                    <Button variant="secondary" className="text-sm py-2 px-4 h-auto" onClick={() => setShowPasswordModal(true)}>Update</Button>
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
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.autoLogout || false}
                            onChange={() => toggleSetting('autoLogout')}
                        />
                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </Card>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-4">Active Devices</h2>
            <Card className="divide-y divide-gray-100 dark:divide-gray-800 p-0">
                {devices.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">No active devices found.</div>
                ) : (
                    devices.map((device) => (
                        <div key={device.id} className={`p-6 flex justify-between items-center ${!device.isCurrent ? 'opacity-80' : ''}`}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
                                    <Smartphone size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">{device.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {device.location} • {device.isCurrent ? 'Currently Active' : `Last active ${new Date(device.lastActive).toLocaleDateString()}`}
                                    </p>
                                </div>
                            </div>
                            {device.isCurrent ? (
                                <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">Current</span>
                            ) : (
                                <button
                                    onClick={() => removeDevice(device.id)}
                                    className="text-red-600 dark:text-red-400 text-sm font-medium hover:underline"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))
                )}
            </Card>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Change Password</h3>
                            <button onClick={() => setShowPasswordModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    value={passwords.currentPassword}
                                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <Button type="button" variant="ghost" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
                                <Button type="submit">Update Password</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Security;
