"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { NextPage } from 'next';
import { API_URL } from '@/utils/api';
import { usePopup } from '@/context/popup_ctx';
import {Group} from '@/utils/models';
import { useAdminGuard } from '@/hooks/AdminGuard';
import { useRouter } from 'next/navigation';

const GroupPage: NextPage = () => {

  const [groups, setGroups] = useState<Group[]>([]);
  const { setPopup } = usePopup();
  const router = useRouter();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/groups`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.log(`Error getting groups: ${error}`);
      }
    };

    fetchGroups();
  }, []);

  const isChecking = useAdminGuard();
  if (isChecking) {
    return null;
  }

  const deleteGroup = async (id: number, name: string) => {
    try {
      const response = await fetch(`${API_URL}/admin/groups/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
  
      const data = await response.json();
      setGroups(prev => prev.filter(group => group.id !== id));
      setPopup(`Group ${name} successfully deleted`, true);

    } catch (error) {
      setPopup(`Delete error:${error}`, true);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white p-6 min-h-screen">
      <div className="w-7/10 bg-gray-800 p-4 rounded-lg shadow-lg mt-10">
        <Link href="/admin/groups/add">
          <button className="mb-4 bg-blue-500 px-4 py-2 rounded transition-colors hover:bg-blue-600">Add Group</button>
        </Link>
        {groups.map(group => (
          <div key={group.id} className="flex justify-between items-center p-2 border-b border-gray-700">
            <div>
              <span className="block font-semibold">{group.groupname}</span>
              <span className="text-sm text-gray-400">{group.desc}</span>
            </div>
            <div className="flex space-x-2">
              <Link href={`/admin/groups/edit/${group.id}`}>
              <button className="bg-yellow-500 px-2 py-1 rounded transition-colors hover:bg-yellow-600">Change</button>
              </Link>
              <button onClick={() => deleteGroup(group.id, group.groupname)} className="bg-red-500 px-2 py-1 rounded transition-colors hover:bg-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupPage;
