export interface Tutor {
  id: string;
  name: string;
  video_url: string;
  avatar_url: string | null;
  created_at: string;
}

export interface LiveClass {
  id: string;
  recurring_class_id: string;
  title: string;
  batch: string;
  batchId: string;
  startTime: string;
  endTime: string;
  thumbnailUrl: string;
  tutor: Tutor;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}
