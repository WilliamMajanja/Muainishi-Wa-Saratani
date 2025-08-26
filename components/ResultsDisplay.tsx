import React from 'react';
import type { ClassificationResult, GroundedInfo } from '../types';
import { ClassificationCard } from './ClassificationCard';
import { ProbabilityChart } from './ProbabilityChart';
import { MarkerImportanceChart } from './MarkerImportanceChart';
import { GroundedInfoDisplay } from './GroundedInfoDisplay';
import { TreatmentOptions } from './TreatmentOptions';

interface ResultsDisplayProps {
  result: ClassificationResult;
  groundedInfo: GroundedInfo | null;
  onFetchInfo: () => void;
  isFetchingInfo: boolean;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, groundedInfo, onFetchInfo, isFetchingInfo }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-center text-brand-secondary">Classification Results</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3">
          <ClassificationCard 
            classification={result.classification}
            confidence={result.confidence}
            summary={result.summary}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="bg-base-200 p-4 rounded-lg shadow-lg border border-base-300">
          <h3 className="font-bold text-lg mb-4 text-center text-text-primary">Top Classification Probabilities</h3>
          <ProbabilityChart data={result.top_classifications} />
        </div>
        <div className="bg-base-200 p-4 rounded-lg shadow-lg border border-base-300">
          <h3 className="font-bold text-lg mb-4 text-center text-text-primary">Influential Markers</h3>
          <MarkerImportanceChart data={result.influential_markers} />
        </div>
      </div>

      {result.treatment_options && result.treatment_options.length > 0 && (
        <TreatmentOptions options={result.treatment_options} />
      )}

       <div className="bg-base-200 p-6 rounded-lg shadow-lg border border-base-300">
          <GroundedInfoDisplay
            cancerType={result.classification}
            info={groundedInfo}
            onFetchInfo={onFetchInfo}
            isLoading={isFetchingInfo}
          />
        </div>

    </div>
  );
};