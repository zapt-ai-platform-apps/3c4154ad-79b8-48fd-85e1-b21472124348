import React, { useState, useEffect } from 'react';
import { accountsService } from '../services/accountsService';
import * as Sentry from '@sentry/browser';

const AccountsList = ({ onEdit, onDelete }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchAccounts();
  }, []);
  
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await accountsService.getAllAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      Sentry.captureException(error);
      setError('Failed to load accounts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (account) => {
    if (onEdit) onEdit(account);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await accountsService.deleteAccount(id);
        setAccounts(accounts.filter(account => account.id !== id));
        if (onDelete) onDelete(id);
      } catch (error) {
        console.error('Error deleting account:', error);
        Sentry.captureException(error);
        alert('Failed to delete account. Please try again.');
      }
    }
  };
  
  const filteredAccounts = accounts.filter(account => {
    return (
      account.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading accounts...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={fetchAccounts}
              className="mt-2 text-sm text-red-700 hover:text-red-600 font-medium cursor-pointer"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg bg-white">
      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="Search accounts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="box-border w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Code</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Normal Balance</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredAccounts.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-3 py-4 text-sm text-gray-500 text-center">
                  No accounts found
                </td>
              </tr>
            ) : (
              filteredAccounts.map((account) => (
                <tr key={account.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{account.code}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{account.name}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{account.categoryName}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">{account.normalBalance}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${account.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {account.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button
                      onClick={() => handleEdit(account)}
                      className="text-blue-600 hover:text-blue-900 mr-4 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="text-red-600 hover:text-red-900 cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountsList;