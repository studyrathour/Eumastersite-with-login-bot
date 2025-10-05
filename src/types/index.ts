export interface Batch {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  subjects: Subject[];
  createdAt: Date;
  isActive: boolean;
  enrolledStudents: number;
  layout?: string;
}

export interface Subject {
  id: string;
  name: string;
  sections: Section[];
  thumbnail: string;
}

export interface Section {
  id: string;
  name:string;
  type: 'video' | 'notes' | 'assignment' | 'quiz';
  contents: Content[];
}

export interface Content {
  id: string;
  title: string;
  url: string;
  type: 'video' | 'notes' | 'assignment' | 'quiz';
  thumbnail?: string;
  duration?: string;
  description?: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  timeLimit: number;
  totalMarks: number;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  marks: number;
}

export interface Assignment {
  id:string;
  title: string;
  description: string;
  dueDate: Date;
  maxMarks: number;
  attachments: string[];
}

export interface LiveClass {
  id: string;
  title: string;
  description: string;
  scheduledTime: Date;
  videoUrl?: string;
  thumbnail: string;
  batchId: string;
  subjectId: string;
  isLive: boolean;
  createdAt: Date;
}

// Updated interfaces for API responses
export interface APILiveClass {
  id: string;
  recurring_class_id: string;
  title: string;
  batch: string;
  batchId: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  thumbnailUrl: string;
  tutor: {
    id: string;
    name: string;
    video_url: string;
    avatar_url: string | null;
    created_at: string; // ISO string
  };
}

export interface APINotification {
  id: string;
  title: string;
  message: string;
  timestamp: string; // ISO string
  isRead: boolean;
  type: 'info' | 'warning' | 'error' | 'success';
}
