'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { API_URL } from '@/utils/api';
import { usePopup } from '@/context/popup_ctx';
import { Group, Rights, permissions } from '@/utils/models';
import { useAdminGuard } from '@/hooks/AdminGuard';
import { useRouter } from 'next/navigation';

const EditGroupForm = () => {

  const { id } = useParams();
  const groupId = Number(id);
  const { setPopup } = usePopup();
  const router = useRouter();

  const [formData, setFormData] = useState<Partial<Group>>({});
  const [initialData, setInitialData] = useState<Partial<Group>>({});

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/groups/${groupId}`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        setFormData(data);
        setInitialData(data);
      } catch (err) {
        console.log(`Ошибка при загрузке группы: ${err}`)
      }
    };

    fetchGroup();
  }, [groupId, setPopup]);

  const isChecking = useAdminGuard();
  if (isChecking) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
  
    if (name.startsWith('perm.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        perm: {
          ...prev.perm,
          [field]: type === 'checkbox' ? checked : value,
        } as Rights,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };
  

  const getChangedFields = () => {
    const changes: Record<string, any> = {};
    for (const key in formData) {
      if (formData[key as keyof Group] !== initialData[key as keyof Group]) {
        changes[key] = formData[key as keyof Group];
      }
    }
    return changes;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const changes = getChangedFields();

    if (Object.keys(changes).length === 0) {
      setPopup('No changes to save', true);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/admin/groups/${groupId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(changes),
      });

      if (!res.ok) throw new Error('Ошибка при обновлении');

      const result = await res.json();
      setPopup(result.message, true);
      router.push('/admin/groups')
    } catch (err) {
      console.log(`Error updating group: ${err}`);
    }
  };

  return (
    <div className="p-6 min-h-screen flex justify-center items-center text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl mb-4">Edit Group</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Groupname</label>
            <input type="text" name="groupname" value={formData.groupname || ''} onChange={handleChange} className="w-full p-2 border rounded"/>
          </div>
          <div>
            <label className="block">Description</label>
            <input type="text" name="desc" value={formData.desc || ''} onChange={handleChange} className="w-full p-2 border rounded"/>
          </div>
          <div>
            <label className="block">Lists Permissions</label>
            <select name="perm.list" value={formData.perm?.list} onChange={handleChange} className="w-full p-2 border rounded">
              {permissions.map((perm) => (
                <option className="bg-gray-600" key={perm} value={perm}>{perm}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block">Rules Permissions</label>
            <select name="perm.rule" value={formData.perm?.rule} onChange={handleChange} className="w-full p-2 border rounded">
              {permissions.map((perm) => (
                <option className="bg-gray-600" key={perm} value={perm}>{perm}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" name="perm.admin" checked={formData.perm?.admin ?? false} onChange={handleChange} />
            <label>Can Administrate</label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" name="is_active" checked={formData.is_active ?? true} onChange={handleChange}/>
            <label>Is Active</label>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">Save changes </button>
        </form>
      </div>
    </div>
  );
};

export default EditGroupForm;
