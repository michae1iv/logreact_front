'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePopup } from '@/context/popup_ctx';
import { API_URL } from '@/utils/api';
import { useAdminGuard } from '@/hooks/AdminGuard';
import {permissions} from '@/utils/models'

const AddGroupForm = () => {

  const [formData, setFormData] = useState<{
    groupname: string;
    description: string;
    rulesPermissions: string;
    listsPermition: string;
    isAdmin: boolean;
    is_active: boolean;
  }>({
    groupname: '',
    description: '',
    rulesPermissions: permissions[0],
    listsPermition: permissions[0],
    isAdmin: false,
    is_active: true,
  });

  const [error, setError] = useState<string | null>(null);
  const { setPopup } = usePopup();
  const router = useRouter();

  const isChecking = useAdminGuard();
  if (isChecking) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const response = await fetch(`${API_URL}/admin/groups/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ 
        groupname: formData.groupname,  
        desc: formData.description,
        is_active: formData.is_active,
        perm: {
          rule: formData.rulesPermissions,
          list: formData.listsPermition,
          admin: formData.isAdmin,
        },
      })
    });

    if (!response.ok) {
      setError('Request error: error creating group');
      setPopup(error, true)
      return;
    }

    const data = await response.json();

    if (data.status === 'success') {
      e.preventDefault()
      router.push('/admin/groups')
      setPopup(data.message, true);
    }
    else {
      setPopup(data.message, true)
    }
  };

  return (
    <div className="p-6 min-h-screen flex justify-center items-center text-white relative">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl mb-4">Create Group</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Group Name</label>
            <input type="text" name="groupname" value={formData.groupname} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block">Description</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block">Lists Permissions</label>
            <select name="listsPermition" value={formData.listsPermition} onChange={handleChange} className="w-full p-2 border rounded">
              {permissions.map((perm) => (
                <option className="bg-gray-600" key={perm} value={perm}>{perm}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block">Rules Permissions</label>
            <select name="rulesPermissions" value={formData.rulesPermissions} onChange={handleChange} className="w-full p-2 border rounded">
              {permissions.map((perm) => (
                <option className="bg-gray-600" key={perm} value={perm}>{perm}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" name="isAdmin" checked={formData.isAdmin} onChange={handleChange} />
            <label>Can Administrate</label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
            <label>Active</label>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddGroupForm;