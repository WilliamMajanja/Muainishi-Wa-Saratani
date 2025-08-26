
import React from 'react';
import { DnaIcon } from './icons/DnaIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-base-200/50 backdrop-blur-sm sticky top-0 z-10 border-b border-base-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center space-x-3">
          <DnaIcon className="h-8 w-8 text-brand-secondary" />
          <h1 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight">
            Muainishi Wa Saratani
          </h1>
        </div>
      </div>
    </header>
  );
};