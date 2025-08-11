"use client";

import { useEffect } from 'react';
import type { NextPage } from 'next';
import { API_URL } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { usePopup } from '@/context/popup_ctx';
import { useAuth } from '@/context/auth_ctx';

const LogoutPage: NextPage = () => {
  const router = useRouter();
  const { setPopup } = usePopup();
  const { logout } = useAuth();

  useEffect(() => {
    const Logout = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/logout`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        logout()
        setPopup(data.message, true);
        router.push('/')
      } catch (error) {
        console.log('error:', error)
      }
    };
    Logout();
  }, []);

  return (
    null
  );
};

export default LogoutPage;