'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePopup } from '@/context/popup_ctx';
import { API_URL } from '@/utils/api';

const defaultRule = {
  rule: '',
  ukey: '',
  params: {
    ttl: '1h',
    timeout: '1h',
    sev_level: 5,
    desc: '',
    no_alert: false,
  },
  condition: {
    logic: '',
    freq: '',
    times: 0,
  },
  alert: {
    fields: '',
    addfields: {
      message: '',
      from: '',
      key: '',
    },
  },
};

export default function CreateCorrelationRule() {
  const [formData, setFormData] = useState(defaultRule);
  const [viewJson, setViewJson] = useState(false);
  const [subconditions, setSubconditions] = useState<{ path: string; type: 'then' | 'otherwise' }[]>([]);
  const [customAddFields, setCustomAddFields] = useState<string[]>([]);
  const { setPopup } = usePopup();
  const router = useRouter();

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

  const addSubCondition = (path: string, type: 'then' | 'otherwise') => {
    setSubconditions([...subconditions, { path, type }]);
    handleChange(`${path}.${type}`, { logic: '', freq: '', times: 0 });
  };

  const removeSubCondition = (path: string, type: 'then' | 'otherwise') => {
    const keys = `${path}.${type}`.split('.');
    const newData = { ...formData };
    let current: any = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) return;
      current = current[keys[i]];
    }
    delete current[keys[keys.length - 1]];
    setFormData(newData);
    setSubconditions(subconditions.filter(sub => !(sub.path === path && sub.type === type)));
  };

  const addCustomField = () => {
    const fieldName = prompt('Enter name of additional field');
    if (!fieldName) return;
    setCustomAddFields([...customAddFields, fieldName]);
    handleChange(`alert.addfields.${fieldName}`, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      const res = await fetch(`${API_URL}/rules/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.status === 'success') {
        e.preventDefault()
        router.push('/rules')
      }
      setPopup(result.message || 'Rule created successfully', true);
    } catch (err) {
      setPopup('Error in creating rule', true);
    }
  };

  const renderConditionBlock = (path: string, condition: any, depth = 0) => {
    if (depth > 10) return null;
    return (
      <div className="bg-gray-700 p-4 rounded mb-4">
        <input placeholder="Condition (logic)" className="w-full p-2 mb-2 rounded bg-gray-800" value={condition.logic || ''} onChange={e => handleChange(`${path}.logic`, e.target.value)} />
        <input placeholder="Frequency (f.e 10/min)" className="w-full p-2 mb-2 rounded bg-gray-800" value={condition.freq || ''} onChange={e => handleChange(`${path}.freq`, e.target.value)} />
        <input placeholder="Times (amount of actuation)" type="number" className="w-full p-2 mb-2 rounded bg-gray-800" value={condition.times || 0} onChange={e => handleChange(`${path}.times`, parseInt(e.target.value))} />

        {subconditions.filter(sub => sub.path === path).map((sub, idx) => (
          <div key={idx} className="ml-4">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm">{sub.type === 'then' ? 'Если да (then)' : 'Если нет (otherwise)'}</label>
              <button
                className="text-red-400 text-sm hover:text-red-600"
                onClick={() => removeSubCondition(path, sub.type)}
              >✕</button>
            </div>
            {renderConditionBlock(`${path}.${sub.type}`, condition[sub.type] || { logic: '', freq: '', times: 0 }, depth + 1)}
          </div>
        ))}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => addSubCondition(path, 'then')}
            className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 text-sm"
          >+ Add then</button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 min-h-screen text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Creating Rule</h1>
        <button
          onClick={() => setViewJson(!viewJson)}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >{viewJson ? 'Визуальный режим' : 'JSON режим'}</button>
      </div>

      {viewJson ? (
        <textarea
          className="w-full min-h-[400px] bg-gray-900 text-white p-4 rounded"
          value={JSON.stringify(formData, null, 2)}
          onChange={(e) => setFormData(JSON.parse(e.target.value))}
        />
      ) : (
        <div className="space-y-4">
          <div>
            <label>Rule name</label>
            <input className="w-full p-2 rounded bg-gray-800" value={formData.rule} onChange={e => handleChange('rule', e.target.value)} />
          </div>
          <div>
            <label>Source (ukey)</label>
            <input className="w-full p-2 rounded bg-gray-800" value={formData.ukey} onChange={e => handleChange('ukey', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="TTL" className="p-2 rounded bg-gray-800" value={formData.params.ttl} onChange={e => handleChange('params.ttl', e.target.value)} />
            <input placeholder="Timeout" className="p-2 rounded bg-gray-800" value={formData.params.timeout} onChange={e => handleChange('params.timeout', e.target.value)} />
            <input placeholder="Severity" type="number" className="p-2 rounded bg-gray-800" value={formData.params.sev_level} onChange={e => handleChange('params.sev_level', parseInt(e.target.value))} />
            <input placeholder="Description" className="col-span-2 p-2 rounded bg-gray-800" value={formData.params.desc} onChange={e => handleChange('params.desc', e.target.value)} />
            <label className="col-span-2">
              <input type="checkbox" checked={formData.params.no_alert} onChange={e => handleChange('params.no_alert', e.target.checked)} className="mr-2" />
              No alert
            </label>
          </div>

          <h2 className="font-semibold text-xl">Condition</h2>
          {renderConditionBlock('condition', formData.condition)}

          <div className="bg-gray-700 p-4 rounded">
            <h2 className="font-semibold mb-2">Alert</h2>
            <input placeholder="Поля (через запятую)" className="w-full p-2 rounded bg-gray-800 mb-2" value={formData.alert.fields} onChange={e => handleChange('alert.fields', e.target.value)} />
            {Object.entries(formData.alert.addfields).map(([key, val]) => (
              <input
                key={key}
                placeholder={key}
                className="w-full p-2 rounded bg-gray-800 mb-2"
                value={val}
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
        Save field
      </button>
    </div>
  );
}
