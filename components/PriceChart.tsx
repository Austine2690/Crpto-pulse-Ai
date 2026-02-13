
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, YAxisProps } from 'recharts';
import { ChartData } from '../types';

interface PriceChartProps {
  data: ChartData[];
  signal: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, signal }) => {
  const isBullish = signal.includes('BUY');
  const chartColor = isBullish ? '#22c55e' : signal.includes('SELL') ? '#ef4444' : '#6366f1';

  return (
    <div className="h-[300px] w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#9ca3af" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            hide={true}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
            itemStyle={{ color: '#f3f4f6' }}
            labelStyle={{ color: '#9ca3af' }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={chartColor} 
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
