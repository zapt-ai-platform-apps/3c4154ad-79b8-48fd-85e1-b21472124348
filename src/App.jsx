import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import Layout from '@/modules/core/layout/Layout';
import Dashboard from '@/modules/dashboard/Dashboard';
import LoginPage from '@/modules/auth/pages/LoginPage';
import AccountsPage from '@/modules/accounts/pages/AccountsPage';
import TransactionsPage from '@/modules/transactions/pages/TransactionsPage';
import JournalsPage from '@/modules/journals/pages/JournalsPage';
import LedgersPage from '@/modules/ledgers/pages/LedgersPage';
import FinancialStatementsPage from '@/modules/financialStatements/pages/FinancialStatementsPage';
import InventoryPage from '@/modules/inventory/pages/InventoryPage';
import FixedAssetsPage from '@/modules/fixedAssets/pages/FixedAssetsPage';
import SettingsPage from '@/modules/settings/pages/SettingsPage';
import LandingPage from '@/modules/landing/LandingPage';
import LoadingScreen from '@/modules/core/components/LoadingScreen';
import ZaptBadge from '@/modules/core/components/ZaptBadge';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

export default function App() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Routes>
        <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/accounts/*" element={
          <ProtectedRoute>
            <Layout>
              <AccountsPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/transactions/*" element={
          <ProtectedRoute>
            <Layout>
              <TransactionsPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/journals/*" element={
          <ProtectedRoute>
            <Layout>
              <JournalsPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/ledgers/*" element={
          <ProtectedRoute>
            <Layout>
              <LedgersPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/financial-statements/*" element={
          <ProtectedRoute>
            <Layout>
              <FinancialStatementsPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/inventory/*" element={
          <ProtectedRoute>
            <Layout>
              <InventoryPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/fixed-assets/*" element={
          <ProtectedRoute>
            <Layout>
              <FixedAssetsPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <Layout>
              <SettingsPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <ZaptBadge />
    </div>
  );
}