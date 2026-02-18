import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    MoreHorizontal,
    Search,
    Filter,
    Download,
    UserCircle
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

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = 'http://localhost:5000/api';

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/users`);
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-6">Loading users...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Users Management</h1>
                    <p className="text-neutral-muted">Manage your user base and permissions.</p>
                </div>
                <Button>Add New User</Button>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle>All Users ({users.length})</CardTitle>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-muted" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="h-9 w-64 rounded-lg border border-neutral-muted/20 bg-neutral-bg pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:bg-white/5 dark:text-white dark:border-white/10"
                            />
                        </div>
                        <Button variant="outline" size="icon"><Filter size={16} /></Button>
                        <Button variant="outline" size="icon"><Download size={16} /></Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">UserID</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Mobile</TableHead>
                                <TableHead>Joined Date</TableHead>
                                <TableHead className="text-right">Wallet Balance</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium text-xs">{user.id.substring(0, 8)}...</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{user.name}</span>
                                            <span className="text-xs text-neutral-muted">{user.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="success">Active</Badge>
                                    </TableCell>
                                    <TableCell>{user.mobile}</TableCell>
                                    <TableCell>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right font-medium">₹{user.balance?.toFixed(2)}</TableCell>
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

export default Users;
