"use client";

import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { EarningsStat } from '@/app/services/tutor-stats.service';

interface EarningsChartProps {
  data: EarningsStat[];
}

const EarningsChart: React.FC<EarningsChartProps> = ({ data }) => {
  // Add some sample data if empty for demo purposes (optional, but good for UI design)
  const displayData = data.length > 0 ? data : [
    { month: 'Jan', earnings: 0 },
    { month: 'Feb', earnings: 0 },
    { month: 'Mar', earnings: 0 },
    { month: 'Apr', earnings: 0 },
    { month: 'May', earnings: 0 },
    { month: 'Jun', earnings: 0 },
  ];

  return (
    <div className="w-full h-full min-h-[300px] p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Earnings Growth</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your revenue trend over the last 6 months</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-bold rounded-full border border-green-100 dark:border-green-800">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          Live Data
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                padding: '12px'
              }}
              itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
              labelStyle={{ color: '#64748b', marginBottom: '4px', fontWeight: 'bold' }}
              formatter={(value: number) => [`$${value}`, 'Earnings']}
            />
            <Area 
              type="monotone" 
              dataKey="earnings" 
              stroke="#4f46e5" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorEarnings)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EarningsChart;
