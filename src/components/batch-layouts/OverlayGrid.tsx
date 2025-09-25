import React from 'react';
import { Batch } from '../../types';

interface Props {
  batches: Batch[];
  onSelectBatch: (batch: Batch) => void;
}

const OverlayGrid: React.FC<Props> = ({ batches, onSelectBatch }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {batches.map((batch) => (
        <div 
          key={batch.id} 
          onClick={() => onSelectBatch(batch)} 
          className="relative bg-gray-600 rounded-xl overflow-hidden hover:-translate-y-1 transition-transform duration-300 cursor-pointer group border-2 border-gray-400 hover:border-primary"
        >
          <img src={batch.thumbnail} alt={batch.name} className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-4 w-full">
            <h3 className="font-semibold text-lg text-white group-hover:text-primary transition-colors">{batch.name}</h3>
            <p className="text-xs text-gray-200 line-clamp-1">{batch.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverlayGrid;
