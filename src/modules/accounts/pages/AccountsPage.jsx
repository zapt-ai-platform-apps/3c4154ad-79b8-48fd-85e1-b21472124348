import React, { useState } from 'react';
import AccountsList from '../components/AccountsList';
import AccountForm from '../components/AccountForm';

const AccountsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  
  const handleAddNewClick = () => {
    setSelectedAccount(null);
    setShowForm(true);
  };
  
  const handleEditAccount = (account) => {
    setSelectedAccount(account);
    setShowForm(true);
  };
  
  const handleAccountSaved = () => {
    setShowForm(false);
    setSelectedAccount(null);
  };
  
  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedAccount(null);
  };
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Chart of Accounts</h1>
          {!showForm && (
            <button
              onClick={handleAddNewClick}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            >
              Add New Account
            </button>
          )}
        </div>
        
        <div className="mt-6">
          {showForm ? (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">
                {selectedAccount ? 'Edit Account' : 'Add New Account'}
              </h2>
              <AccountForm
                account={selectedAccount}
                onSubmit={handleAccountSaved}
                onCancel={handleCancelForm}
              />
            </div>
          ) : (
            <AccountsList
              onEdit={handleEditAccount}
              onDelete={() => {}} // No need to pass anything here since refresh happens in component
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountsPage;