export type GamificationLevel = 'Beginner' | 'Explorer' | 'Achiever' | 'Deadline Master' | 'Sentinel Champion';

export interface XPTransaction {
  id: string;
  studentId: string;
  eventType: 'ASSIGNMENT_COMPLETION' | 'ON_TIME_BONUS' | 'STUDY_SESSION' | 'CHALLENGE_REWARD';
  pointsAwarded: number;
  sourceType: 'MOODLE_VERIFIED' | 'STUDENT_REPORTED' | 'DEMO_SIMULATED';
  sourceReferenceId: string;
  idempotencyKey: string;
  createdAt: string;
}

export interface BadgeItem {
  id: string;
  code: string;
  name: string;
  description: string;
  iconName: string;
  earnedAt?: string;
  progressPercent?: number;
}

export interface WeeklyChallenge {
  id: string;
  code: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  rewardXP: number;
  isClaimed: boolean;
  expiresInDays: number;
}

export interface LeaderboardEntry {
  rank: number;
  displayName: string;
  level: GamificationLevel;
  xp: number;
  isCurrentUser: boolean;
  streakDays: number;
}
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ApprovalStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXECUTING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'VERIFIED'
  | 'VERIFICATION_FAILED';
export type ActionType = 'CREATE_REMINDER' | 'UPDATE_REMINDER' | 'DOWNLOAD_MATERIAL' | 'RESCHEDULE_PLAN';

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  semester: string;
  color: string;
}

export interface DeadlineSnapshot {
  id: string;
  assignmentId: string;
  timestamp: string;
  oldDeadline: string;
  newDeadline: string;
  detectedAt: string;
  reasonNotes: string;
}

export interface Assignment {
  id: string; // composite key: moodleInstanceId_courseId_rawId
  rawId: string;
  moodleInstanceId: string;
  courseId: string;
  title: string;
  description: string;
  deadline: string;
  previousDeadline?: string;
  estimatedHours: number;
  completedHours: number;
  status: 'PENDING' | 'SUBMITTED' | 'OVERDUE';
  sourceUrl: string;
  lastObserved: string;
  lastVerified: string;
  syncStatus: 'SYNCED' | 'MODIFIED' | 'CONFLICT';
}

export interface RiskAssessment {
  assignmentId: string;
  score: number;
  level: RiskLevel;
  factors: string[];
  recommendedAction: string;
  suggestedSchedule: string;
  calculatedAt: string;
}

export interface StudyBlock {
  id: string;
  assignmentId: string;
  title: string;
  courseCode: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  priorityOrder: number;
  reason: string;
  isOverdueRisk: boolean;
  exceedsDailyBudget: boolean;
}

export interface ApprovalRequest {
  id: string;
  actionType: ActionType;
  assignmentId?: string;
  courseId: string;
  courseCode: string;
  title: string;
  proposedChange: string;
  reason: string;
  status: ApprovalStatus;
  requestedAt: string;
  sourceUrl?: string;
}

export interface VerificationRecord {
  id: string;
  actionId?: string;
  timestamp: string;
  sourceUrl: string;
  targetFilename: string;
  httpStatus: number;
  detectedMimeType: string;
  magicBytesHex: string;
  sha256Hash: string;
  fileSizeBytes: number;
  outcome: 'PASSED' | 'FAILED';
  failureReason?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  courseCode?: string;
  eventType: string;
  description: string;
  executionOutcome: 'SUCCESS' | 'FAILED' | 'REJECTED' | 'VERIFIED';
  details?: Record<string, unknown>;
}

export interface Reminder {
  id: string;
  assignmentId: string;
  courseCode: string;
  assignmentTitle: string;
  dueTime: string;
  triggerOffsetHours: number;
  reminderStatus: 'SCHEDULED' | 'TRIGGERED' | 'ACKNOWLEDGED';
  channel: 'IN_APP' | 'CALENDAR_BRIDGE';
  lastUpdated: string;
}

export interface MaterialFile {
  id: string;
  courseId: string;
  assignmentId?: string;
  fileName: string;
  fileSizeFormatted: string;
  sourceUrl: string;
  downloadStatus: 'NOT_DOWNLOADED' | 'VERIFYING' | 'VERIFIED' | 'CORRUPTED_OR_AUTH_FAILED';
  verificationId?: string;
}

export interface TestResult {
  running: boolean;
  passed?: boolean;
  message: string;
  details: string[];
}