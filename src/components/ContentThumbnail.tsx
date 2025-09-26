import React, { useEffect, useRef, useState } from 'react';
import { Play, Book, FileText, ClipboardCheck } from 'lucide-react';
import { Content, Subject } from '../types';
import { getVideoPlayerURL } from '../utils/videoPlayer';
import { ContentSecurity } from '../utils/contentSecurity';

interface ContentThumbnailProps {
  content?: Content;
  subject?: Subject;
  isSubject: boolean;
  onSubjectClick?: (subject: Subject) => void;
}

const defaultThumbnail = 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/1280x720/19223c/f0f4f8?text=Missing+Thumbnail';

const getIcon = (type?: string) => {
  switch (type) {
    case 'video':
      return <Play className="w-5 h-5" />;
    case 'notes':
      return <FileText className="w-5 h-5" />;
    case 'assignment':
      return <ClipboardCheck className="w-5 h-5" />;
    case 'quiz':
      return <Book className="w-5 h-5" />;
    default:
      return <Play className="w-5 h-5" />;
  }
};

const getButtonText = (type?: string) => {
  switch (type) {
    case 'video':
      return 'Watch';
    case 'notes':
      return 'View';
    case 'assignment':
      return 'View';
    case 'quiz':
      return 'Take Quiz';
    default:
      return 'Watch';
  }
};

const ContentThumbnail: React.FC<ContentThumbnailProps> = ({ 
  content,
  subject,
  isSubject,
  onSubjectClick
}) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subTitleRef = useRef<HTMLHeadingElement>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [displayTitle, setDisplayTitle] = useState('');

  const data = isSubject ? subject : content;
  if (!data) return null;

  const title = isSubject ? (data as Subject).name : (data as Content).title;
  const { thumbnail: teacherImageUrl } = data;
  const contentType = content?.type;

  // Set display title directly without encoding/decoding
  useEffect(() => {
    if (title && title.trim()) {
      // Decode the title if it's encoded
      const decodedTitle = isSubject ? title : ContentSecurity.decodeTitle(title);
      setDisplayTitle(decodedTitle);
    } else {
      setDisplayTitle(isSubject ? 'Subject' : 'Content');
    }
  }, [title, isSubject]);

  const handleClick = () => {
    if (isSubject && subject && onSubjectClick) {
      onSubjectClick(subject);
    } else if (content) {
      const decodedUrl = ContentSecurity.decodeUrl(content.url);
      if (decodedUrl && decodedUrl.trim()) {
        // Check if it's a PDF or document link
        const isPdf = decodedUrl.toLowerCase().includes('.pdf') || 
                     content.type === 'notes' || 
                     content.type === 'assignment';
        
        if (isPdf) {
          // Open PDF/document links directly in new tab
          window.open(decodedUrl, '_blank', 'noopener,noreferrer');
        } else {
          // Show video modal for video content
          setShowVideoModal(true);
        }
      }
    }
  };

  const imageUrl = teacherImageUrl || defaultThumbnail;

  return (
    <>
      <div 
        className="group cursor-pointer border-2 border-gray-400 dark:border-gray-400 rounded-xl p-2 hover:border-primary transition-all duration-300 hover:shadow-xl bg-gray-200 dark:bg-gray-600" 
        onClick={handleClick}
      >
        <div className="relative w-full bg-gray-300 dark:bg-gray-500 rounded-lg overflow-hidden border-2 border-gray-400 dark:border-gray-400 group-hover:border-primary/70 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
          <img
            src={imageUrl}
            alt={displayTitle}
            className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultThumbnail;
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

          <div className="absolute top-0 left-0 h-full w-[75%] flex items-center justify-center p-2">
            <h4 
              ref={titleRef}
              className="text-white font-bold text-center text-sm md:text-base lg:text-lg leading-tight break-words" 
              style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.95)' }}
              title={displayTitle}
            >
              {displayTitle}
            </h4>
          </div>

          {!isSubject && contentType === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-primary/90 text-white rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300 backdrop-blur-sm">
                {getIcon(contentType)}
              </div>
            </div>
          )}
        </div>

        <div className="mt-2 bg-gray-200 dark:bg-gray-600 p-2 rounded-lg">
          {!isSubject && (
            <div className="w-full bg-gray-300 dark:bg-gray-700 text-blue-600 dark:text-blue-300 py-1.5 px-2 rounded text-xs font-medium hover:bg-primary hover:text-white transition-all duration-200 flex items-center justify-center gap-1 border border-gray-400 dark:border-gray-500">
              {getIcon(contentType)}
              <span>{getButtonText(contentType)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Video Modal with External Player - Full Screen */}
      {showVideoModal && content && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* Video Container - Full Screen */}
          <div className="relative w-full h-full">
            {/* Close Button - Positioned as overlay */}
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 z-10 bg-black/80 hover:bg-red-600/90 text-white transition-all duration-200 rounded-full p-3 backdrop-blur-sm border border-white/30 hover:border-red-400/70 shadow-xl hover:shadow-red-500/30 hover:scale-110"
              title="Close video"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Video iframe - Full Screen */}
            <iframe
              src={getVideoPlayerURL(ContentSecurity.decodeUrl(content.url), false)}
              title={displayTitle}
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ContentThumbnail;