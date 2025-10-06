// Telegram Bot Types

export interface User {
  id: number;
  username?: string;
  first_name: string;
  last_name?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface Session {
  session_id: string;
  status: 'pending' | 'verified' | 'expired';
  user_id?: number;
  created_at: number;
  verified_at?: number;
  user_data?: User;
}

export interface UserActivityLog {
  id?: number;
  user_id: number;
  username?: string;
  first_name: string;
  last_name?: string;
  language_code?: string;
  is_premium?: boolean;
  action: string;
  timestamp: number;
  session_id?: string;
  created_at?: number;
}

export interface UserLoginLog {
  id?: number;
  user_id: number;
  username?: string;
  first_name: string;
  last_name?: string;
  language_code?: string;
  login_time: number;
  session_id: string;
  created_at?: number;
}

export interface Channel {
  id: string;
  title: string;
  username?: string;
}