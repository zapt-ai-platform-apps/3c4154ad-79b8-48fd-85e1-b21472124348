import React, { useState, useEffect } from 'react';
import { accountsService } from '../services/accountsService';
import * as Sentry from '@sentry/browser';

const AccountForm = ({ account, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    categoryId: '',
    description: '',
    normalBalance: 'debit',
    isActive: true
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchCategories();
  }, []);
  
  useEffect(() => {
    if (account) {
      setFormData({
        id: account.id,
        code: account.code,
        name: account.name,
        categoryId: account.categoryId,
        description: account.description || '',
        normalBalance: account.normalBalance,
        isActive: account.isActive
      });
    }
  }, [account]);
  
  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);
      const data = await accountsService.getAllAccountCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      Sentry.captureException(error);
      setError('Failed to load account categories. Please try again.');
    } finally {
      setCategoryLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.code || !formData.name || !formData.categoryId || !formData.normalBalance) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      let result;
      
      if (account) {
        // Update existing account
        result = await accountsService.updateAccount(account.id, formData);
      } else {
        // Create new account
        result = await accountsService.createAccount(formData);
      }
      
      onSubmit(result);
    } catch (error) {
      console.error('Error saving account:', error);
      Sentry.captureException(error);
      setError('Failed to save account. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            Code *
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="code"
              id="code"
              value={formData.code}
              onChange={handleChange}
              required
              className="box-border shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name *
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="box-border shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
            Category *
          </label>
          <div className="mt-1">
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="box-border shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="">Select Category</option>
              {categoryLoading ? (
                <option disabled>Loading categories...</option>
              ) : (
                categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.code} - {category.name}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="normalBalance" className="block text-sm font-medium text-gray-700">
            Normal Balance *
          </label>
          <div className="mt-1">
            <select
              id="normalBalance"
              name="normalBalance"
              value={formData.normalBalance}
              onChange={handleChange}
              required
              className="box-border shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="debit">Debit</option>
              <option value="credit">Credit</option>
            </select>
          </div>
        </div>

        <div className="sm:col-span-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <div className="mt-1">
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="box-border shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="sm:col-span-6">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={handleChange}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="isActive" className="font-medium text-gray-700">
                Active
              </label>
              <p className="text-gray-500">Account is available for transactions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AccountForm;