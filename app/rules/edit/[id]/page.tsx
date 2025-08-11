'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePopup } from '@/context/popup_ctx';
import { API_URL } from '@/utils/api';

export default function EditCorrelationRule() {
  const { id } = useParams();
  const router = useRouter();
  const { setPopup } = usePopup();

  const [formData, setFormData] = useState<any>(null);
  const [viewJson, setViewJson] = useState(false);
  const [subconditions, setSubconditions] = useState<{ path: string; type: 'then' | 'otherwise' }[]>([]);
  const [customAddFields, setCustomAddFields] = useState<string[]>([]);

  useEffect(() => {
    const fetchRule = async () => {
      try {
        const res = await fetch(`${API_URL}/rules/${id}`, {
          credentials: 'include',
        });
        const data = await res.json();
        setFormData(data);
        const initialSubconditions: any[] = [];

        const traverseConditions = (path: string, condition: any) => {
          if (condition.then) initialSubconditions.push({ path, type: 'then' });
          if (condition.otherwise) initialSubconditions.push({ path, type: 'otherwise' });
          if (condition.then) traverseConditions(`${path}.then`, condition.then);
          if (condition.otherwise) traverseConditions(`${path}.otherwise`, condition.otherwise);
        };
        traverseConditions('condition', data.condition);

        setSubconditions(initialSubconditions);
        const fields = Object.keys(data.alert?.addfields || {}).filter(
          k => !['message', 'from', 'key'].includes(k)
        );
        setCustomAddFields(fields);
      } catch (err) {
        setPopup('Ошибка при загрузке правила', true);
      }
    };
    fetchRule();
  }, [id, setPopup]);

  const handleChange = (path: string, value: any) => {
    const keys = path.split('.');
    const newData = { ...formData };
    let current: any = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setFormData(newData);
  };

  const renderConditionBlock = (path: string, condition: any, depth = 0) => {
    if (depth > 10) return null;
    return (
      <div className="bg-gray-700 p-4 rounded mb-4">
        <input placeholder="logic" className="w-full p-2 mb-2 rounded bg-gray-800" value={condition.logic || ''} onChange={e => handleChange(`${path}.logic`, e.target.value)} />
        <input placeholder="freq" className="w-full p-2 mb-2 rounded bg-gray-800" value={condition.freq || ''} onChange={e => handleChange(`${path}.freq`, e.target.value)} />
        <input placeholder="times" type="number" className="w-full p-2 mb-2 rounded bg-gray-800" value={condition.times || 0} onChange={e => handleChange(`${path}.times`, parseInt(e.target.value))} />

        {subconditions.filter(sub => sub.path === path).map((sub, idx) => (
          <div key={idx} className="ml-4">
            <label className="text-sm">{sub.type}</label>
            {renderConditionBlock(`${path}.${sub.type}`, condition[sub.type] || {}, depth + 1)}
          </div>
        ))}
      </div>
    );
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_URL}/rules/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      setPopup(result.message || 'Changes saved', true);
      router.push('/rules');
    } catch (err) {
      setPopup('Error while saving', true);
    }
  };

  if (!formData) return <div className="text-white p-6">Loading...</div>;

  const addCustomField = () => {
    const fieldName = prompt('Введите имя дополнительного поля');
    if (!fieldName) return;
    setCustomAddFields([...customAddFields, fieldName]);
    handleChange(`alert.addfields.${fieldName}`, '');
  };

  return (
    <div className="p-6 min-h-screen text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Editing Rule</h1>
        <button onClick={() => setViewJson(!viewJson)} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
          {viewJson ? 'Visual mode' : 'JSON mode'}
        </button>
      </div>

      {viewJson ? (
        <textarea
          className="w-full min-h-[400px] bg-gray-900 text-white p-4 rounded"
          value={JSON.stringify(formData, null, 2)}
          onChange={(e) => setFormData(JSON.parse(e.target.value))}
        />
      ) : (
        <div className="space-y-4">
          <input className="w-full p-2 rounded bg-gray-800" value={formData.rule} onChange={e => handleChange('rule', e.target.value)} />
          <input className="w-full p-2 rounded bg-gray-800" value={formData.ukey} onChange={e => handleChange('ukey', e.target.value)} />

          <div className="grid grid-cols-2 gap-4">
            <input className="p-2 rounded bg-gray-800" value={formData.params.ttl} onChange={e => handleChange('params.ttl', e.target.value)} />
            <input placeholder="Timeout" className="p-2 rounded bg-gray-800" value={formData.params.timeout} onChange={e => handleChange('params.timeout', e.target.value)} />
            <input type="number" className="p-2 rounded bg-gray-800" value={formData.params.sev_level} onChange={e => handleChange('params.sev_level', parseInt(e.target.value))} />
            <input className="col-span-2 p-2 rounded bg-gray-800" value={formData.params.desc} onChange={e => handleChange('params.desc', e.target.value)} />
            <label className="col-span-2">
              <input type="checkbox" checked={formData.params.no_alert} onChange={e => handleChange('params.no_alert', e.target.checked)} className="mr-2" />
              No alert
            </label>
          </div>

          {renderConditionBlock('condition', formData.condition)}

          <div className="bg-gray-700 p-4 rounded">
            <h2 className="font-semibold mb-2">Alert</h2>
            <input className="w-full p-2 rounded bg-gray-800 mb-2" value={formData.alert.fields} onChange={e => handleChange('alert.fields', e.target.value)} />
            {Object.entries(formData.alert.addfields).map(([key, val]) => (
              <input
                key={key}
                className="w-full p-2 rounded bg-gray-800 mb-2"
                placeholder={key}
                value={String(val)}
                onChange={e => handleChange(`alert.addfields.${key}`, e.target.value)}
              />
            ))}
            <button
              onClick={addCustomField}
              className="mt-2 bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 text-sm"
            >+ Add field</button>
          </div>
        </div>
      )}

      <button onClick={handleSubmit} className="mt-6 bg-green-600 px-4 py-2 rounded hover:bg-green-700">
        Save changes
      </button>
    </div>
  );
}
