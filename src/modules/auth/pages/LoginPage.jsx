import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/supabaseClient';
import * as Sentry from '@sentry/browser';
import { Link } from 'react-router-dom';

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
  const inAppBrowser = isInAppBrowser();
  
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
            <h2 className="text-xl font-medium text-gray-900">Sign in with ZAPT</h2>
            <p className="text-sm text-gray-500 mt-1">
              <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                Learn more about ZAPT
              </a>
            </p>
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
                    Anda membuka aplikasi ini dalam browser dalam aplikasi. Untuk menggunakan fitur login sosial, silakan buka aplikasi ini di browser default perangkat Anda.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
          
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={inAppBrowser ? [] : ['google', 'facebook', 'apple']}
            magicLink={true}
            view="magic_link"
            theme="light"
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Alamat Email',
                  password_label: 'Kata Sandi',
                  email_input_placeholder: 'Masukkan alamat email Anda',
                  password_input_placeholder: 'Masukkan kata sandi Anda',
                  button_label: 'Masuk',
                  loading_button_label: 'Sedang Masuk...',
                  link_text: 'Sudah memiliki akun? Masuk',
                  social_provider_text: 'Masuk dengan {{provider}}',
                },
                sign_up: {
                  email_label: 'Alamat Email',
                  password_label: 'Kata Sandi',
                  email_input_placeholder: 'Masukkan alamat email Anda',
                  password_input_placeholder: 'Masukkan kata sandi Anda',
                  button_label: 'Daftar',
                  loading_button_label: 'Sedang Mendaftar...',
                  link_text: 'Belum memiliki akun? Daftar',
                  social_provider_text: 'Daftar dengan {{provider}}',
                },
                magic_link: {
                  email_input_label: 'Alamat Email',
                  email_input_placeholder: 'Masukkan alamat email Anda',
                  button_label: 'Kirim Link Magic',
                  loading_button_label: 'Mengirim Link...',
                  link_text: 'Kirim link magic ke email',
                  confirmation_text: 'Periksa email Anda untuk link magic',
                },
              },
            }}
          />
          
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