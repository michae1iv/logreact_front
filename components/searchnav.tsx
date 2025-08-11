'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const pages = [
  { name: 'Add User', path: '/admin/users/add' },
  { name: 'Edit User', path: '/admin/users/edit' },
  { name: 'Manage Users', path: '/admin/users' },
  { name: 'Add Group', path: '/admin/groups/add' },
  { name: 'Edit Group', path: '/admin/groups/edit' },
  { name: 'Manage Groups', path: '/admin/groups' },
  { name: 'Add List', path: '/lists/add' },
  { name: 'Lists', path: '/lists' },
  { name: 'Dashboard', path: '/' },
  { name: 'Rules', path: '/rules' },
  { name: 'Alerts', path: '/alerts' },
];

const SearchNavigation = () => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const filtered = pages.filter(page =>
    page.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        placeholder="Search page..."
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
        className="w-full p-2 rounded bg-gray-800 text-white"
      />
      {focused && query && (
        <div className="absolute left-0 right-0 bg-white dark:bg-gray-800 border border-gray-600 z-50 rounded mt-1 shadow">
          {filtered.length > 0 ? (
            filtered.map(page => (
              <div
                key={page.path}
                onClick={() => {
                  router.push(page.path);
                  setQuery('');
                }}
                className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
              >
                {page.name}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">No matches</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchNavigation;
