import React from 'react';
import { Batch } from '../../types';

interface Props {
  batches: Batch[];
  onSelectBatch: (batch: Batch) => void;
}

const AlternatingList: React.FC<Props> = ({ batches, onSelectBatch }) => {
  return (
    <div className="space-y-5 p-3">
      {batches.map((batch) => (
        <div 
          key={batch.id} 
          onClick={() => onSelectBatch(batch)} 
          className="bg-gray-600 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-primary/20 transition-all cursor-pointer group border-2 border-gray-400 hover:border-primary flex flex-col md:flex-row even:md:flex-row-reverse"
        >
          <img src={batch.thumbnail} alt={batch.name} className="w-full md:w-5/12 h-auto object-contain"/>
          <div className="p-5 flex flex-col justify-center flex-1 bg-gray-600">
            <h3 className="font-semibold text-xl text-white mb-2 group-hover:text-blue-300 transition-colors">{batch.name}</h3>
            <p className="text-base text-gray-300 mb-3 line-clamp-4">{batch.description}</p>
            <span className="text-sm font-medium text-blue-300">
              View Course &rarr;
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlternatingList;
