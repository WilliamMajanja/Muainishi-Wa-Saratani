import React from 'react';
import type { TreatmentOption } from '../types';

interface TreatmentOptionsProps {
  options: TreatmentOption[];
}

const getBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
        case 'standard of care':
            return 'bg-green-500/20 text-green-300 border-green-400';
        case 'emerging':
            return 'bg-yellow-500/20 text-yellow-300 border-yellow-400';
        case 'clinical trial option':
            return 'bg-blue-500/20 text-blue-300 border-blue-400';
        default:
            return 'bg-gray-500/20 text-gray-300 border-gray-400';
    }
};

export const TreatmentOptions: React.FC<TreatmentOptionsProps> = ({ options }) => {
  if (!options || options.length === 0) {
    return null;
  }

  return (
    <div className="bg-base-200 p-6 rounded-lg shadow-lg border border-base-300">
      <h3 className="text-2xl font-bold text-text-primary mb-5">Rational Treatment Options</h3>
      <div className="space-y-4">
        {options.map((option, index) => (
          <div key={index} className="bg-base-300/50 p-4 rounded-lg border border-base-300 transition-shadow hover:shadow-xl">
            <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-semibold text-brand-secondary">{option.optionName}</h4>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${getBadgeColor(option.evidenceLevel)}`}>
                    {option.evidenceLevel}
                </span>
            </div>
            <p className="text-sm font-medium text-text-secondary mb-1">Description</p>
            <p className="text-text-primary mb-3">{option.description}</p>
            <p className="text-sm font-medium text-text-secondary mb-1">Rationale</p>
            <p className="text-text-primary">{option.rationale}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
