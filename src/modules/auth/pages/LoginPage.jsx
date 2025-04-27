import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Sentry from '@sentry/browser';
import { authService } from '../authService';

function isInAppBrowser() {
  const userAgent = navigator.userAgent || window.opera;
  
  // Focus only on problematic social media in-app browsers
  if (/LinkedIn/i.test(userAgent)) return true;
  if (/FBAN|FBAV/i.test(userAgent)) return true; // Facebook
  if (/Twitter/i.test(userAgent)) return true;
  if (/Instagram/i.test(userAgent)) return true;
  
  // Return false for all other cases
  return false;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const inAppBrowser = isInAppBrowser();
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await authService.login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      Sentry.captureException(err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await authService.register(email, password);
      // Auto login after registration
      await authService.login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      Sentry.captureException(err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sistem Akuntansi Manufaktur</h1>
          <p className="mt-2 text-center text-gray-600">
            Aplikasi untuk pengelolaan akuntansi perusahaan manufaktur
          </p>
          
          <div className="mt-4 flex justify-center">
            <img
              src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=128&height=128"
              alt="Logo Aplikasi"
              className="h-32 w-32"
            />
          </div>
        </div>
        
        <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10">
          <div className="text-center mb-6">
            <h2 className="text-xl font-medium text-gray-900">
              {showRegister ? 'Create an Account' : 'Sign in to Your Account'}
            </h2>
          </div>
          
          {inAppBrowser ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Anda membuka aplikasi ini dalam browser dalam aplikasi. Silakan buka aplikasi ini di browser default perangkat Anda untuk pengalaman optimal.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
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
          
          <form onSubmit={showRegister ? handleRegister : handleLogin}>
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Alamat Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="box-border appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Kata Sandi
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={showRegister ? "new-password" : "current-password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="box-border appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      {showRegister ? 'Mendaftar...' : 'Masuk...'}
                    </span>
                  ) : (
                    showRegister ? 'Daftar' : 'Masuk'
                  )}
                </button>
              </div>
            </div>
          </form>
          
          <div className="mt-6">
            <button
              onClick={() => setShowRegister(!showRegister)}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-500 cursor-pointer"
            >
              {showRegister
                ? 'Sudah memiliki akun? Masuk'
                : 'Belum memiliki akun? Daftar'}
            </button>
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/" className="text-blue-500 hover:text-blue-700 text-sm">
              Kembali ke Halaman Utama
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}