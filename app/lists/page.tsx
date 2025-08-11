'use client';

import { useState, useEffect } from 'react';
import { API_URL } from '@/utils/api';
import { usePopup } from '@/context/popup_ctx';
import { List } from '@/utils/models';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const ListsPage = () => {
  const { setPopup } = usePopup();
  const [filterLists, setFilterLists] = useState<List[]>([]);
  const router = useRouter();
  const nextPage = '?next=' + usePathname()

  useEffect(() => {
      const fetchLists = async () => {
        try {
          const response = await fetch(`${API_URL}/lists`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          });
          if (response.status === 401) {
            router.push('/auth/login' + nextPage)
            return
          }
          const data = await response.json();
          setFilterLists(data || []);
        } catch (error) {
          setPopup(`Error getting lists: ${error}`, true);
        }
      };
      fetchLists();
  }, []);

    const deleteList = async (id: number, name: string) => {
    try {
      const response = await fetch(`${API_URL}/lists/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
  
      const data = await response.json();
      setFilterLists(filterLists.filter(list => list.id !== id));
      setPopup(`List ${name} successfully deleted`, true);

    } catch (error) {
      setPopup(`Delete error:${error}`, true);
    }
  };


  return (
      <div className="ml-4 p-6 min-h-screen items-center">
        <div className="flex justify-begin mb-6">
          <Link href="/lists/add" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">Add list</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filterLists.map((list) => (
            <div key={list.id}>
                <div className="bg-gray-800 p-6 rounded-lg shadow text-left">
                  <h2 className="text-lg font-semibold mb-2">{list.name}</h2>
                  <p className="text-gray-200 mb-2">{list.desc}</p>
                  <Link href={`/lists/edit/${list.id}`}>
                    <button className="bg-green-600 px-2 py-1 rounded transition-colors hover:bg-green-700 mr-3">Change</button>
                  </Link>
                   <button onClick={() => deleteList(list.id, list.name)} className="bg-red-500 px-2 py-1 rounded transition-colors hover:bg-red-600">Delete</button>
                </div>
            </div>
          ))}
        </div>
      </div>
  );
};

export default ListsPage;