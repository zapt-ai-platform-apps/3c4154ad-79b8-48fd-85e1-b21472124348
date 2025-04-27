import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const AccountsList = ({ accounts, loading, error, onDelete }) => {
  const [filter, setFilter] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  // Group accounts by category
  const groupedAccounts = accounts.reduce((acc, account) => {
    const category = account.categoryName || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(account);
    return acc;
  }, {});
  
  // Filter accounts
  const filteredGroupedAccounts = {};
  Object.keys(groupedAccounts).forEach(category => {
    const filteredAccounts = groupedAccounts[category].filter(account => 
      account.code.toLowerCase().includes(filter.toLowerCase()) || 
      account.name.toLowerCase().includes(filter.toLowerCase())
    );
    
    if (filteredAccounts.length > 0) {
      filteredGroupedAccounts[category] = filteredAccounts;
    }
  });
  
  const handleDeleteClick = (accountId) => {
    setConfirmDelete(accountId);
  };
  
  const handleConfirmDelete = () => {
    if (confirmDelete) {
      onDelete(confirmDelete);
      setConfirmDelete(null);
    }
  };
  
  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="w-64">
          <input
            type="text"
            placeholder="Cari akun..."
            className="form-input"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div>
          <span className="text-sm text-gray-500">
            Total Akun: <span className="font-medium">{accounts.length}</span>
          </span>
        </div>
      </div>
      
      {Object.keys(filteredGroupedAccounts).length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center text-gray-500">
          Tidak ada akun yang ditemukan.
        </div>
      ) : (
        <div className="space-y-8">
          {Object.keys(filteredGroupedAccounts).map(category => (
            <div key={category} className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 bg-gray-50 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{category}</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {filteredGroupedAccounts[category].map(account => (
                  <li key={account.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-3 px-2.5 py-0.5 rounded">
                          {account.code}
                        </span>
                        <span className="text-gray-900 font-medium">{account.name}</span>
                        {!account.isActive && (
                          <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Tidak Aktif
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Link 
                          to={`/accounts/edit/${account.id}`} 
                          className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </Link>
                        <button 
                          className="text-red-600 hover:text-red-800 cursor-pointer"
                          onClick={() => handleDeleteClick(account.id)}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    {account.description && (
                      <p className="mt-1 text-sm text-gray-500">{account.description}</p>
                    )}
                    <div className="mt-2 text-xs text-gray-500">
                      <span className={`mr-3 ${account.normalBalance === 'debit' ? 'text-green-600' : 'text-red-600'}`}>
                        Saldo Normal: {account.normalBalance === 'debit' ? 'Debit' : 'Kredit'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      
      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Hapus Akun
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Apakah Anda yakin ingin menghapus akun ini? Tindakan ini tidak dapat dibatalkan dan dapat mempengaruhi data transaksi yang terkait.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                  onClick={handleConfirmDelete}
                >
                  Hapus
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                  onClick={handleCancelDelete}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsList;