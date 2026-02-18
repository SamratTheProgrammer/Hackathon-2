import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Gift, Ticket, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';

// Simple Alert Component for notifications
const Alert = ({ message, type }) => (
    <div className={`p-4 rounded-lg mb-4 ${type === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
        {message}
    </div>
);

const Rewards = () => {
    const [rewards, setRewards] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('rewards');
    const [message, setMessage] = useState(null);

    // Form States
    const [newReward, setNewReward] = useState({ title: '', points: '', description: '' });
    const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', title: '' });

    const API_URL = 'http://localhost:5000/api';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [rewardsRes, couponsRes] = await Promise.all([
                axios.get(`${API_URL}/rewards`),
                axios.get(`${API_URL}/rewards/coupons`)
            ]);
            setRewards(rewardsRes.data);
            setCoupons(couponsRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateReward = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/rewards`, newReward);
            setMessage({ type: 'success', text: 'Reward created successfully' });
            setNewReward({ title: '', points: '', description: '' });
            fetchData();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to create reward' });
        }
    };

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/rewards/coupons`, newCoupon);
            setMessage({ type: 'success', text: 'Coupon created successfully' });
            setNewCoupon({ code: '', discount: '', title: '' });
            fetchData();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to create coupon' });
        }
    };

    const handleDeleteReward = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await axios.delete(`${API_URL}/rewards/${id}`);
            fetchData();
        } catch (error) {
            console.error("Error deleting reward", error);
        }
    };

    const handleDeleteCoupon = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await axios.delete(`${API_URL}/rewards/coupons/${id}`);
            fetchData();
        } catch (error) {
            console.error("Error deleting coupon", error);
        }
    };

    if (loading) return <div className="p-8 text-center text-neutral-muted">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Rewards & Coupons</h1>
                    <p className="text-neutral-muted">Manage loyalty rewards and discount coupons.</p>
                </div>
            </div>

            {message && <Alert message={message.text} type={message.type} />}

            <div className="flex gap-4 border-b border-neutral-muted/20">
                <button
                    className={`pb-2 px-4 font-medium transition-colors ${activeTab === 'rewards' ? 'border-b-2 border-primary text-primary' : 'text-neutral-muted hover:text-neutral-text'}`}
                    onClick={() => setActiveTab('rewards')}
                >
                    Rewards
                </button>
                <button
                    className={`pb-2 px-4 font-medium transition-colors ${activeTab === 'coupons' ? 'border-b-2 border-primary text-primary' : 'text-neutral-muted hover:text-neutral-text'}`}
                    onClick={() => setActiveTab('coupons')}
                >
                    Coupons
                </button>
            </div>

            {activeTab === 'rewards' ? (
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Create Reward Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Reward</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateReward} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Reward Title</label>
                                    <Input
                                        placeholder="e.g. Amazon Gift Card"
                                        value={newReward.title}
                                        onChange={(e) => setNewReward({ ...newReward, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Points Required</label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 500"
                                        value={newReward.points}
                                        onChange={(e) => setNewReward({ ...newReward, points: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Description</label>
                                    <Input
                                        placeholder="Brief description"
                                        value={newReward.description}
                                        onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    <Plus size={16} className="mr-2" /> Create Reward
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Rewards List */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Active Rewards</h3>
                        {rewards.length === 0 ? (
                            <p className="text-neutral-muted">No rewards created yet.</p>
                        ) : (
                            rewards.map((reward) => (
                                <Card key={reward.id} className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-purple-100 text-purple-600 rounded-full dark:bg-purple-900/30">
                                            <Gift size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold">{reward.title}</h4>
                                            <p className="text-sm text-neutral-muted">{reward.points} Points • {reward.description}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleDeleteReward(reward.id)}>
                                        <Trash2 size={18} />
                                    </Button>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Create Coupon Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Coupon</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateCoupon} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Coupon Code</label>
                                    <Input
                                        placeholder="e.g. SAVE50"
                                        value={newCoupon.code}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Discount</label>
                                    <Input
                                        placeholder="e.g. 50% OFF"
                                        value={newCoupon.discount}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Title (Optional)</label>
                                    <Input
                                        placeholder="e.g. Summer Sale"
                                        value={newCoupon.title}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, title: e.target.value })}
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    <Plus size={16} className="mr-2" /> Create Coupon
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Coupons List */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Active Coupons</h3>
                        {coupons.length === 0 ? (
                            <p className="text-neutral-muted">No coupons created yet.</p>
                        ) : (
                            coupons.map((coupon) => (
                                <Card key={coupon.id} className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-100 text-blue-600 rounded-full dark:bg-blue-900/30">
                                            <Ticket size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold">{coupon.code}</h4>
                                            <p className="text-sm text-neutral-muted">{coupon.discount} • {coupon.title}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleDeleteCoupon(coupon.id)}>
                                        <Trash2 size={18} />
                                    </Button>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rewards;
