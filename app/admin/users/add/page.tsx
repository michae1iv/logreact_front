'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/utils/api';
import { usePopup } from '@/context/popup_ctx';
import {Group} from '@/utils/models';
import { useAdminGuard } from '@/hooks/AdminGuard';


const AddUserForm = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const { setPopup } = usePopup();
  const router = useRouter();

  const [formData, setFormData] = useState<{
    username: string;
    password: string;
    email: string;
    fullName: string;
    isActive: boolean;
    changePasswordOnFirstLogin: boolean;
    group: number;
  }>({
    username: '',
    password: '',
    email: '',
    fullName: '',
    isActive: true,
    changePasswordOnFirstLogin: false,
    group: 0,
  });

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/groups`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        const data: Group[] = await response.json();
        setGroups(data);

        if (data.length > 0) {
          setFormData(prev => ({
            ...prev,
            group: data[0].id,
          }));
        }
      } catch (error) {
        setPopup(`Error getting groups:${error}`, true);
      }
    };

    fetchGroups();
  }, []);

  const isChecking = useAdminGuard();
  if (isChecking) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/admin/users/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          username: formData.username,  
          password: formData.password,
          fullname: formData.fullName,
          email: formData.email,
          group: formData.group,
          cpofl: formData.changePasswordOnFirstLogin,
          is_active: formData.isActive
        })
        
      });
      const data = await response.json();
      if (data.status === 'success') {
        e.preventDefault()
        router.push('/admin/users')
        setPopup(data.message, true);
      }
      else {
        setPopup(data.message, true)
      }
    } catch (error) {
      setPopup(`Error creating user:${error}`, true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : name === 'group' ? Number(value) : value,
    });
  };

  return (
      <div className="p-6 min-h-screen flex justify-center items-center text-white">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-2xl mb-4">Create user</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block">Username</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block">Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block">Group</label>
              <select name="group" value={formData.group} onChange={handleChange} className="w-full p-2 border rounded">
                {groups.map((group) => (
                  <option className="bg-gray-600" key={group.id} value={group.id}>{group.groupname}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
              <label>Is active</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" name="changePasswordOnFirstLogin" checked={formData.changePasswordOnFirstLogin} onChange={handleChange} />
              <label>Change password on first login</label>
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                Create user
            </button>
          </form>
        </div>
      </div>
  );
};

export default AddUserForm;
