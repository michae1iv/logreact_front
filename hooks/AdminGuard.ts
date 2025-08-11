'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { decodeSessToken } from '@/utils/auth';

export const useAdminGuard = () => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const nextPage = '?next=' + usePathname()

  useEffect(() => {
    const payload = decodeSessToken();
    if (!payload || payload.admin !== true) {
      router.replace('/auth/login' + nextPage);
      return;
    }

    setIsChecking(false);
  }, [router]);

  return isChecking;
};