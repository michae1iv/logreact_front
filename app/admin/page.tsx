'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdminGuard } from '@/hooks/AdminGuard';
import {AdminInfo} from '@/utils/models'
import { API_URL } from '@/utils/api';

const AdminPage = () => {

  const [info, setInfo] = useState<Partial<AdminInfo>>({});

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/stats`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        setInfo(data);
      } catch (error) {
        console.log(`Error getting info: ${error}`)
      }
    };
    fetchInfo();
  }, []);

  const isChecking = useAdminGuard();
  if (isChecking) {
    return null;
  }

  return (
    <div className="p-12 grid gap-8 mb-8 md:grid-cols-3 xl:grid-cols-3">
      <Link href="/admin/users">
        <div className="min-w-0 rounded-lg ring-1 ring-black ring-opacity-5 overflow-hidden bg-gray-700 transition-colors hover:bg-gray-600">
          <div className="p-4 flex items-center">
            <div className="p-3 rounded-full text-orange-500 dark:text-orange-100 bg-orange-100 dark:bg-orange-500 mr-4"></div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-100 dark:text-gray-400">Total Users</p>
              <p className="text-lg font-semibold text-gray-200 dark:text-gray-200">{info.users || 0}</p>
            </div>
          </div>
        </div>
      </Link>

      <Link href="/admin/groups">
        <div className="min-w-0 rounded-lg ring-1 ring-black ring-opacity-5 overflow-hidden bg-gray-700 transition-colors hover:bg-gray-600">
          <div className="p-4 flex items-center">
            <div className="p-3 rounded-full text-blue-500 dark:text-blue-100 bg-blue-100 dark:bg-blue-500 mr-4"></div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-100 dark:text-gray-400">Total Groups</p>
              <p className="text-lg font-semibold text-gray-200 dark:text-gray-200">{info.groups || 0}</p>
            </div>
          </div>
        </div>
      </Link>

      <Link href="/admin/#">
        <div className="min-w-0 rounded-lg ring-1 ring-black ring-opacity-5 overflow-hidden bg-gray-700 transition-colors hover:bg-gray-600">
          <div className="p-4 flex items-center">
            <div className="p-3 rounded-full text-green-500 dark:text-green-100 bg-green-100 dark:bg-green-500 mr-4"></div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-100 dark:text-gray-400">Active Sources</p>
              <p className="text-lg font-semibold text-gray-200 dark:text-gray-200">{info.sources || 0}</p>
            </div>
          </div>
        </div>
      </Link>

      <Link href="/alerts">
        <div className="min-w-0 rounded-lg ring-1 ring-black ring-opacity-5 overflow-hidden bg-gray-700 transition-colors hover:bg-gray-600">
          <div className="p-4 flex items-center">
            <div className="p-3 rounded-full text-teal-500 dark:text-teal-100 bg-teal-100 dark:bg-teal-500 mr-4"></div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-100 dark:text-gray-400">Alerts Detected</p>
              <p className="text-lg font-semibold text-gray-200 dark:text-gray-200">{info.alerts || 0}</p>
            </div>
          </div>
        </div>
      </Link>

      <Link href="/rules">
        <div className="min-w-0 rounded-lg ring-1 ring-black ring-opacity-5 overflow-hidden bg-gray-700 transition-colors hover:bg-gray-600">
          <div className="p-4 flex items-center">
            <div className="p-3 rounded-full text-green-500 dark:text-green-100 bg-green-100 dark:bg-yellow-500 mr-4"></div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-100 dark:text-gray-400">Rules Created</p>
              <p className="text-lg font-semibold text-gray-200 dark:text-gray-200">{info.rules || 0}</p>
            </div>
          </div>
        </div>
      </Link>

      <Link href="/lists">
        <div className="min-w-0 rounded-lg ring-1 ring-black ring-opacity-5 overflow-hidden bg-gray-700 transition-colors hover:bg-gray-600">
          <div className="p-4 flex items-center">
            <div className="p-3 rounded-full text-green-500 dark:text-green-100 bg-green-100 dark:bg-red-700 mr-4"></div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-100 dark:text-gray-400">Total Lists</p>
              <p className="text-lg font-semibold text-gray-200 dark:text-gray-200">{info.lists || 0}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AdminPage;
