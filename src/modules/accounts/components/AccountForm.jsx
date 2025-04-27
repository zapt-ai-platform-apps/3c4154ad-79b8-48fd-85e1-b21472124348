import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import * as Sentry from '@sentry/browser';

const AccountForm = ({ onAccountCreated, onAccountUpdated }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [accountData, setAccountData] = useState({
    code: '',
    name: '',
    categoryId: '',
    normalBalance: 'debit',
    description: '',
    isActive: true
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingAccount, setFetchingAccount] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  
  // Fetch account categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // This would be replaced with an actual API call to get categories
        const mockCategories = [
          { id: 1, name: 'Aset Lancar', type: 'asset' },
          { id: 2, name: 'Aset Tetap', type: 'asset' },
          { id: 3, name: 'Kewajiban Lancar', type: 'liability' },
          { id: 4, name: 'Kewajiban Jangka Panjang', type: 'liability' },
          { id: 5, name: 'Ekuitas', type: 'equity' },
          { id: 6, name: 'Pendapatan', type: 'revenue' },
          { id: 7, name: 'Harga Pokok Penjualan', type: 'expense' },
          { id: 8, name: 'Beban Operasional', type: 'expense' }
        ];
        
        setCategories(mockCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        Sentry.captureException(error);
        setError('Gagal memuat kategori akun. Silakan coba lagi.');
      }
    };
    
    fetchCategories();
  }, []);
  
  // Fetch account data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchAccount = async () => {
        try {
          setFetchingAccount(true);
          // In a real app, this would be a fetch to your API
          // For now, we'll simulate with mock data
          const mockAccount = {
            id: parseInt(id),
            code: '1101',
            name: 'Kas',
            categoryId: 1,
            normalBalance: 'debit',
            description: 'Kas tersedia perusahaan',
            isActive: true
          };
          
          setAccountData(mockAccount);
        } catch (error) {
          console.error('Error fetching account:', error);
          Sentry.captureException(error);
          setError('Gagal memuat data akun. Silakan coba lagi.');
        } finally {
          setFetchingAccount(false);
        }
      };
      
      fetchAccount();
    }
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAccountData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitDisabled(true);
      setLoading(true);
      setError(null);
      
      // Validate required fields
      if (!accountData.code || !accountData.name || !accountData.categoryId || !accountData.normalBalance) {
        setError('Semua kolom wajib diisi');
        return;
      }
      
      // In a real app, this would be a fetch to your API
      // For now, we'll just simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      
      if (isEditMode) {
        console.log('Updating account:', { id, ...accountData });
        if (onAccountUpdated) onAccountUpdated();
      } else {
        console.log('Creating account:', accountData);
        if (onAccountCreated) onAccountCreated();
      }
      
      // Navigate back to accounts list
      navigate('/accounts');
    } catch (error) {
      console.error('Error saving account:', error);
      Sentry.captureException(error);
      setError('Gagal menyimpan akun. Silakan coba lagi.');
    } finally {
      setLoading(false);
      setSubmitDisabled(false);
    }
  };
  
  if (fetchingAccount) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {isEditMode ? 'Edit Akun' : 'Tambah Akun Baru'}
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {isEditMode 
            ? 'Edit informasi akun yang sudah ada' 
            : 'Isi formulir berikut untuk menambahkan akun baru ke bagan akun'
          }
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6">
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
      )}
      
      <div className="border-t border-gray-200">
        <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Kode Akun
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="code"
                  id="code"
                  className="form-input"
                  value={accountData.code}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nama Akun
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="form-input"
                  value={accountData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                Kategori
              </label>
              <div className="mt-1">
                <select
                  id="categoryId"
                  name="categoryId"
                  className="form-select"
                  value={accountData.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="normalBalance" className="block text-sm font-medium text-gray-700">
                Saldo Normal
              </label>
              <div className="mt-1">
                <select
                  id="normalBalance"
                  name="normalBalance"
                  className="form-select"
                  value={accountData.normalBalance}
                  onChange={handleChange}
                  required
                >
                  <option value="debit">Debit</option>
                  <option value="credit">Kredit</option>
                </select>
              </div>
            </div>
            
            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Deskripsi
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="form-input"
                  value={accountData.description}
                  onChange={handleChange}
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
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={accountData.isActive}
                    onChange={handleChange}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="isActive" className="font-medium text-gray-700">
                    Akun Aktif
                  </label>
                  <p className="text-gray-500">Uncheck jika akun tidak aktif atau sudah tidak digunakan.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                onClick={() => navigate('/accounts')}
                disabled={loading}
              >
                Batal
              </button>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                disabled={loading || submitDisabled}
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountForm;