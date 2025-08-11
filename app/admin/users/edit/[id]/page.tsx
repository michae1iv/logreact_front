'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { API_URL } from '@/utils/api';
import { usePopup } from '@/context/popup_ctx';
import { Group, User } from '@/utils/models';
import { useAdminGuard } from '@/hooks/AdminGuard';
import { useRouter } from 'next/navigation';

const EditUserForm = () => {

  const { setPopup } = usePopup();
  const { id } = useParams();
  const userId = Number(id);
  const router = useRouter();

  const [groups, setGroups] = useState<Group[]>([]);
  const [initialData, setInitialData] = useState<Partial<User>>({});
  const [formData, setFormData] = useState<Partial<User>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, groupsRes] = await Promise.all([
          fetch(`${API_URL}/admin/users/${userId}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          }),
          fetch(`${API_URL}/admin/groups`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          }),
        ]);
        const user = await userRes.json();
        const groups = await groupsRes.json();
        setInitialData(user);
        setFormData(user);
        setGroups(groups);
      } catch (error) {
        setPopup(`Error getting user: ${error}`, true);
      }
    };
    fetchData();
  }, [userId, setPopup]);

  const isChecking = useAdminGuard();
  if (isChecking) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setFormData({
      ...formData,
      [name]: type === 'checkbox'
        ? checked
        : name === 'group'
        ? Number(value)
        : value,
    });
  };

  const getChangedFields = () => {
    const changes: Record<string, any> = {};
    for (const key in formData) {
      if (formData[key as keyof User] !== initialData[key as keyof User]) {
        changes[key] = formData[key as keyof User];
      }
    }
    return changes;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const changes = getChangedFields();
    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes),
      });

      if (!response.ok) throw new Error('Ошибка при сохранении');

      const result = await response.json();
      router.push('/admin/users')
      setPopup(`User updated: ${result.message || 'successful'}`, true);
    } catch (error) {
      console.log(`Error sending data: ${error}`);
    }
  };

  return (
    <div className="p-6 min-h-screen flex justify-center items-center text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl mb-4">Edit user</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="id" value={userId} />

          <div>
            <label className="block">Username</label>
            <input type="text" name="username" value={formData.username || ''} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block">Full Name</label>
            <input type="text" name="fullname" value={formData.fullname || ''} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
              <label className="block">Password</label>
              <input type="password" name="password" value={formData.password || ''} onChange={handleChange} className="w-full p-2 border rounded"/>
            </div>
          <div>
            <label className="block">Email</label>
            <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block">Group</label>
            <select name="group" value={formData.group || 0} onChange={handleChange} className="w-full p-2 border rounded" >
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.groupname}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" name="is_active" checked={formData.is_active ?? true} onChange={handleChange} />
            <label>Is Active</label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" name="cpofl" checked={formData.cpofl ?? false} onChange={handleChange} />
            <label>Change password on next login</label>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">Save changes</button>
        </form>
      </div>
    </div>
  );
};

export default EditUserForm;
