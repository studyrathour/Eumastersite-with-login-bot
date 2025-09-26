import React from 'react';
import { Batch } from '../../types';

interface Props {
  batches: Batch[];
  onSelectBatch: (batch: Batch) => void;
}

const StandardGrid: React.FC<Props> = ({ batches, onSelectBatch }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-3">
      {batches.map((batch) => (
        <div 
          key={batch.id} 
          onClick={() => onSelectBatch(batch)} 
          className="bg-gray-200 dark:bg-gray-600 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transition-all cursor-pointer group border-2 border-gray-400 dark:border-gray-400 hover:border-primary"
        >
          <img src={batch.thumbnail} alt={batch.name} className="w-full h-auto object-contain"/>
          <div className="p-3 bg-gray-200 dark:bg-gray-600">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors text-sm">{batch.name}</h3>
            <p className="text-xs text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">{batch.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StandardGrid;
