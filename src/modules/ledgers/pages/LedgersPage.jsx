import React from 'react';

const LedgersPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Buku Besar</h1>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Buku Besar</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Halaman ini untuk melihat buku besar yang berisi posting dari jurnal ke akun-akun yang relevan.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <p className="text-center text-gray-500">
            Fitur ini sedang dalam pengembangan dan akan segera tersedia.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LedgersPage;