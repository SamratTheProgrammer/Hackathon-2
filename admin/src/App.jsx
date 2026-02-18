import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Transactions from './pages/Transactions';
import Rewards from './pages/Rewards';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

import MoneyRequests from './pages/MoneyRequests';

// Placeholder components for other routes
// const KYC = () => <div className="p-4"><h1 className="text-2xl font-bold">KYC Approvals</h1><p className="text-neutral-muted">Coming soon...</p></div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="money-requests" element={<MoneyRequests />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
