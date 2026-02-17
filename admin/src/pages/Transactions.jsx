import React from 'react';
import {
    MoreHorizontal,
    Search,
    Filter,
    Download,
    ArrowUpRight,
    ArrowDownLeft
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

const transactionsData = Array.from({ length: 15 }).map((_, i) => ({
    id: `TXN-${5000 + i}`,
    user: `User ${i + 1}`,
    type: i % 2 === 0 ? 'credit' : 'debit',
    amount: `₹${(Math.random() * 5000).toFixed(2)}`,
    status: i % 4 === 0 ? 'success' : i % 4 === 1 ? 'pending' : i % 4 === 2 ? 'failed' : 'success',
    date: '2023-10-25 14:30',
}));

const Transactions = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
                    <p className="text-neutral-muted">View and manage all system transactions.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Export CSV</Button>
                </div>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle>Transaction History</CardTitle>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-muted" />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                className="h-9 w-64 rounded-lg border border-neutral-muted/20 bg-neutral-bg pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:bg-white/5 dark:text-white dark:border-white/10"
                            />
                        </div>
                        <Button variant="outline" size="icon"><Filter size={16} /></Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Txn ID</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Date</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactionsData.map((txn) => (
                                <TableRow key={txn.id}>
                                    <TableCell className="font-medium">{txn.id}</TableCell>
                                    <TableCell>{txn.user}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            {txn.type === 'credit' ? (
                                                <ArrowDownLeft size={16} className="text-status-success" />
                                            ) : (
                                                <ArrowUpRight size={16} className="text-status-failed" />
                                            )}
                                            <span className="capitalize">{txn.type}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className={txn.type === 'credit' ? 'text-status-success font-medium' : 'text-neutral-text'}>
                                        {txn.type === 'credit' ? '+' : '-'}{txn.amount}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={txn.status}>
                                            {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right text-neutral-muted">{txn.date}</TableCell>
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

export default Transactions;
