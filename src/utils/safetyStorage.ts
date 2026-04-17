// Safety and security utilities for blocking and reporting users

export interface BlockedUser {
  userId: string;
  blockedBy: string; // User ID of person who blocked
  blockedAt: number;
  reason?: string;
}

export interface ReportedUser {
  reportId: string;
  reportedUserId: string;
  reportedBy: string; // User ID of reporter
  reason: string;
  description?: string;
  reportedAt: number;
  status: 'pending' | 'reviewed' | 'dismissed';
}

const BLOCKED_USERS_KEY = 'msu_blocked_users';
const REPORTED_USERS_KEY = 'msu_reported_users';

// Block a user
export function blockUser(userId: string, blockedUserId: string, reason?: string): void {
  const blocked = getBlockedUsers();
  
  // Check if already blocked
  const alreadyBlocked = blocked.find(
    b => b.userId === blockedUserId && b.blockedBy === userId
  );
  
  if (alreadyBlocked) {
    return; // Already blocked
  }
  
  const newBlock: BlockedUser = {
    userId: blockedUserId,
    blockedBy: userId,
    blockedAt: Date.now(),
    reason,
  };
  
  blocked.push(newBlock);
  localStorage.setItem(BLOCKED_USERS_KEY, JSON.stringify(blocked));
}

// Unblock a user
export function unblockUser(userId: string, blockedUserId: string): void {
  let blocked = getBlockedUsers();
  blocked = blocked.filter(
    b => !(b.userId === blockedUserId && b.blockedBy === userId)
  );
  localStorage.setItem(BLOCKED_USERS_KEY, JSON.stringify(blocked));
}

// Check if a user is blocked
export function isUserBlocked(userId: string, targetUserId: string): boolean {
  const blocked = getBlockedUsers();
  return blocked.some(
    b => b.userId === targetUserId && b.blockedBy === userId
  );
}

// Get all blocked users for a specific user
export function getBlockedUsersByUser(userId: string): string[] {
  const blocked = getBlockedUsers();
  return blocked
    .filter(b => b.blockedBy === userId)
    .map(b => b.userId);
}

// Get all blocked users
export function getBlockedUsers(): BlockedUser[] {
  const data = localStorage.getItem(BLOCKED_USERS_KEY);
  return data ? JSON.parse(data) : [];
}

// Report a user
export function reportUser(
  reportedUserId: string,
  reportedBy: string,
  reason: string,
  description?: string
): void {
  const reports = getReportedUsers();
  
  const newReport: ReportedUser = {
    reportId: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    reportedUserId,
    reportedBy,
    reason,
    description,
    reportedAt: Date.now(),
    status: 'pending',
  };
  
  reports.push(newReport);
  localStorage.setItem(REPORTED_USERS_KEY, JSON.stringify(reports));
}

// Get all reports
export function getReportedUsers(): ReportedUser[] {
  const data = localStorage.getItem(REPORTED_USERS_KEY);
  return data ? JSON.parse(data) : [];
}

// Get reports by a specific user
export function getReportsByUser(userId: string): ReportedUser[] {
  const reports = getReportedUsers();
  return reports.filter(r => r.reportedBy === userId);
}

// Check if user has been reported multiple times (potential bad actor)
export function getReportCount(userId: string): number {
  const reports = getReportedUsers();
  return reports.filter(r => r.reportedUserId === userId).length;
}

// Get report reasons
export const REPORT_REASONS = [
  'Inappropriate messages',
  'Harassment or bullying',
  'Spam or scam',
  'Fake profile',
  'Offensive content',
  'Suspicious behavior',
  'Other',
] as const;

export type ReportReason = typeof REPORT_REASONS[number];
