import React from 'react';
import { Batch } from '../../types';
import { Book } from 'lucide-react';

interface Props {
  batches: Batch[];
  onSelectBatch: (batch: Batch) => void;
}

const HorizontalList: React.FC<Props> = ({ batches, onSelectBatch }) => {
  return (
    <div className="space-y-6 p-4">
      {batches.map((batch) => (
        <div 
          key={batch.id} 
          onClick={() => onSelectBatch(batch)} 
          className="bg-gray-600 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-primary/20 transition-all cursor-pointer group border-2 border-gray-400 hover:border-primary flex flex-col md:flex-row"
        >
          <img src={batch.thumbnail} alt={batch.name} className="w-full md:w-1/3 h-auto object-contain"/>
          <div className="p-6 flex flex-col bg-gray-600">
            <h3 className="font-semibold text-xl text-white mb-2 group-hover:text-blue-300 transition-colors">{batch.name}</h3>
            <p className="text-sm text-gray-300 mb-4 line-clamp-3 flex-grow">{batch.description}</p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Book className="w-4 h-4" />
              <span>{batch.subjects?.length || 0} subjects</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HorizontalList;
