// Database module for Telegram bot
// Using localStorage as a simple database for this implementation

import { Session, User, UserActivityLog, UserLoginLog } from './types';

const SESSIONS_KEY = 'telegram_bot_sessions';
const USERS_KEY = 'telegram_bot_users';
const ACTIVITY_LOGS_KEY = 'telegram_bot_activity_logs';
const LOGIN_LOGS_KEY = 'telegram_bot_login_logs';

// Session management
export const createSession = (sessionId: string): Session => {
  const session: Session = {
    session_id: sessionId,
    status: 'pending',
    created_at: Date.now()
  };
  
  saveSession(session);
  return session;
};

export const getSession = (sessionId: string): Session | null => {
  const sessions = getSessions();
  return sessions[sessionId] || null;
};

export const updateSession = (session: Session): void => {
  const sessions = getSessions();
  sessions[session.session_id] = session;
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

export const saveSession = (session: Session): void => {
  const sessions = getSessions();
  sessions[session.session_id] = session;
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

const getSessions = (): Record<string, Session> => {
  const sessionsStr = localStorage.getItem(SESSIONS_KEY);
  return sessionsStr ? JSON.parse(sessionsStr) : {};
};

// User management
export const saveUser = (user: User): void => {
  const users = getUsers();
  users[user.id] = user;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  // Update login count
  const loginLogs = getLoginLogs();
  const userLogins = loginLogs.filter(log => log.user_id === user.id);
  const loginCount = userLogins.length;
  
  // Update user in users table
  const updatedUser = {
    ...user,
    last_login: Date.now(),
    login_count: loginCount
  };
  
  users[user.id] = updatedUser;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const getUsers = (): Record<number, User> => {
  const usersStr = localStorage.getItem(USERS_KEY);
  return usersStr ? JSON.parse(usersStr) : {};
};

// Activity logs
export const logActivity = (log: UserActivityLog): void => {
  const logs = getActivityLogs();
  logs.push({
    ...log,
    created_at: Date.now()
  });
  localStorage.setItem(ACTIVITY_LOGS_KEY, JSON.stringify(logs));
};

const getActivityLogs = (): UserActivityLog[] => {
  const logsStr = localStorage.getItem(ACTIVITY_LOGS_KEY);
  return logsStr ? JSON.parse(logsStr) : [];
};

// Login logs
export const logLogin = (log: UserLoginLog): void => {
  const logs = getLoginLogs();
  logs.push({
    ...log,
    created_at: Date.now()
  });
  localStorage.setItem(LOGIN_LOGS_KEY, JSON.stringify(logs));
};

const getLoginLogs = (): UserLoginLog[] => {
  const logsStr = localStorage.getItem(LOGIN_LOGS_KEY);
  return logsStr ? JSON.parse(logsStr) : [];
};

// Cleanup expired sessions
export const cleanupExpiredSessions = (expirationTime: number): void => {
  const sessions = getSessions();
  const now = Date.now();
  let updated = false;
  
  for (const sessionId in sessions) {
    const session = sessions[sessionId];
    if (session.created_at + expirationTime < now && session.status !== 'expired') {
      session.status = 'expired';
      sessions[sessionId] = session;
      updated = true;
    }
  }
  
  if (updated) {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  }
};