import { Course, Assignment, ApprovalRequest, MaterialFile, AuditEvent, VerificationRecord, Reminder } from '../types/lms';

export const INITIAL_COURSES: Course[] = [
  { id: 'C101', code: 'CS-401', name: 'Operating Systems & Concurrency', instructor: 'Dr. Aris Thorne', semester: 'Fall 2026', color: '#4F46E5' },
  { id: 'C102', code: 'CS-440', name: 'Distributed Database Architectures', instructor: 'Prof. Elena Rostova', semester: 'Fall 2026', color: '#0EA5E9' },
  { id: 'C103', code: 'MATH-302', name: 'Applied Bayesian Statistics', instructor: 'Dr. Samuel Kross', semester: 'Fall 2026', color: '#10B981' },
  { id: 'C104', code: 'ENG-205', name: 'Software Verification & Safe Protocols', instructor: 'Dr. Evelyn Vance', semester: 'Fall 2026', color: '#F59E0B' }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'moodle_default_C101_asm01',
    rawId: 'asm01',
    moodleInstanceId: 'moodle_default',
    courseId: 'C101',
    title: 'Kernel Thread Scheduler in C++',
    description: 'Implement a multi-level feedback queue CPU scheduler with starvation prevention.',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString(),
    estimatedHours: 6.5,
    completedHours: 1.0,
    status: 'PENDING',
    sourceUrl: 'https://moodle.university.edu/mod/assign/view.php?id=8041',
    lastObserved: new Date().toISOString(),
    lastVerified: new Date().toISOString(),
    syncStatus: 'SYNCED'
  },
  {
    id: 'moodle_default_C102_asm02',
    rawId: 'asm02',
    moodleInstanceId: 'moodle_default',
    courseId: 'C102',
    title: 'Raft Consensus Protocol Milestone',
    description: 'Build log replication and heartbeat leader election RPC routines.',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 42).toISOString(),
    estimatedHours: 8.0,
    completedHours: 3.5,
    status: 'PENDING',
    sourceUrl: 'https://moodle.university.edu/mod/assign/view.php?id=9214',
    lastObserved: new Date().toISOString(),
    lastVerified: new Date().toISOString(),
    syncStatus: 'SYNCED'
  },
  {
    id: 'moodle_default_C103_asm03',
    rawId: 'asm03',
    moodleInstanceId: 'moodle_default',
    courseId: 'C103',
    title: 'Markov Chain Monte Carlo Analysis',
    description: 'Fit posterior predictive distributions for real climate sensor sets.',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 96).toISOString(),
    estimatedHours: 4.0,
    completedHours: 4.0,
    status: 'SUBMITTED',
    sourceUrl: 'https://moodle.university.edu/mod/assign/view.php?id=4301',
    lastObserved: new Date().toISOString(),
    lastVerified: new Date().toISOString(),
    syncStatus: 'SYNCED'
  },
  {
    id: 'moodle_default_C104_asm04',
    rawId: 'asm04',
    moodleInstanceId: 'moodle_default',
    courseId: 'C104',
    title: 'Static Analysis Formal Proofs',
    description: 'Verify memory leak-free invariants on smart contract bytecode.',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 120).toISOString(),
    estimatedHours: 5.0,
    completedHours: 1.5,
    status: 'PENDING',
    sourceUrl: 'https://moodle.university.edu/mod/assign/view.php?id=7762',
    lastObserved: new Date().toISOString(),
    lastVerified: new Date().toISOString(),
    syncStatus: 'SYNCED'
  }
];

