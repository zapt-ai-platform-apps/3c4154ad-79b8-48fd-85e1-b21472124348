import React from 'react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import {
  CurrencyDollarIcon,
  DocumentTextIcon,
  CubeIcon,
  WrenchScrewdriverIcon,
  BookOpenIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Dashboard summary cards data
  const summaryCards = [
    {
      title: 'Total Pendapatan',
      value: 'Rp. 1.250.000.000',
      icon: CurrencyDollarIcon,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      change: '+15%',
      changeType: 'increase'
    },
    {
      title: 'Biaya Produksi',
      value: 'Rp. 850.000.000',
      icon: DocumentTextIcon,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'Nilai Persediaan',
      value: 'Rp. 375.000.000',
      icon: CubeIcon,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      change: '-5%',
      changeType: 'decrease'
    },
    {
      title: 'Nilai Aset Tetap',
      value: 'Rp. 2.800.000.000',
      icon: WrenchScrewdriverIcon,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      change: '+2%',
      changeType: 'increase'
    }
  ];

  // Recent transactions data
  const recentTransactions = [
    {
      id: 1,
      date: '2023-05-15',
      description: 'Pembelian Bahan Baku',
      amount: 'Rp. 75.000.000',
      type: 'expense'
    },
    {
      id: 2,
      date: '2023-05-14',
      description: 'Penjualan Produk',
      amount: 'Rp. 125.000.000',
      type: 'income'
    },
    {
      id: 3,
      date: '2023-05-12',
      description: 'Pembayaran Gaji Karyawan Produksi',
      amount: 'Rp. 55.000.000',
      type: 'expense'
    },
    {
      id: 4,
      date: '2023-05-10',
      description: 'Penjualan Produk',
      amount: 'Rp. 95.000.000',
      type: 'income'
    },
    {
      id: 5,
      date: '2023-05-08',
      description: 'Pembelian Suku Cadang Mesin',
      amount: 'Rp. 15.000.000',
      type: 'expense'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Selamat datang,</span>
          <span className="text-sm font-medium text-gray-900">{user?.email}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${card.iconBg} rounded-md p-3`}>
                  <card.icon className={`h-6 w-6 ${card.iconColor}`} aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">{card.title}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-xl font-semibold text-gray-900">{card.value}</div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      card.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {card.changeType === 'increase' ? (
                        <ArrowTrendingUpIcon className="h-4 w-4 self-center flex-shrink-0 text-green-500" aria-hidden="true" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-4 w-4 self-center flex-shrink-0 text-red-500" aria-hidden="true" />
                      )}
                      <span className="ml-1">{card.change}</span>
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity and Account Balances */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recent Transactions */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Transaksi Terbaru</h3>
            <p className="mt-1 text-sm text-gray-500">Daftar transaksi terbaru yang tercatat dalam sistem.</p>
          </div>
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto">
              <div className="py-2 align-middle inline-block min-w-full">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanggal
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Deskripsi
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jumlah
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentTransactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.description}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+ ' : '- '}{transaction.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Balances */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Saldo Akun Utama</h3>
            <p className="mt-1 text-sm text-gray-500">Saldo terkini dari akun-akun utama perusahaan.</p>
          </div>
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto">
              <div className="py-2 align-middle inline-block min-w-full">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Akun
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kode
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Saldo
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Kas</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1101</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Rp. 325.000.000</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Bank</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1102</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Rp. 950.000.000</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Piutang Usaha</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1103</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Rp. 175.000.000</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Persediaan Bahan Baku</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1104</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Rp. 225.000.000</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Utang Usaha</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3101</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Rp. 125.000.000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Akses Cepat</h3>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <a href="/journals" className="bg-blue-50 overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-5 flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <BookOpenIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-900">Buat Jurnal Baru</p>
                </div>
              </div>
            </a>
            <a href="/transactions" className="bg-green-50 overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-5 flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <DocumentTextIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-900">Catat Transaksi</p>
                </div>
              </div>
            </a>
            <a href="/ledgers" className="bg-purple-50 overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-5 flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                  <BookOpenIcon className="h-6 w-6 text-purple-600" aria-hidden="true" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-900">Lihat Buku Besar</p>
                </div>
              </div>
            </a>
            <a href="/financial-statements" className="bg-yellow-50 overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-5 flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                  <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" aria-hidden="true" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-900">Lihat Laporan Keuangan</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;