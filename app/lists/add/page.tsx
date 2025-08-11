'use client';

import { useState } from 'react';
import { usePopup } from '@/context/popup_ctx';
import { API_URL } from '@/utils/api';
import { useRouter } from 'next/navigation';

export default function CreateListForm() {
  const [name, setName] = useState('');
  const [desc, setdesc] = useState('');
  const [list, setlist] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const { setPopup } = usePopup();
  const router = useRouter();

  const handleAddItem = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!list.includes(inputValue.trim())) {
        setlist([...list, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const handleRemoveItem = (item: string) => {
    setlist(list.filter(i => i !== item));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_URL}/lists/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, desc, list }),
      });
      const result = await res.json();
      router.push('/lists')
      setPopup(result.message || 'List successfully created', true);
    } catch (err) {
      setPopup('Error creating list', true);
    }
  };

  return (
    <div className="flex justify-center list-start p-24 min-h-screen text-white">
      <div className="space-y-4 max-w-xl w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Creating List</h1>
        <input
          placeholder="Name of list"
          className="w-full p-2 rounded bg-gray-800"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          placeholder="desc"
          className="w-full p-2 rounded bg-gray-800"
          value={desc}
          onChange={e => setdesc(e.target.value)}
        />

        <div>
          <label className="block mb-1">Elements</label>
          <input
            placeholder="Press Enter to add"
            className="w-full p-2 mb-2 rounded bg-gray-800"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleAddItem}
          />
          <div className="flex flex-wrap gap-2">
            {list.map((item, index) => (
              <div key={index} className="flex list-center bg-blue-600 text-white px-3 py-1 rounded-full">
                <span>{item}</span>
                <button
                  onClick={() => handleRemoveItem(item)}
                  className="ml-2 text-white hover:text-red-300"
                >×</button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 bg-green-600 px-4 py-2 rounded hover:bg-green-700 w-full"
        >Create list</button>
      </div>
    </div>
  );
}