export const INITIAL_APPROVALS: ApprovalRequest[] = [
  {
    id: 'appr-01',
    actionType: 'UPDATE_REMINDER',
    assignmentId: 'moodle_default_C101_asm01',
    courseId: 'C101',
    courseCode: 'CS-401',
    title: 'Kernel Thread Scheduler in C++',
    proposedChange: 'Offset notification from 4h to 2h prior to deadline due to tight urgency window',
    reason: 'Risk Engine identified remaining work (5.5h) exceeds remaining time ratio buffer.',
    status: 'PENDING',
    requestedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'appr-02',
    actionType: 'DOWNLOAD_MATERIAL',
    courseId: 'C102',
    courseCode: 'CS-440',
    title: 'Raft_Specification_v2.pdf',
    proposedChange: 'Download lecture specification PDF and run TrustGuard signature validation',
    reason: 'Instructor added supplementary protocol errata attachment.',
    status: 'PENDING',
    sourceUrl: 'https://moodle.university.edu/pluginfile.php/9214/mod_assign/intro/Raft_v2.pdf',
    requestedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  }
];

export const INITIAL_MATERIALS: MaterialFile[] = [
  {
    id: 'mat-01',
    courseId: 'C101',
    assignmentId: 'moodle_default_C101_asm01',
    fileName: 'Lab1_Threading_Spec.pdf',
    fileSizeFormatted: '1.42 MB',
    sourceUrl: 'https://moodle.university.edu/mod/assign/view.php?id=8041&file=Lab1.pdf',
    downloadStatus: 'VERIFIED',
    verificationId: 'v-seed-01'
  },
  {
    id: 'mat-02',
    courseId: 'C102',
    assignmentId: 'moodle_default_C102_asm02',
    fileName: 'Raft_Specification_v2.pdf',
    fileSizeFormatted: '2.85 MB',
    sourceUrl: 'https://moodle.university.edu/pluginfile.php/9214/mod_assign/intro/Raft_v2.pdf',
    downloadStatus: 'NOT_DOWNLOADED'
  },
  {
    id: 'mat-03',
    courseId: 'C104',
    assignmentId: 'moodle_default_C104_asm04',
    fileName: 'Formal_Proof_Checklist.pdf',
    fileSizeFormatted: '620 KB',
    sourceUrl: 'https://moodle.university.edu/mod/assign/view.php?id=7762&file=Proof.pdf',
    downloadStatus: 'NOT_DOWNLOADED'
  }
];

export const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'aud-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    actor: 'MoodleAdapter::PollingEngine',
    courseCode: 'SYSTEM',
    eventType: 'SYNC_DISCOVERY',
    description: 'Moodle poll cycle succeeded: 4 courses verified, 4 active assignments parsed.',
    executionOutcome: 'SUCCESS',
    details: { instance: 'moodle_default', latencyMs: 142 }
  },
  {
    id: 'aud-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
    actor: 'TrustGuard::FileVerifier',
    courseCode: 'CS-401',
    eventType: 'FILE_SIGNATURE_VERIFIED',
    description: 'Verified Lab1_Threading_Spec.pdf. Magic Bytes: 25 50 44 46 (%PDF). SHA-256 match.',
    executionOutcome: 'VERIFIED',
    details: { sha256: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4', size: 1488972 }
  }
];

export const INITIAL_VERIFICATIONS: VerificationRecord[] = [
  {
    id: 'v-seed-01',
    actionId: 'appr-prev',
    timestamp: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
    sourceUrl: 'https://moodle.university.edu/mod/assign/view.php?id=8041&file=Lab1.pdf',
    targetFilename: 'Lab1_Threading_Spec.pdf',
    httpStatus: 200,
    detectedMimeType: 'application/pdf',
    magicBytesHex: '25 50 44 46',
    sha256Hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    fileSizeBytes: 1488972,
    outcome: 'PASSED'
  }
];

export const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 'rem-01',
    assignmentId: 'moodle_default_C101_asm01',
    courseCode: 'CS-401',
    assignmentTitle: 'Kernel Thread Scheduler in C++',
    dueTime: INITIAL_ASSIGNMENTS[0].deadline,
    triggerOffsetHours: 4,
    reminderStatus: 'SCHEDULED',
    channel: 'IN_APP',
    lastUpdated: new Date().toISOString()
  }
];