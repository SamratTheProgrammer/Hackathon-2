import React from 'react';
import {
    Users,
    CreditCard,
    Wallet,
    Activity,
    TrendingUp,
    TrendingDown,
    MoreHorizontal
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const data = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 5500 },
    { name: 'Jul', value: 7000 },
];

const StatsCard = ({ title, value, change, icon: Icon, trend }) => (
    <Card>
        <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-neutral-muted">{title}</p>
                <div className="rounded-full bg-primary/10 p-2 text-primary dark:bg-white/10 dark:text-white">
                    <Icon size={20} />
                </div>
            </div>
            <div className="flex items-center justify-between mt-4">
                <div className="text-2xl font-bold">{value}</div>
                <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${trend === 'up' ? 'text-status-success bg-status-success/10' : 'text-status-failed bg-status-failed/10'}`}>
                    {trend === 'up' ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                    {change}
                </div>
            </div>
        </CardContent>
    </Card>
);

const Dashboard = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Export Report</Button>
                    <Button size="sm">Download PDF</Button>
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Users"
                    value="12,345"
                    change="+12% from last month"
                    icon={Users}
                    trend="up"
                />
                <StatsCard
                    title="Total Transactions"
                    value="₹45.2 Lakh"
                    change="+8% from last month"
                    icon={CreditCard}
                    trend="up"
                />
                <StatsCard
                    title="Total Revenue"
                    value="₹8.4 Lakh"
                    change="+24% from last month"
                    icon={Wallet}
                    trend="up"
                />
                <StatsCard
                    title="Pending KYC"
                    value="142"
                    change="-5% from last month"
                    icon={Activity}
                    trend="down"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Revenue Analytics</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                                        itemStyle={{ color: '#1F2937' }}
                                    />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-neutral-bg flex items-center justify-center text-lg font-bold text-neutral-muted">
                                            {String.fromCharCode(64 + i)} {/* A, B, C... */}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">User {i}</p>
                                            <p className="text-xs text-neutral-muted">Payment Received</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="font-medium text-sm">+₹2,500.00</span>
                                        <span className="text-xs text-neutral-muted">2 mins ago</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full mt-6">View All Transactions</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
