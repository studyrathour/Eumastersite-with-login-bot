import React, { useState, useMemo } from 'react';
import { Video, FileText, ClipboardCheck, HelpCircle } from 'lucide-react';
import { Subject, Content } from '../types';
import ContentThumbnail from './ContentThumbnail';
import { ContentSecurity } from '../utils/contentSecurity';

type ContentType = 'video' | 'notes' | 'assignment' | 'quiz';

const iconMap: { [key in ContentType]: React.ElementType } = {
  video: Video,
  notes: FileText,
  assignment: ClipboardCheck,
  quiz: HelpCircle,
};

interface SubjectViewProps {
  subject: Subject;
}

const SubjectView: React.FC<SubjectViewProps> = ({ subject }) => {
  const [userSelectedTab, setUserSelectedTab] = useState<ContentType | null>(null);

  const contentByType = useMemo(() => {
    const grouped: Record<ContentType, Content[]> = {
      video: [],
      notes: [],
      assignment: [],
      quiz: [],
    };

    subject.sections?.forEach(section => {
      if (grouped[section.type]) {
        grouped[section.type].push(...section.contents);
      }
    });

    return grouped;
  }, [subject]);

  const availableTabs = useMemo(() => {
    return Object.keys(contentByType).filter(
      (type) => contentByType[type as ContentType].length > 0
    ) as ContentType[];
  }, [contentByType]);

  const activeTab = useMemo(() => {
    if (userSelectedTab && availableTabs.includes(userSelectedTab)) {
      return userSelectedTab;
    }
    if (availableTabs.length > 0) {
      return availableTabs[0];
    }
    return 'video';
  }, [userSelectedTab, availableTabs]);

  const activeContent = contentByType[activeTab];

  const handleTabChange = (tab: ContentType) => {
    setUserSelectedTab(tab);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 border-b border-secondary mb-3">
        <nav className="flex space-x-1 overflow-x-auto">
          {availableTabs.map(tab => {
            const Icon = iconMap[tab];
            const count = contentByType[tab].length;
            return (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex items-center gap-1 px-3 py-2 text-xs font-medium transition-all border-b-2 whitespace-nowrap
                  ${activeTab === tab
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-secondary/50'
                  }`}
              >
                <Icon className="w-3 h-3" />
                <span className="capitalize">{tab}s</span>
                <span className="bg-secondary text-text-tertiary px-1 py-0.5 rounded-full text-xs">
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex-grow overflow-y-auto p-3">
        {activeContent && activeContent.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {activeContent.map(content => (
              <ContentThumbnail
                key={content.id}
                content={{
                  ...content,
                  title: content.title, // Keep encoded for ContentThumbnail to decode
                  url: content.url // Keep encoded for ContentThumbnail to decode
                }}
                isSubject={false}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-text-tertiary">
            <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mb-6">
              <Video className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold text-text-secondary mb-2">No Content Yet</h3>
            <p className="text-text-tertiary max-w-md">
              This section is currently empty. New content will appear here once it's added by the instructor.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectView;