import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { InfluentialMarker } from '../types';

interface MarkerImportanceChartProps {
  data: InfluentialMarker[];
}

// Custom Tooltip for better styling and to handle long labels
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-base-300 p-3 rounded-lg border border-base-200 shadow-xl max-w-xs" style={{ wordWrap: 'break-word' }}>
        <p className="text-text-primary font-semibold mb-1">{label}</p>
        <p className="text-brand-primary">{`Importance: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};


export const MarkerImportanceChart: React.FC<MarkerImportanceChartProps> = ({ data }) => {
    const chartData = data.map(item => ({
        // Capitalize first letter and replace underscores for cleaner display
        name: (item.marker.charAt(0).toUpperCase() + item.marker.slice(1)).replace(/_/g, ' '),
        Importance: item.importance
    })).sort((a, b) => a.Importance - b.Importance);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis
            dataKey="name"
            type="category"
            stroke="none"
            width={150}
            tick={{
                fill: '#e2e8f0',
                fontSize: 12,
                width: 150, // This width enables text wrapping
                dx: -5,
            }}
            interval={0} // Ensure all labels are rendered
          />
          <Tooltip
            cursor={{ fill: 'rgba(51, 65, 85, 0.5)' }}
            content={<CustomTooltip />} // Use the custom tooltip component
          />
          <Bar dataKey="Importance" fill="#0e7490" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
