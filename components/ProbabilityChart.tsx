
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import type { TopClassification } from '../types';

interface ProbabilityChartProps {
  data: TopClassification[];
}

export const ProbabilityChart: React.FC<ProbabilityChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    name: item.type,
    Probability: parseFloat((item.probability * 100).toFixed(1))
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            left: 50,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
          <YAxis dataKey="name" type="category" width={150} stroke="#94a3b8" tick={{ fill: '#e2e8f0', fontSize: 12 }} />
          <Tooltip
            cursor={{ fill: '#334155' }}
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
            labelStyle={{ color: '#e2e8f0' }}
            formatter={(value: number) => [`${value}%`, 'Probability']}
          />
          <Bar dataKey="Probability" fill="#14b8a6">
            <LabelList dataKey="Probability" position="right" formatter={(value: number) => `${value}%`} style={{ fill: '#e2e8f0' }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
