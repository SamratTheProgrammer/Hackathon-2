import React from 'react';
import {
    Gift,
    Plus,
    Search,
    MoreHorizontal,
    Copy
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '../components/ui/table';

const rewardsData = [
    { id: 'RWD-001', code: 'WELCOME50', description: 'New User Bonus', value: '₹50', type: 'Cashback', status: 'active', used: 1240 },
    { id: 'RWD-002', code: 'FESTIVE100', description: 'Diwali Special', value: '₹100', type: 'Voucher', status: 'expired', used: 850 },
    { id: 'RWD-003', code: 'DIGIPAY20', description: 'Bill Payment Offer', value: '20%', type: 'Discount', status: 'active', used: 3420 },
    { id: 'RWD-004', code: 'REFER500', description: 'Referral Bonus', value: '₹500', type: 'Cashback', status: 'active', used: 560 },
    { id: 'RWD-005', code: 'SUMMER25', description: 'Summer Sale', value: '25%', type: 'Discount', status: 'pending', used: 0 },
];

const Rewards = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Rewards & Coupons</h1>
                    <p className="text-neutral-muted">Manage promotional offers and reward schemes.</p>
                </div>
                <Button>
                    <Plus size={16} className="mr-2" />
                    Create New Offer
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-accent-blue/10 to-transparent border-accent-blue/20">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                        <div className="p-3 rounded-full bg-accent-blue/20 text-accent-blue mb-2">
                            <Gift size={24} />
                        </div>
                        <h3 className="text-2xl font-bold">12</h3>
                        <p className="text-sm font-medium text-neutral-muted">Active Offers</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                        <div className="text-2xl font-bold">₹4.2L</div>
                        <p className="text-sm font-medium text-neutral-muted">Total Rewards Distributed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                        <div className="text-2xl font-bold">5.8k</div>
                        <p className="text-sm font-medium text-neutral-muted">Coupons Redeemed</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle>Active Coupons</CardTitle>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-muted" />
                        <input
                            type="text"
                            placeholder="Search coupons..."
                            className="h-9 w-64 rounded-lg border border-neutral-muted/20 bg-neutral-bg pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:bg-white/5 dark:text-white dark:border-white/10"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Redeemed</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rewardsData.map((reward) => (
                                <TableRow key={reward.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2 font-mono font-medium text-primary dark:text-accent-blue">
                                            {reward.code}
                                            <Copy size={12} className="text-neutral-muted cursor-pointer hover:text-primary" />
                                        </div>
                                    </TableCell>
                                    <TableCell>{reward.description}</TableCell>
                                    <TableCell>{reward.type}</TableCell>
                                    <TableCell className="font-bold">{reward.value}</TableCell>
                                    <TableCell>
                                        <Badge variant={reward.status === 'active' ? 'success' : reward.status === 'pending' ? 'pending' : 'failed'}>
                                            {reward.status.charAt(0).toUpperCase() + reward.status.slice(1)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{reward.used}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal size={16} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Rewards;
