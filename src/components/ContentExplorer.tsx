import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Batch, Subject } from '../types';
import SubjectView from './SubjectView';
import ContentThumbnail from './ContentThumbnail';

type PathItem =
  | { type: 'root'; title: string; data: Subject[] }
  | { type: 'subject'; title: string; data: Subject };

interface ContentExplorerProps {
  batch: Batch;
  onBackToCourses: () => void;
}

const variants = {
  enter: (direction: number) => ({
    scale: direction > 0 ? 0.95 : 1.05,
    opacity: 0,
  }),
  center: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  exit: (direction: number) => ({
    scale: direction < 0 ? 0.95 : 1.05,
    opacity: 0,
    transition: { duration: 0.2 }
  }),
};

const ContentExplorer: React.FC<ContentExplorerProps> = ({ batch, onBackToCourses }) => {
  const [path, setPath] = useState<PathItem[]>([
    { type: 'root', title: batch.name, data: batch.subjects || [] },
  ]);
  const [direction, setDirection] = useState(1);

  const currentLevel = path[path.length - 1];

  const drillDown = (newItem: PathItem) => {
    setDirection(1);
    setPath([...path, newItem]);
  };

  const goBack = () => {
    if (path.length === 1) {
      onBackToCourses();
      return;
    }
    setDirection(-1);
    setPath(path.slice(0, -1));
  };

  const renderBreadcrumb = () => {
    return (
      <div className="flex items-center gap-2 text-xs text-text-secondary mb-3">
        <button 
          onClick={onBackToCourses}
          className="hover:text-primary transition-colors"
        >
          All Courses
        </button>
        {path.map((item, index) => (
          <React.Fragment key={index}>
            <span>/</span>
            <button
              onClick={() => {
                if (index < path.length - 1) {
                  setPath(path.slice(0, index + 1));
                }
              }}
              className={`${
                index === path.length - 1 
                  ? 'text-primary font-medium' 
                  : 'hover:text-primary transition-colors'
              }`}
            >
              {item.title}
            </button>
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (currentLevel.type) {
      case 'root':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
            {currentLevel.data.map((subject) => (
              <ContentThumbnail
                key={subject.id}
                subject={subject}
                isSubject={true}
                onSubjectClick={(s) => drillDown({ type: 'subject', title: s.name, data: s })}
              />
            ))}
          </div>
        );
      case 'subject':
        return <SubjectView subject={currentLevel.data} />;
      default:
        return <div>Unknown level</div>;
    }
  };

  return (
    <div className="flex flex-col h-full p-3">
      <div className="flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <button 
            onClick={goBack} 
            className="flex items-center gap-1 text-primary font-medium hover:brightness-125 transition-all bg-primary/10 px-2 py-1 rounded text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h1 className="text-lg font-bold text-text-primary">{currentLevel.title}</h1>
        </div>
        {renderBreadcrumb()}
      </div>

      <div className="flex-grow relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={path.length}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 overflow-y-auto"
          >
            <div className="min-h-full">
              {renderContent()}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContentExplorer;
