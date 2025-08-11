"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { NextPage } from 'next';
import { API_URL } from '@/utils/api';
import { usePopup } from '@/context/popup_ctx';
import { Rule} from '@/utils/models';

const RulesPage: NextPage = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [openUkeys, setOpenUkeys] = useState<Record<string, boolean>>({});
  const { setPopup } = usePopup();

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await fetch(`${API_URL}/rules`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        setRules(data || []);
      } catch (error) {
        setPopup(`Error getting rules: ${error}`, true);
      }
    };

    fetchRules();
  }, []);

  
  const deleteRule = async (id: number, name: string) => {
    try {
      const response = await fetch(`${API_URL}/rules/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
  
      const data = await response.json();
      setRules(rules.filter(rule => rule.rule !== name));
      setPopup(`Rule ${name} successfully deleted`, true);

    } catch (error) {
      setPopup(`Delete error:${error}`, true);
    }
  };

  const toggleUkey = (ukey: string) => {
    setOpenUkeys((prev) => ({ ...prev, [ukey]: !prev[ukey] }));
  };

  const groupedRules = (rules || []).reduce((acc, rule) => {
    if (!acc[rule.ukey]) {
      acc[rule.ukey] = [];
    }
    acc[rule.ukey].push(rule);
    return acc;
  }, {} as Record<string, typeof rules>);

  return (
    <div className="flex flex-col items-center text-white p-6 min-h-screen">
      <div className="w-7/10 bg-gray-800 p-4 rounded-lg shadow-lg mt-10">
        <Link href="/rules/add">
          <button className="ml-2 mb-4 bg-blue-500 px-4 py-2 rounded transition-colors hover:bg-blue-600">Add Rule</button>
        </Link>
        {Object.entries(groupedRules).map(([ukey, members]) => (
            <div key={ukey} className="bg-gray-800 p-2 rounded-lg shadow">
              <button
                className="inline-block w-full text-left text-lg mb-2 bg-gray-700 p-2 rounded"
                onClick={() => toggleUkey(ukey)}
              >
                {ukey}  {!openUkeys[ukey] ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="inline-block w-4 h-4 text-gray-300 transition group-open:rotate-90" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                </svg> : <svg className="inline-block w-4 h-4 text-gray-300 transition group-open:rotate-90" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z">
                    </path>
                </svg>}
              </button>
              {!openUkeys[ukey] && (
                <ul className="pl-4">
                  {members.map((rule) => (
                    <div key={rule.id} className="flex justify-between items-center p-2 border-b border-gray-700">
                      <div>
                        <span className="block">{rule.rule}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/rules/edit/${rule.id}`}>
                          <button className="bg-yellow-500 px-2 py-1 rounded transition-colors hover:bg-yellow-600">Change</button>
                        </Link>
                        <button onClick={() => deleteRule(rule.id, rule.rule)} className="bg-red-500 px-2 py-1 rounded transition-colors hover:bg-red-600">Delete</button>
                      </div>
                    </div>
                  ))}
                </ul>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default RulesPage;
