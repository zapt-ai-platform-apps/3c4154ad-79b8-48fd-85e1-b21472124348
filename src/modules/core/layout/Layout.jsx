import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import {
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon,
  BookOpenIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  CalculatorIcon,
  CubeIcon,
  WrenchScrewdriverIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', path: '/dashboard', icon: ChartBarIcon },
  { name: 'Akun', path: '/accounts', icon: BookOpenIcon },
  { name: 'Transaksi', path: '/transactions', icon: DocumentTextIcon },
  { name: 'Jurnal', path: '/journals', icon: DocumentDuplicateIcon },
  { name: 'Buku Besar', path: '/ledgers', icon: BookOpenIcon },
  { name: 'Laporan Keuangan', path: '/financial-statements', icon: CalculatorIcon },
  { name: 'Persediaan', path: '/inventory', icon: CubeIcon },
  { name: 'Aset Tetap', path: '/fixed-assets', icon: WrenchScrewdriverIcon },
  { name: 'Pengaturan', path: '/settings', icon: Cog6ToothIcon },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="fixed inset-y-0 left-0 flex flex-col w-full max-w-xs bg-white">
          <div className="h-16 flex items-center px-4 bg-blue-600">
            <button 
              type="button" 
              className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="ml-3">
              <h2 className="text-lg font-bold text-white">Sistem Akuntansi</h2>
            </div>
          </div>
          <div className="flex-1 pt-5 pb-4 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`${
                    isActive(item.path)
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={`${
                      isActive(item.path) ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-4 h-6 w-6`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-2 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
            >
              <ArrowRightOnRectangleIcon className="mr-4 h-6 w-6 text-gray-400" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r border-gray-200 bg-white overflow-y-auto">
          <div className="h-16 flex items-center px-4 bg-blue-600">
            <h2 className="text-lg font-bold text-white">Sistem Akuntansi</h2>
          </div>
          <div className="flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 pt-5 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`${
                    isActive(item.path)
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon
                    className={`${
                      isActive(item.path) ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-3 h-5 w-5`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
            >
              <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        <div className="sticky top-0 z-10 md:hidden bg-white border-b border-gray-200">
          <div className="h-16 flex items-center justify-between px-4">
            <button
              type="button"
              className="px-4 border-r border-gray-200 text-gray-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="font-semibold text-blue-600">
              Sistem Akuntansi Manufaktur
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </div>

        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}