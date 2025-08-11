'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '@/utils/api';
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/utils/cn';

const timeRanges = ['30 days', '7 days', '24 hours'] as const;
type TimeRange = typeof timeRanges[number];

interface AlertItem {
  timestamp: string;
  [key: string]: any;
}

export default function DashboardPage() {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('30 days');
  const [data, setData] = useState<{ name: string; amount: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const getIntervals = (range: TimeRange) => {
    const now = new Date();
    if (range === '30 days') {
      return Array.from({ length: 30 }, (_, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (29 - i));
        return d.toISOString().slice(0, 10); // YYYY-MM-DD
      });
    }
    if (range === '7 days') {
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().slice(0, 10);
      });
    }
    if (range === '24 hours') {
      return Array.from({ length: 24 }, (_, i) => {
        const d = new Date(now);
        d.setHours(d.getHours() - (23 - i), 0, 0, 0);
        return d.toISOString().slice(0, 13); // YYYY-MM-DDTHH
      });
    }
    if (range === '1 hour') {
      return Array.from({ length: 12 }, (_, i) => {
        const d = new Date(now);
        d.setMinutes(d.getMinutes() - (55 - i * 5), 0, 0);
        return d.toISOString().slice(11, 16); // HH:MM
      });
    }
    return [];
  };

  const fetchAlerts = async (range: TimeRange) => {
    setLoading(true);
    try {
      const amountMap: Record<TimeRange, number> = {
        '30 days': 1000,
        '7 days': 500,
        '24 hours': 200,
      };

      const res = await fetch(
        `${API_URL}/stats/alerts?amount=${amountMap[range]}`,
        { method: 'GET', credentials: 'include' }
      );
      const alerts: AlertItem[] = await res.json();

      // Группировка по интервалам
      const intervals = getIntervals(range);
      const grouped: Record<string, number> = {};

      alerts.forEach(alert => {
        const date = new Date(alert.timestamp);
        let key = '';
        if (range === '30 days' || range === '7 days') {
          key = date.toISOString().slice(0, 10);
        } else if (range === '24 hours') {
          key = date.toISOString().slice(0, 13);
        } else if (range === '1 hour') {
          key = date.toISOString().slice(11, 16);
        }
        grouped[key] = (grouped[key] || 0) + 1;
      });

      // Заполнение нулями + форматирование
      const chartData = intervals.map(label => {
        let displayLabel = label;

        if (range === '30 days' || range === '7 days') {
          displayLabel = label.slice(5); // MM-DD
        } else if (range === '24 hours') {
          displayLabel = label.slice(11) + ':00'; // HH:00
        }

        return {
          name: displayLabel,
          amount: grouped[label] || 0,
        };
      });

      setData(chartData);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts(selectedRange);
  }, [selectedRange]);

  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) p-4 md:p-6 text-white">
      <div className="flex gap-2 mb-4">
        {timeRanges.map((range) => (
          <button
            key={range}
            onClick={() => setSelectedRange(range)}
            className={cn(
              'px-3 py-1 rounded-full text-sm',
              selectedRange === range
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 hover:bg-gray-600'
            )}
          >
            {range}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Alerts Graph</h2>
        {loading ? (
          <div className="h-72 bg-gray-700 animate-pulse rounded-xl" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid stroke="#374151" strokeDasharray="5 5" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  borderColor: '#3b82f6'
                }}
                cursor={{ fill: '#29374a' }}
              />
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
