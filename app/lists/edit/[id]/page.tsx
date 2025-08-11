'use client';

import { useEffect, useState } from 'react';
import { usePopup } from '@/context/popup_ctx';
import { API_URL } from '@/utils/api';
import { useRouter, useParams } from 'next/navigation';

export default function EditListForm() {
  const [originalName, setOriginalName] = useState('');
  const [originalDesc, setOriginalDesc] = useState('');
  const [originalList, setOriginalList] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [list, setList] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const { setPopup } = usePopup();
  const router = useRouter();
  const params = useParams();
  const listId = params?.id;

useEffect(() => {
  const fetchList = async () => {
    try {
      const response = await fetch(`${API_URL}/lists/${listId}`, {
        credentials: 'include',
      });
      const data = await response.json();

      setName(data.name || '');
      setOriginalName(data.name || '');
      setDesc(data.desc || '');
      setOriginalDesc(data.desc || '');
      setList(data.list || []);
      setOriginalList(data.list || []);
    } catch (err) {
      setPopup('Ошибка при загрузке списка', true);
    }
  };

  fetchList();
}, [listId]);

  const handleAddItem = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!list.includes(inputValue.trim())) {
        setList([...list, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const handleRemoveItem = (item: string) => {
    setList(list.filter(i => i !== item));
  };

  const handleSubmit = async () => {
    const changes: Record<string, any> = {};
    if (name !== originalName) changes.name = name;
    if (desc !== originalDesc) changes.desc = desc;

    const removed = originalList.filter(i => !list.includes(i));
    const added = list.filter(i => !originalList.includes(i));
    if (removed.length > 0) changes.del = removed;
    if (added.length > 0) changes.add = added;

    try {
      const res = await fetch(`${API_URL}/lists/${listId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(changes),
      });
      const result = await res.json();
      router.push('/lists');
      setPopup(result.message || 'List updated successfully', true);
    } catch (err) {
      setPopup('Error updating list', true);
    }
  };

  return (
    <div className="flex justify-center items-start p-24 min-h-screen text-white">
      <div className="space-y-4 max-w-xl w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Edit List</h1>
        <input
          placeholder="Name of list"
          className="w-full p-2 rounded bg-gray-800"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          placeholder="Description"
          className="w-full p-2 rounded bg-gray-800"
          value={desc}
          onChange={e => setDesc(e.target.value)}
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
              <div key={index} className="flex items-center bg-blue-600 text-white px-3 py-1 rounded-full">
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
        >Save Changes</button>
      </div>
    </div>
  );
}
