import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = 'http://localhost:5000/api';

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get(`${API_URL}/transactions/all`);
            setTransactions(response.data);
        } catch (error) {
            console.error("Error fetching transactions", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-6">Loading transactions...</div>;

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
                    <CardTitle>Transaction History ({transactions.length})</CardTitle>
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
                            {transactions.map((txn) => (
                                <TableRow key={txn.id}>
                                    <TableCell className="font-medium text-xs">{txn.id.substring(0, 8)}...</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{txn.user?.name || "Unknown"}</span>
                                            <span className="text-xs text-neutral-muted">{txn.user?.email}</span>
                                        </div>
                                    </TableCell>
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
                                        {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            txn.status === 'Success' ? 'success' :
                                                txn.status === 'Pending' ? 'warning' : 'destructive'
                                        }>
                                            {txn.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right text-neutral-muted text-xs">
                                        {new Date(txn.date).toLocaleString()}
                                    </TableCell>
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
