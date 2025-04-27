import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import AccountsList from '@/modules/accounts/components/AccountsList';
import AccountForm from '@/modules/accounts/components/AccountForm';
import { PlusIcon } from '@heroicons/react/24/outline';
import * as Sentry from '@sentry/browser';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await fetch('/api/accounts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch accounts');
        }
        return res.json();
      });

      console.log('Fetched accounts:', session);
      setAccounts(session || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      Sentry.captureException(error);
      setError('Gagal memuat data akun. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleAccountCreated = () => {
    fetchAccounts();
  };

  const handleAccountUpdated = () => {
    fetchAccounts();
  };

  const handleAccountDeleted = async (id) => {
    try {
      const response = await fetch(`/api/accounts?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete account');
      }

      // Refresh accounts list
      fetchAccounts();
    } catch (error) {
      console.error('Error deleting account:', error);
      Sentry.captureException(error);
      setError('Gagal menghapus akun. Silakan coba lagi.');
    }
  };

  // Determine if we're on the main list page
  const isListPage = location.pathname === '/accounts' || location.pathname === '/accounts/';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Bagan Akun</h1>
        {isListPage && (
          <Link 
            to="/accounts/new" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Tambah Akun
          </Link>
        )}
      </div>

      <Routes>
        <Route path="/" element={
          <AccountsList 
            accounts={accounts} 
            loading={loading} 
            error={error} 
            onDelete={handleAccountDeleted} 
          />
        } />
        <Route path="/new" element={
          <AccountForm onAccountCreated={handleAccountCreated} />
        } />
        <Route path="/edit/:id" element={
          <AccountForm onAccountUpdated={handleAccountUpdated} />
        } />
      </Routes>
    </div>
  );
}