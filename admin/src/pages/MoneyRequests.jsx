import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, Search, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const MoneyRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    // Hardcoded for now, should come from env or config
    const API_URL = 'http://localhost:5000/api';
    const ADMIN_TOKEN = localStorage.getItem('adminToken'); // Assuming admin auth? Or just using dev mode.

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            // In a real app, use auth headers
            const response = await axios.get(`${API_URL}/transactions/pending`);
            setRequests(response.data);
        } catch (error) {
            console.error("Error fetching requests", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await axios.put(`${API_URL}/transactions/${id}/status`, {
                status: 'Success'
            });
            fetchRequests(); // Refresh list
        } catch (error) {
            console.error("Error approving request", error);
        }
    };

    const openRejectModal = (request) => {
        setSelectedRequest(request);
        setRejectionReason("");
        setShowRejectModal(true);
    };

    const handleReject = async () => {
        if (!selectedRequest || !rejectionReason) return;
        try {
            await axios.put(`${API_URL}/transactions/${selectedRequest.id}/status`, {
                status: 'Failed',
                rejectionReason
            });
            setShowRejectModal(false);
            fetchRequests();
        } catch (error) {
            console.error("Error rejecting request", error);
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Money Requests</h1>
                    <p className="text-neutral-muted">Approve or reject money addition requests.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Pending Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    {requests.length === 0 ? (
                        <div className="text-center py-10 text-neutral-muted">
                            <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>No pending requests</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-neutral-bg dark:bg-white/5 text-neutral-muted uppercase font-medium">
                                    <tr>
                                        <th className="px-4 py-3">User</th>
                                        <th className="px-4 py-3">Amount</th>
                                        <th className="px-4 py-3">Method</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-muted/10">
                                    {requests.map((req) => (
                                        <tr key={req.id} className="hover:bg-neutral-bg/50 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="font-semibold">{req.user?.name || "Unknown"}</p>
                                                    <p className="text-xs text-neutral-muted">{req.user?.email}</p>
                                                    <p className="text-xs text-neutral-muted">{req.user?.mobile}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-bold text-green-500">
                                                ₹{req.amount}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant="outline">{req.to}</Badge>
                                            </td>
                                            <td className="px-4 py-3 text-neutral-muted">
                                                {new Date(req.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-right space-x-2">
                                                <Button size="sm" variant="outline" className="text-green-500 border-green-500 hover:bg-green-500/10" onClick={() => handleApprove(req.id)}>
                                                    <Check size={16} className="mr-1" /> Approve
                                                </Button>
                                                <Button size="sm" variant="outline" className="text-red-500 border-red-500 hover:bg-red-500/10" onClick={() => openRejectModal(req)}>
                                                    <X size={16} className="mr-1" /> Reject
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-dark-card rounded-xl shadow-xl w-full max-w-md p-6 border border-neutral-muted/20">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-500">
                            <AlertCircle size={20} /> Reject Request
                        </h3>
                        <p className="mb-4 text-neutral-muted">
                            Are you sure you want to reject the request of <strong>₹{selectedRequest?.amount}</strong> from <strong>{selectedRequest?.user?.name}</strong>?
                        </p>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Reason for Rejection</label>
                            <textarea
                                className="w-full p-3 rounded-lg border border-neutral-muted/20 bg-neutral-bg dark:bg-dark-bg focus:ring-2 focus:ring-primary outline-none min-h-[100px]"
                                placeholder="Enter reason (e.g., Payment receipt invalid)"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setShowRejectModal(false)}>Cancel</Button>
                            <Button variant="danger" onClick={handleReject} disabled={!rejectionReason}>Reject Request</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MoneyRequests;
