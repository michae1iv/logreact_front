'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '@/utils/api';

interface AlertData {
  timestamp: string;
  rule: string;
  added_fields: JSON;
  inherited_fields: JSON;
  message: string;
  sev_level: number;
}

function toGoISOString(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const yyyy = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());

  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const offsetHours = pad(Math.floor(Math.abs(offset) / 60));
  const offsetMinutes = pad(Math.abs(offset) % 60);

  return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}${sign}${offsetHours}:${offsetMinutes}`;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [amount, setAmount] = useState<number>(50);
  const [sinceDate, setSinceDate] = useState<string>('');
  const [sinceTime, setSinceTime] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [toTime, setToTime] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(false);
  

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const since = sinceDate && sinceTime ? toGoISOString(new Date(`${sinceDate}T${sinceTime}`)) : '';
      const to = toDate && toTime ? toGoISOString(new Date(`${toDate}T${toTime}`)) : '';

      const params = new URLSearchParams({
        amount: amount.toString(),
        ...(since && { since }),
        ...(to && { to }),
      });

      const res = await fetch(`${API_URL}/stats/alerts?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await res.json();
      const sorted = data.sort((a: AlertData, b: AlertData) =>
        sortOrder === 'asc'
          ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setAlerts(sorted);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [amount, sinceDate, sinceTime, toDate, toTime, sortOrder]);

  return (
    <div className="p-6 text-white min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full p-2 rounded bg-gray-800"
            min={1}
          />
        </div>
        <div>
          <label className="block text-sm">Since Date</label>
          <input
            type="date"
            value={sinceDate}
            onChange={(e) => setSinceDate(e.target.value)}
            className="w-full p-2 rounded bg-gray-800"
          />
          <input
            type="time"
            value={sinceTime}
            onChange={(e) => setSinceTime(e.target.value)}
            className="w-full p-2 mt-1 rounded bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full p-2 rounded bg-gray-800"
          />
          <input
            type="time"
            value={toTime}
            onChange={(e) => setToTime(e.target.value)}
            className="w-full p-2 mt-1 rounded bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm">Sort By</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="w-full p-2 rounded bg-gray-800"
          >
            <option value="desc">Latest</option>
            <option value="asc">First</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, idx) => (
            <div key={idx} className="bg-gray-800 p-4 rounded shadow">
              <div className="text-white font-semibold mb-1">
                Rule: {alert.rule} <span className="ml-4 text-sm text-gray-400">({new Date(alert.timestamp).toLocaleString()})</span>
              </div>
              <div className={(alert.sev_level || 0) < 5 ? 'text-sm text-gray-400 mb-2' : 'text-sm text-red-400 mb-2'}>Severity Level: {alert.sev_level || 0}</div>
              <div className="text-sm bg-gray-900 p-2 rounded">
                {Object.entries(alert as any)
                  .filter(([key]) => key !== 'timestamp')
                  .map(([key, val]) => (
                    <div key={key} className="text-gray-300">
                      <strong>{key}:</strong> {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
