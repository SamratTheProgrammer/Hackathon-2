import React from 'react';
import {
    BarChart3,
    Calendar,
    Download,
    FileText,
    PieChart as PieChartIcon,
    TrendingUp,
    Share2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';

const monthlyData = [
    { name: 'Jan', revenue: 4000, users: 2400 },
    { name: 'Feb', revenue: 3000, users: 1398 },
    { name: 'Mar', revenue: 2000, users: 9800 },
    { name: 'Apr', revenue: 2780, users: 3908 },
    { name: 'May', revenue: 1890, users: 4800 },
    { name: 'Jun', revenue: 2390, users: 3800 },
    { name: 'Jul', revenue: 3490, users: 4300 },
];

const deviceData = [
    { name: 'Mobile App', value: 400 },
    { name: 'Web Portal', value: 300 },
    { name: 'Tablet', value: 300 },
    { name: 'Other', value: 200 },
];

const COLORS = ['#0F172A', '#3B82F6', '#14B8A6', '#F59E0B'];

const Reports = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Analytics & Reports</h1>
                    <p className="text-neutral-muted">Deep dive into system performance and trends.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Calendar size={16} className="mr-2" />
                        Last 30 Days
                    </Button>
                    <Button>
                        <Download size={16} className="mr-2" />
                        Download PDF
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Revenue vs User Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis yAxisId="left" orientation="left" stroke="#3B82F6" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis yAxisId="right" orientation="right" stroke="#0F172A" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                                        itemStyle={{ color: '#1F2937' }}
                                    />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Revenue (₹)" />
                                    <Bar yAxisId="right" dataKey="users" fill="#0F172A" radius={[4, 4, 0, 0]} name="New Users" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Traffic Sources</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full flex justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={deviceData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {deviceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="cursor-pointer hover:border-primary/50 transition-colors group">
                        <CardContent className="p-6 flex items-start justify-between">
                            <div className="space-y-2">
                                <div className="p-2 w-fit rounded-lg bg-neutral-bg group-hover:bg-primary/10 transition-colors">
                                    <FileText size={24} className="text-neutral-muted group-hover:text-primary transition-colors" />
                                </div>
                                <h4 className="font-semibold pt-2">Monthly Transaction Report</h4>
                                <p className="text-xs text-neutral-muted">Generated on Oct 01, 2023</p>
                            </div>
                            <Button variant="ghost" size="icon" className="text-neutral-muted hover:text-primary">
                                <Download size={18} />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Reports;
