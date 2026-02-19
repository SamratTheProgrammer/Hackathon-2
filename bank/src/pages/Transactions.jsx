import { useState } from "react";
import Card from "../components/Card";
import { Download, Search, Filter } from "lucide-react";
import Modal from "../components/Modal";
import { useTransactions } from "../context/TransactionContext";

const Transactions = () => {
    const { transactions } = useTransactions();
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const getStatusColor = (status) => {
        switch (status) {
            case "Success": return "bg-green-100 text-green-700";
            case "Pending": return "bg-yellow-100 text-yellow-700";
            case "Failed": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transaction History</h1>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">
                        <Filter size={16} /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm">
                        <Download size={16} /> Download Statement
                    </button>
                </div>
            </div>

            <Card className="overflow-hidden p-0 dark:bg-gray-800">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or amount..."
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-medium">Transaction Details</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {transactions.map((tx) => (
                                <tr key={tx.id} onClick={() => setSelectedTransaction(tx)} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">{tx.to}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">ID: #TXN{202600 + tx.id}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {tx.date}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-bold text-sm ${tx.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                                        {tx.type === 'credit' ? '+' : ''} {Math.abs(tx.amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal
                isOpen={!!selectedTransaction}
                onClose={() => setSelectedTransaction(null)}
                title="Transaction Details"
            >
                {selectedTransaction && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 dark:text-gray-400">Transaction ID</span>
                            <span className="font-mono font-medium text-gray-900 dark:text-white">#TXN{202600 + selectedTransaction.id}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 dark:text-gray-400">Date</span>
                            <span className="font-medium text-gray-900 dark:text-white">{selectedTransaction.date}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 dark:text-gray-400">Status</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTransaction.status)}`}>
                                {selectedTransaction.status}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 dark:text-gray-400">Amount</span>
                            <span className={`font-bold ${selectedTransaction.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                                {selectedTransaction.type === 'credit' ? '+' : ''} {Math.abs(selectedTransaction.amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                            </span>
                        </div>

                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-start">
                                <span className="text-gray-500 dark:text-gray-400">To/From</span>
                                <span className="font-bold text-gray-900 dark:text-white text-right">{selectedTransaction.to}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                            <span className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Remarks</span>
                            <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg text-sm">
                                {selectedTransaction.remarks || "No remarks provided"}
                            </p>
                        </div>

                        {selectedTransaction.status === 'Failed' && selectedTransaction.rejectionReason && (
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                <span className="block text-sm text-red-500 mb-1">Rejection Reason</span>
                                <p className="text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-sm">
                                    {selectedTransaction.rejectionReason}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Transactions;
