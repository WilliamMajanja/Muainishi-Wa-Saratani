
import React from 'react';
import type { GroundedInfo } from '../types';
import { Loader } from './Loader';

interface GroundedInfoDisplayProps {
  cancerType: string;
  info: GroundedInfo | null;
  onFetchInfo: () => void;
  isLoading: boolean;
}

export const GroundedInfoDisplay: React.FC<GroundedInfoDisplayProps> = ({ cancerType, info, onFetchInfo, isLoading }) => {
  return (
    <div>
      <h3 className="text-xl font-bold text-text-primary mb-4">Further Information & Sources</h3>
      
      {!info && !isLoading && (
        <div className="text-center">
            <p className="text-text-secondary mb-4">Get up-to-date, web-grounded information on prognosis and treatment protocols.</p>
            <button
            onClick={onFetchInfo}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-secondary hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-brand-secondary transition-colors"
            >
            Fetch Information for {cancerType}
            </button>
        </div>
      )}

      {isLoading && (
         <div className="flex items-center justify-center space-x-2 text-text-secondary">
             <Loader />
             <span>Fetching grounded information...</span>
         </div>
      )}
      
      {info && !isLoading && (
        <div className="space-y-4 animate-fade-in">
          <p className="text-text-secondary whitespace-pre-wrap leading-relaxed">{info.summary}</p>
          
          {info.sources && info.sources.length > 0 && (
            <div>
              <h4 className="font-semibold text-text-primary mb-2">Sources from Google Search:</h4>
              <ul className="list-disc list-inside space-y-1">
                {info.sources.map((source, index) => (
                  <li key={index}>
                    <a 
                      href={source.web.uri} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-brand-secondary hover:text-teal-400 underline"
                      title={source.web.title}
                    >
                      {source.web.title || source.web.uri}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
