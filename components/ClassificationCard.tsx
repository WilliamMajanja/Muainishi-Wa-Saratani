
import React from 'react';

interface ClassificationCardProps {
  classification: string;
  confidence: number;
  summary: string;
}

export const ClassificationCard: React.FC<ClassificationCardProps> = ({ classification, confidence, summary }) => {
    const confidencePercentage = (confidence * 100).toFixed(1);
    const confidenceColor = confidence > 0.8 ? 'text-green-400' : confidence > 0.6 ? 'text-yellow-400' : 'text-orange-400';

  return (
    <div className="bg-base-200 rounded-lg shadow-lg p-6 border border-base-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
            <p className="text-sm font-medium text-brand-secondary uppercase tracking-wider">Primary Classification</p>
            <h2 className="text-3xl font-bold text-text-primary">{classification}</h2>
        </div>
        <div className="mt-2 md:mt-0 text-right">
            <p className="text-sm font-medium text-text-secondary">Confidence Score</p>
            <p className={`text-4xl font-bold ${confidenceColor}`}>{confidencePercentage}%</p>
        </div>
      </div>
      <div>
         <p className="text-sm font-medium text-text-secondary mb-1">AI-Generated Summary</p>
         <p className="text-text-secondary leading-relaxed">{summary}</p>
      </div>
    </div>
  );
};
