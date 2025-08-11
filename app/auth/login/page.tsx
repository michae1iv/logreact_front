"use client";

import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { API_URL } from '@/utils/api';
import { usePopup } from '@/context/popup_ctx';
import { useRouter} from 'next/navigation';
import { useAuth } from '@/context/auth_ctx';



const LoginPage: NextPage = () => {
  const { login } = useAuth();
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<boolean>(false);
  const { setPopup } = usePopup();
  const router = useRouter();
  const [redirectUrl, setRedirectUrl] = useState('/')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setRedirectUrl(params.get('next') || '/')
  }, [])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (data.status === 'success') {
        e.preventDefault()
        login()
        router.push(redirectUrl);
        setPopup(data.message, true);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error(`Error getting users: ${error}`)
      setError(true);
    }
  };


  return (
    <div className="flex flex-col items-center pb-50 justify-center min-h-screen">
      <h1 className="text-3xl mb-6">Logging in</h1>
      <form className="bg-gray-700 p-6 rounded-lg shadow-lg" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm mb-2">Username</label>
          <input type="username" className="w-full p-2 bg-gray-600 rounded" value={username} onChange={(e) => setusername(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-2">Password</label>
          <input type="password" className="w-full p-2 bg-gray-600 rounded" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <p className="block text-m mb-4">{`${error ? 'Wrong username or password' : ''}`}</p>
        <button type="submit" className="bg-blue-500 px-4 py-2 rounded w-full">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;