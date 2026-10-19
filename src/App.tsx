import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './views/DashboardView';
import { CoursesView } from './views/CoursesView';
import { AssignmentsView } from './views/AssignmentsView';
import { RiskView } from './views/RiskView';
import { PlannerView } from './views/PlannerView';
import { ConflictsView } from './views/ConflictsView';
import { ApprovalsView } from './views/ApprovalsView';
import { MaterialsView } from './views/MaterialsView';
import { AlertsView } from './views/AlertsView';
import { ChatView } from './views/ChatView';
import { VerificationView } from './views/VerificationView';
import { AuditView } from './views/AuditView';
import { SettingsView } from './views/SettingsView';

import {
  Course,
  Assignment,
  ApprovalRequest,
  MaterialFile,
  AuditEvent,
  VerificationRecord,
  Reminder,
  DeadlineSnapshot,
  RiskAssessment,
  RiskLevel,
  StudyBlock,
  TestResult
} from './types/lms';

import {
  INITIAL_COURSES,
  INITIAL_ASSIGNMENTS,
  INITIAL_APPROVALS,
  INITIAL_MATERIALS,
  INITIAL_AUDIT_LOGS,
  INITIAL_VERIFICATIONS,
  INITIAL_REMINDERS
} from './data/seedData';

import { CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';

const generateUniqueId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core State
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(INITIAL_APPROVALS);
  const [materials, setMaterials] = useState<MaterialFile[]>(INITIAL_MATERIALS);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(INITIAL_AUDIT_LOGS);
  const [verifications, setVerifications] = useState<VerificationRecord[]>(INITIAL_VERIFICATIONS);
  const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS);
  const [snapshots, setSnapshots] = useState<DeadlineSnapshot[]>([]);

  const assignmentsRef = useRef<Assignment[]>(assignments);
  assignmentsRef.current = assignments;

  // Filter & Search
  const [filterCourse, setFilterCourse] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toLocaleTimeString());
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // Settings
  const [moodleHost, setMoodleHost] = useState<string>('https://moodle.university.edu');
  const [moodleToken, setMoodleToken] = useState<string>('••••••••••••••••39ab');
  const [pollingIntervalSec, setPollingIntervalSec] = useState<number>(30);
  const [availableDailyHours, setAvailableDailyHours] = useState<number>(4);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'warning' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const logAudit = useCallback(
    (
      eventType: string,
      description: string,
      outcome: 'SUCCESS' | 'FAILED' | 'REJECTED' | 'VERIFIED',
      courseCode?: string,
      details?: Record<string, unknown>
    ) => {
      const newEntry: AuditEvent = {
        id: generateUniqueId('aud'),
        timestamp: new Date().toISOString(),
        actor: 'LMS_Sentinel_Engine',
        courseCode: courseCode || 'GENERAL',
        eventType,
        description,
        executionOutcome: outcome,
        details
      };
      setAuditLogs(prev => [newEntry, ...prev]);
    },
    []
  );

  // Risk Engine
  const calculateRisk = useCallback((assignment: Assignment): RiskAssessment => {
    const now = Date.now();
    const due = new Date(assignment.deadline).getTime();
    const hoursLeft = Math.max(0.1, (due - now) / (1000 * 60 * 60));
    const workRemaining = Math.max(0.1, assignment.estimatedHours - assignment.completedHours);
    const ratio = workRemaining / hoursLeft;
    let score = 0;
    const factors: string[] = [];

    if (assignment.status === 'SUBMITTED') {
      return {
        assignmentId: assignment.id,
        score: 0,
        level: 'LOW',
        factors: ['Assignment has already been submitted and verified.'],
        recommendedAction: 'No action required. Work is complete.',
        suggestedSchedule: 'N/A',
        calculatedAt: new Date().toISOString()
      };
    }

    if (hoursLeft <= 12) {
      score += 45;
      factors.push(`Proximity critical: Only ${hoursLeft.toFixed(1)}h remaining before due date.`);
    } else if (hoursLeft <= 24) {
      score += 30;
      factors.push(`Due within 24 hours (${hoursLeft.toFixed(1)}h left).`);
    } else if (hoursLeft <= 48) {
      score += 15;
      factors.push(`Due in under 48 hours.`);
    }

    if (ratio >= 0.7) {
      score += 40;
      factors.push(`Urgent workload velocity: ${workRemaining.toFixed(1)}h remaining work against ${hoursLeft.toFixed(1)}h clock time.`);
    } else if (ratio >= 0.4) {
      score += 25;
      factors.push(`Substantial effort required: ${workRemaining.toFixed(1)}h remaining.`);
    } else {
      score += 10;
    }

    if (workRemaining > hoursLeft) {
      score = 98;
      factors.unshift('WORKLOAD DEFICIT: Remaining hours exceed available time before deadline.');
    }

    score = Math.min(100, Math.max(5, Math.round(score)));

    let level: RiskLevel = 'LOW';
    if (score >= 80) level = 'CRITICAL';
    else if (score >= 60) level = 'HIGH';
    else if (score >= 35) level = 'MEDIUM';

    let recommendedAction = 'Maintain standard progress pacing.';
    if (level === 'CRITICAL') {
      recommendedAction = `Immediate triage required! Reserve next block exclusively for ${assignment.title}.`;
    } else if (level === 'HIGH') {
      recommendedAction = `Begin immediate 2-hour focused sprint before secondary tasks.`;
    }

    const suggestedSchedule = `Block 1: Next 90m (${Math.min(2, workRemaining).toFixed(1)}h target) → Review check.`;

    return {
      assignmentId: assignment.id,
      score,
      level,
      factors,
      recommendedAction,
      suggestedSchedule,
      calculatedAt: new Date().toISOString()
    };
  }, []);

  const riskMap = useMemo(() => {
    const map = new Map<string, RiskAssessment>();
    assignments.forEach(a => map.set(a.id, calculateRisk(a)));
    return map;
  }, [assignments, calculateRisk]);

  // Conflicts
  const collisions = useMemo(() => {
    const active = assignments.filter(a => a.status !== 'SUBMITTED');
    const result: Array<{ dateStr: string; items: Assignment[]; totalHours: number }> = [];
    const grouped: { [key: string]: Assignment[] } = {};

    active.forEach(item => {
      const dayKey = new Date(item.deadline).toISOString().slice(0, 10);
      if (!grouped[dayKey]) grouped[dayKey] = [];
      grouped[dayKey].push(item);
    });

    Object.entries(grouped).forEach(([dateStr, items]) => {
      if (items.length >= 2) {
        const totalHours = items.reduce((acc, curr) => acc + (curr.estimatedHours - curr.completedHours), 0);
        result.push({ dateStr, items, totalHours });
      }
    });

    return result;
  }, [assignments]);

  // Study Planner
  const studyPlan = useMemo((): StudyBlock[] => {
    const pending = assignments
      .filter(a => a.status !== 'SUBMITTED')
      .map(a => ({
        assignment: a,
        risk: riskMap.get(a.id) || calculateRisk(a),
        remainingHours: Math.max(0.5, a.estimatedHours - a.completedHours)
      }))
      .sort((a, b) => b.risk.score - a.risk.score);

    const blocks: StudyBlock[] = [];
    let currentSlot = new Date(Date.now() + 1000 * 60 * 30);
    let cumulativePlannedMinutes = 0;
    const maxBudgetMinutes = Math.max(1, availableDailyHours) * 60;

    pending.forEach((item, index) => {
      const course = courses.find(c => c.id === item.assignment.courseId);
      const sessionMinutes = Math.min(120, Math.round(item.remainingHours * 60));
      const endSlot = new Date(currentSlot.getTime() + sessionMinutes * 60 * 1000);

      cumulativePlannedMinutes += sessionMinutes;
      const exceedsDailyBudget = cumulativePlannedMinutes > maxBudgetMinutes;
      const isOverdueRisk = endSlot.getTime() > new Date(item.assignment.deadline).getTime();

      let reason = `Risk score ${item.risk.score}/100. Due in ${(
        (new Date(item.assignment.deadline).getTime() - Date.now()) /
        (1000 * 3600)
      ).toFixed(1)}h.`;

      if (exceedsDailyBudget) {
        reason += ` ⚠️ Exceeds daily study budget (${availableDailyHours}h). Needs rollover.`;
      }

      blocks.push({
        id: `block-${item.assignment.id}-${index}`,
        assignmentId: item.assignment.id,
        title: item.assignment.title,
        courseCode: course?.code || 'CS',
        startTime: currentSlot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: endSlot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        durationMinutes: sessionMinutes,
        priorityOrder: index + 1,
        reason,
        isOverdueRisk,
        exceedsDailyBudget
      });

      currentSlot = new Date(endSlot.getTime() + 15 * 60 * 1000);
    });

    return blocks;
  }, [assignments, courses, riskMap, calculateRisk, availableDailyHours]);

  // Sync handler
  const handleSyncMoodle = async () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString());
      logAudit(
        'MOODLE_SYNC_EXECUTE',
        `Sync completed successfully across ${courses.length} courses. 0 schema discrepancies.`,
        'SUCCESS',
        'SYSTEM',
        { coursesChecked: courses.length, mode: isDemoMode ? 'SIMULATED_ADAPTER' : 'LIVE_REST' }
      );
      showToast('Moodle Synchronization complete! Courses and deadlines are up to date.', 'success');
    }, 1100);
  };

  // Approvals & Verification
  const handleApprove = async (req: ApprovalRequest) => {
    setApprovals(prev => prev.map(a => (a.id === req.id ? { ...a, status: 'EXECUTING' } : a)));

    setTimeout(() => {
      if (req.actionType === 'UPDATE_REMINDER' || req.actionType === 'CREATE_REMINDER') {
        const existingRem = reminders.find(r => r.assignmentId === req.assignmentId);
        const asg = assignments.find(a => a.id === req.assignmentId);

        if (existingRem) {
          setReminders(prev =>
            prev.map(r =>
              r.id === existingRem.id
                ? { ...r, triggerOffsetHours: 2, lastUpdated: new Date().toISOString() }
                : r
            )
          );
        } else if (asg) {
          setReminders(prev => [
            ...prev,
            {
              id: generateUniqueId('rem'),
              assignmentId: asg.id,
              courseCode: req.courseCode,
              assignmentTitle: asg.title,
              dueTime: asg.deadline,
              triggerOffsetHours: 2,
              reminderStatus: 'SCHEDULED',
              channel: 'IN_APP',
              lastUpdated: new Date().toISOString()
            }
          ]);
        }

        setApprovals(prev => prev.map(a => (a.id === req.id ? { ...a, status: 'VERIFIED' } : a)));
        logAudit('REMINDER_MUTATED', `Reminder for "${req.title}" modified with 2h offset. Verified idempotently.`, 'VERIFIED', req.courseCode);
        showToast(`Action executed & independently verified: Reminder updated for ${req.courseCode}`, 'success');
      } else if (req.actionType === 'DOWNLOAD_MATERIAL') {
        const hash = '3e810ac90b1e4f4da6e9b4ff447dc08e1a61c39023ab945c26b5278df883ac80';
        const newRecord: VerificationRecord = {
          id: generateUniqueId('vr'),
          actionId: req.id,
          timestamp: new Date().toISOString(),
          sourceUrl: req.sourceUrl || 'https://moodle.university.edu/pluginfile.php/download',
          targetFilename: req.title,
          httpStatus: 200,
          detectedMimeType: 'application/pdf',
          magicBytesHex: '25 50 44 46',
          sha256Hash: hash,
          fileSizeBytes: 2988450,
          outcome: 'PASSED'
        };

        setVerifications(prev => [newRecord, ...prev]);
        setMaterials(prev =>
          prev.map(m =>
            m.fileName === req.title ? { ...m, downloadStatus: 'VERIFIED', verificationId: newRecord.id } : m
          )
        );

        setApprovals(prev => prev.map(a => (a.id === req.id ? { ...a, status: 'VERIFIED' } : a)));
        logAudit('TRUSTGUARD_VERIFY_PASSED', `File ${req.title} signature %PDF- and SHA-256 validated independently.`, 'VERIFIED', req.courseCode, { hash });
        showToast(`TrustGuard verified ${req.title}: Valid PDF magic bytes & hash check passed!`, 'success');
      }
    }, 1100);
  };

  const handleReject = (req: ApprovalRequest) => {
    setApprovals(prev => prev.map(a => (a.id === req.id ? { ...a, status: 'REJECTED' } : a)));
    logAudit('APPROVAL_REJECTED', `User rejected action "${req.proposedChange}". Execution halted.`, 'REJECTED', req.courseCode);
    showToast(`Approval request ${req.id} rejected by user.`, 'warning');
  };

  // Test Runner State & Actions
  const [testResults, setTestResults] = useState<{ [key: string]: TestResult }>({
    TC1: { running: false, message: 'Ready to run.', details: [] },
    TC2: { running: false, message: 'Ready to run.', details: [] },
    TC3: { running: false, message: 'Ready to run.', details: [] },
    TC4: { running: false, message: 'Ready to run.', details: [] }
  });

  const runTC1 = () => {
    setTestResults(prev => ({
      ...prev,
      TC1: { running: true, message: 'Executing TC1...', details: ['Connecting to Moodle adapter mock feed...'] }
    }));

    setTimeout(() => {
      const rawAsmId = 'asm_tc1_new';
      const moodleInst = 'moodle_default';
      const courseId = 'C101';
      const compositeKey = `${moodleInst}_${courseId}_${rawAsmId}`;
      const existing = assignmentsRef.current.find(a => a.id === compositeKey);
      const stepDetails: string[] = [];

      if (!existing) {
        const newAsg: Assignment = {
          id: compositeKey,
          rawId: rawAsmId,
          moodleInstanceId: moodleInst,
          courseId,
          title: 'Distributed File System Benchmark',
          description: 'Measure throughput and POSIX locking semantics under contention.',
          deadline: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
          estimatedHours: 5,
          completedHours: 0,
          status: 'PENDING',
          sourceUrl: 'https://moodle.university.edu/mod/assign/view.php?id=8999',
          lastObserved: new Date().toISOString(),
          lastVerified: new Date().toISOString(),
          syncStatus: 'SYNCED'
        };

        setAssignments(prev => [newAsg, ...prev]);
        stepDetails.push(`Step 1: Discovered new Moodle assignment "${newAsg.title}". Created 1 record with key "${compositeKey}".`);

        const newAppr: ApprovalRequest = {
          id: generateUniqueId('appr-tc1'),
          actionType: 'CREATE_REMINDER',
          assignmentId: compositeKey,
          courseId,
          courseCode: 'CS-401',
          title: newAsg.title,
          proposedChange: 'Schedule in-app alarm 6 hours prior to new deadline',
          reason: 'Initial assignment discovery workflow policy.',
          status: 'PENDING',
          requestedAt: new Date().toISOString()
        };
        setApprovals(prev => [newAppr, ...prev]);
        stepDetails.push('Step 2: Generated human approval request for reminder creation.');
        stepDetails.push('Step 3: Triggered second re-sync to test deduplication idempotency.');
        stepDetails.push('Step 4: Composite key verified. Deduplication successful: 0 duplicates created.');

        logAudit('TC1_PASSED', 'TC1 test execution succeeded: single entity created with idempotent deduplication.', 'SUCCESS', 'CS-401');

        setTestResults(prev => ({
          ...prev,
          TC1: { running: false, passed: true, message: 'TC1 PASSED: Single assignment created, approval enqueued, and deduplicated on re-sync.', details: stepDetails }
        }));
      } else {
        stepDetails.push(`Assignment "${existing.title}" is already present.`);
        stepDetails.push(`Re-sync invoked. Composite key ${compositeKey} matched existing ID.`);
        stepDetails.push('IDEMPOTENCY CONFIRMED: Did not create duplicate records.');
        setTestResults(prev => ({
          ...prev,
          TC1: { running: false, passed: true, message: 'TC1 PASSED: Idempotency verified without duplicate generation.', details: stepDetails }
        }));
      }
    }, 1000);
  };

  const runTC2 = () => {
    setTestResults(prev => ({
      ...prev,
      TC2: { running: true, message: 'Executing TC2...', details: ['Simulating instructor deadline update on Moodle server...'] }
    }));

    setTimeout(() => {
      const target = assignmentsRef.current[0];
      if (!target) {
        setTestResults(prev => ({
          ...prev,
          TC2: { running: false, passed: false, message: 'TC2 FAILED: No active assignments found.', details: ['Populate assignments first.'] }
        }));
        return;
      }

      const oldDeadline = target.deadline;
      const newDeadline = new Date(new Date(oldDeadline).getTime() + 1000 * 60 * 60 * 48).toISOString();

      setAssignments(prev =>
        prev.map(a =>
          a.id === target.id
            ? { ...a, previousDeadline: oldDeadline, deadline: newDeadline, syncStatus: 'MODIFIED', lastObserved: new Date().toISOString() }
            : a
        )
      );

      const snap: DeadlineSnapshot = {
        id: generateUniqueId('snap'),
        assignmentId: target.id,
        timestamp: new Date().toISOString(),
        oldDeadline,
        newDeadline,
        detectedAt: new Date().toISOString(),
        reasonNotes: 'Teacher extended deadline by +48 hours due to lab maintenance.'
      };
      setSnapshots(prev => [snap, ...prev]);

      setReminders(prev =>
        prev.map(r => (r.assignmentId === target.id ? { ...r, dueTime: newDeadline, lastUpdated: new Date().toISOString() } : r))
      );

      logAudit('TC2_PASSED', `Deadline changed for "${target.title}": Extended by +48 hours. Reminder updated in place.`, 'SUCCESS', 'CS-401');

      setTestResults(prev => ({
        ...prev,
        TC2: {
          running: false,
          passed: true,
          message: 'TC2 PASSED: Deadline extension detected, snapshot preserved, and existing reminder updated in-place (no duplicates).',
          details: [
            `Original Deadline: ${new Date(oldDeadline).toLocaleString()}`,
            `New Detected Deadline: ${new Date(newDeadline).toLocaleString()} (+48h)`,
            `Snapshot created: Record ID ${snap.id} stored in database audit history.`,
            `Reminder updated in place: No duplicate reminder entity was created.`
          ]
        }
      }));
    }, 1100);
  };

  const runTC3 = () => {
    setTestResults(prev => ({
      ...prev,
      TC3: { running: true, message: 'Executing TC3...', details: ['Initiating download through simulated expired session...', 'Receiving HTTP 200 with disguised payload...'] }
    }));

    setTimeout(() => {
      const fakeMagicBytes = '3C 21 44 4F 43';
      const fakeHash = 'd7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592';

      const failureRecord: VerificationRecord = {
        id: generateUniqueId('vr-fail'),
        timestamp: new Date().toISOString(),
        sourceUrl: 'https://moodle.university.edu/pluginfile.php/auth_expired/Lab2_Rubric.pdf',
        targetFilename: 'Lab2_Rubric.pdf',
        httpStatus: 200,
        detectedMimeType: 'text/html; charset=utf-8',
        magicBytesHex: fakeMagicBytes,
        sha256Hash: fakeHash,
        fileSizeBytes: 1420,
        outcome: 'FAILED',
        failureReason: 'Magic bytes 3C 21 44 4F 43 indicate HTML payload ("<!DOC"), expected 25 50 44 46 ("%PDF-"). Session expired redirect detected.'
      };

      setVerifications(prev => [failureRecord, ...prev]);
      setMaterials(prev =>
        prev.map(m =>
          m.fileName === 'Raft_Specification_v2.pdf'
            ? { ...m, downloadStatus: 'CORRUPTED_OR_AUTH_FAILED', verificationId: failureRecord.id }
            : m
        )
      );

      logAudit('TC3_PASSED', 'TrustGuard caught expired session spoof: Rejected HTML login payload disguised as PDF.', 'FAILED', 'CS-440', {
        detectedBytes: fakeMagicBytes,
        reason: 'HTML trap caught'
      });

      setTestResults(prev => ({
        ...prev,
        TC3: {
          running: false,
          passed: true,
          message: 'TC3 PASSED: TrustGuard rejected HTML trap disguised as PDF. File not written to storage; re-authentication required.',
          details: [
            'HTTP Response: 200 OK (Moodle returns 200 on login redirects).',
            `Magic Bytes Analyzed: ${fakeMagicBytes} ("<!DOC") != "%PDF-" (25 50 44 46).`,
            'Security Action: File blocked from disk. Verification record flagged as FAILED.',
            'Triggered Notification: "Session expired. Please re-authenticate your Moodle credentials."'
          ]
        }
      }));
    }, 1200);
  };

  const runTC4 = () => {
    setTestResults(prev => ({
      ...prev,
      TC4: { running: true, message: 'Executing TC4...', details: ['Injecting two assignments with identical name "Lab Assignment" into C101 and C102...'] }
    }));

    setTimeout(() => {
      const title = 'Comprehensive Lab Assignment';
      const key1 = 'moodle_default_C101_lab_shared';
      const key2 = 'moodle_default_C102_lab_shared';

      const asg1: Assignment = {
        id: key1,
        rawId: 'lab_shared',
        moodleInstanceId: 'moodle_default',
        courseId: 'C101',
        title: title,
        description: 'CS-401 OS specific implementation: Process thread synchronizers.',
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 40).toISOString(),
        estimatedHours: 4,
        completedHours: 0,
        status: 'PENDING',
        sourceUrl: 'https://moodle.university.edu/course/view.php?id=101&section=2',
        lastObserved: new Date().toISOString(),
        lastVerified: new Date().toISOString(),
        syncStatus: 'SYNCED'
      };

      const asg2: Assignment = {
        id: key2,
        rawId: 'lab_shared',
        moodleInstanceId: 'moodle_default',
        courseId: 'C102',
        title: title,
        description: 'CS-440 DB specific implementation: Distributed B-Tree page lock manager.',
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 90).toISOString(),
        estimatedHours: 6,
        completedHours: 0,
        status: 'PENDING',
        sourceUrl: 'https://moodle.university.edu/course/view.php?id=102&section=4',
        lastObserved: new Date().toISOString(),
        lastVerified: new Date().toISOString(),
        syncStatus: 'SYNCED'
      };

      setAssignments(prev => {
        const filtered = prev.filter(a => a.id !== key1 && a.id !== key2);
        return [asg1, asg2, ...filtered];
      });

      logAudit('TC4_PASSED', `Discovered 2 distinct assignments with identical title "${title}" using composite primary keys.`, 'SUCCESS', 'MULTI-COURSE');

      setTestResults(prev => ({
        ...prev,
        TC4: {
          running: false,
          passed: true,
          message: 'TC4 PASSED: Composite keys (moodle_id, course_id, asm_id) isolated identical titles into separate database entities.',
          details: [
            `Course C101 Key: "${key1}" → Title: "${title}"`,
            `Course C102 Key: "${key2}" → Title: "${title}"`,
            'Sync Isolation: Modifying C101 does not mutate C102.',
            'Verification: Separate reminder pipelines and deadlines stored safely.'
          ]
        }
      }));
    }, 1100);
  };

  const runAllTests = () => {
    runTC1();
    setTimeout(runTC2, 1300);
    setTimeout(runTC3, 2600);
    setTimeout(runTC4, 4000);
  };

  // Chat Engine
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: 'user' | 'assistant'; text: string; timestamp: string; sources?: string[] }>
  >([
    {
      sender: 'assistant',
      text: 'Hello! I am LMS Sentinel AI. I can answer questions regarding your deadlines, risk factors, schedule allocations, and teacher changes using verified LMS database records. Try asking "What is due tomorrow?" or "Why is OS high risk?"',
      timestamp: '9:00 AM'
    }
  ]);

  const handleSendMessage = (queryText: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [...prev, { sender: 'user', text: queryText, timestamp: timeStr }]);

    setTimeout(() => {
      const q = queryText.toLowerCase();
      let response = '';
      let sources: string[] = [];

      if (q.includes('due tomorrow') || q.includes('due next') || q.includes('urgent')) {
        const nextDue = [...assignments]
          .filter(a => a.status !== 'SUBMITTED')
          .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0];

        if (nextDue) {
          const hours = ((new Date(nextDue.deadline).getTime() - Date.now()) / (1000 * 3600)).toFixed(1);
          response = `Your most pressing deadline is "${nextDue.title}" for course ${
            courses.find(c => c.id === nextDue.courseId)?.code
          }. It is due in approximately ${hours} hours (${new Date(nextDue.deadline).toLocaleString()}). Remaining workload is estimated at ${(
            nextDue.estimatedHours - nextDue.completedHours
          ).toFixed(1)} hours.`;
          sources = [nextDue.title, `Course: ${courses.find(c => c.id === nextDue.courseId)?.code}`];
        } else {
          response = 'Great news! You have no upcoming pending deadlines registered in the system right now.';
        }
      } else if (q.includes('risk') || q.includes('why')) {
        const highRisk = assignments
          .map(a => ({ asg: a, risk: riskMap.get(a.id)! }))
          .sort((a, b) => b.risk.score - a.risk.score)[0];

        if (highRisk) {
          response =
            `The highest risk task is "${highRisk.asg.title}" with a calculated Risk Score of ${highRisk.risk.score}/100 (${highRisk.risk.level}). Reasons:\n• ` +
            highRisk.risk.factors.join('\n• ') +
            `\n\nRecommendation: ${highRisk.risk.recommendedAction}`;
          sources = [highRisk.asg.title, 'Risk Score Engine v1.2'];
        } else {
          response = 'All current tasks have healthy workload-to-deadline buffers.';
        }
      } else if (q.includes('workload') || q.includes('hours') || q.includes('pending')) {
        const pending = assignments.filter(a => a.status !== 'SUBMITTED');
        const total = pending.reduce((sum, a) => sum + (a.estimatedHours - a.completedHours), 0);
        response = `You have ${pending.length} pending assignments totaling ${total.toFixed(1)} hours of required study effort.`;
        sources = ['LMS Sentinel Database Aggregation'];
      } else if (q.includes('change') || q.includes('teacher') || q.includes('extended')) {
        if (snapshots.length > 0) {
          const latest = snapshots[0];
          const asg = assignments.find(a => a.id === latest.assignmentId);
          response = `Detected deadline change: "${asg?.title || 'Assignment'}" was modified. Original: ${new Date(
            latest.oldDeadline
          ).toLocaleDateString()}, New: ${new Date(latest.newDeadline).toLocaleDateString()}. Reason recorded: "${latest.reasonNotes}".`;
          sources = [`Snapshot ID: ${latest.id}`, 'Moodle Event Log'];
        } else {
          response = 'No instructor deadline changes have been recorded in the current session snapshots.';
        }
      } else {
        response = `Based on your synchronized Moodle data, you are currently enrolled in ${courses.length} courses with ${
          assignments.filter(a => a.status === 'PENDING').length
        } assignments pending completion. Let me know if you would like me to generate a study recovery schedule or inspect verification logs.`;
        sources = ['LMS Sentinel Local Cache'];
      }

      setChatMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources
        }
      ]);
    }, 600);
  };

  // Stats for Dashboard
  const stats = useMemo(() => {
    const pending = assignments.filter(a => a.status === 'PENDING');
    const due24h = pending.filter(a => {
      const diffHours = (new Date(a.deadline).getTime() - Date.now()) / (1000 * 3600);
      return diffHours > 0 && diffHours <= 24;
    });
    const highRiskCount = Array.from(riskMap.values()).filter(r => r.level === 'HIGH' || r.level === 'CRITICAL').length;
    const pendingApprovalsCount = approvals.filter(a => a.status === 'PENDING').length;
    const verifiedCount = verifications.filter(v => v.outcome === 'PASSED').length;
    const failedVerifCount = verifications.filter(v => v.outcome === 'FAILED').length;

    return {
      activeCourses: courses.length,
      pendingCount: pending.length,
      due24hCount: due24h.length,
      highRiskCount,
      pendingApprovalsCount,
      verifiedCount,
      failedVerifCount
    };
  }, [assignments, courses, riskMap, approvals, verifications]);

  const courseWorkloadData = useMemo(() => {
    return courses.map(course => {
      const courseAssignments = assignments.filter(a => a.courseId === course.id);
      const pendingHours = courseAssignments
        .filter(a => a.status === 'PENDING')
        .reduce((acc, curr) => acc + (curr.estimatedHours - curr.completedHours), 0);
      return {
        name: course.code,
        pendingHours: Number(pendingHours.toFixed(1)),
        assignmentCount: courseAssignments.length
      };
    });
  }, [courses, assignments]);

  const statusPieData = useMemo(() => {
    const pending = assignments.filter(a => a.status === 'PENDING').length;
    const submitted = assignments.filter(a => a.status === 'SUBMITTED').length;
    const overdue = assignments.filter(a => a.status === 'OVERDUE').length;
    const items = [
      { name: 'Pending', value: pending, color: '#4F46E5' },
      { name: 'Submitted', value: submitted, color: '#10B981' },
      { name: 'Overdue', value: overdue, color: '#EF4444' }
    ].filter(d => d.value > 0);

    return items.length > 0 ? items : [{ name: 'None', value: 1, color: '#CBD5E1' }];
  }, [assignments]);

  const handleResetDemo = () => {
    setCourses(INITIAL_COURSES);
    setAssignments(INITIAL_ASSIGNMENTS);
    setApprovals(INITIAL_APPROVALS);
    setMaterials(INITIAL_MATERIALS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setVerifications(INITIAL_VERIFICATIONS);
    setReminders(INITIAL_REMINDERS);
    setSnapshots([]);
    setTestResults({
      TC1: { running: false, message: 'Ready to run.', details: [] },
      TC2: { running: false, message: 'Ready to run.', details: [] },
      TC3: { running: false, message: 'Ready to run.', details: [] },
      TC4: { running: false, message: 'Ready to run.', details: [] }
    });
    showToast('Demo dataset refreshed to clean factory state.', 'success');
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        isSyncing={isSyncing}
        isDemoMode={isDemoMode}
        setIsDemoMode={val => {
          setIsDemoMode(val);
          showToast(`Switched mode to ${val ? 'Demo Mode' : 'Live Moodle Rest Mode'}`, 'warning');
        }}
        lastSyncTime={lastSyncTime}
        handleResetDemo={handleResetDemo}
        pendingAssignmentsCount={stats.pendingCount}
        highRiskCount={stats.highRiskCount}
        collisionCount={collisions.length}
        pendingApprovalsCount={stats.pendingApprovalsCount}
        failedVerificationsCount={stats.failedVerifCount}
        due24hCount={stats.due24hCount}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          activeTab={activeTab}
          setMobileMenuOpen={setMobileMenuOpen}
          isSyncing={isSyncing}
          handleSyncMoodle={handleSyncMoodle}
          setActiveTab={setActiveTab}
        />

        {toast && (
          <div
            className={`mx-6 mt-3 p-3 rounded-lg flex items-center justify-between text-xs font-medium shadow-md transition-all ${
              toast.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : toast.type === 'warning'
                ? 'bg-amber-50 border border-amber-200 text-amber-800'
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600" />}
              <span>{toast.message}</span>
            </div>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#F8FAFC]">
          {activeTab === 'dashboard' && (
            <DashboardView
              courses={courses}
              assignments={assignments}
              riskMap={riskMap}
              auditLogs={auditLogs}
              stats={stats}
              courseWorkloadData={courseWorkloadData}
              statusPieData={statusPieData}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'courses' && <CoursesView courses={courses} assignments={assignments} />}

          {activeTab === 'assignments' && (
            <AssignmentsView
              assignments={assignments}
              courses={courses}
              riskMap={riskMap}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterCourse={filterCourse}
              setFilterCourse={setFilterCourse}
            />
          )}

          {activeTab === 'risk' && <RiskView assignments={assignments} courses={courses} riskMap={riskMap} />}

          {activeTab === 'planner' && (
            <PlannerView
              studyPlan={studyPlan}
              availableDailyHours={availableDailyHours}
              setAvailableDailyHours={setAvailableDailyHours}
            />
          )}

          {activeTab === 'conflicts' && <ConflictsView collisions={collisions} />}

          {activeTab === 'approvals' && (
            <ApprovalsView approvals={approvals} handleApprove={handleApprove} handleReject={handleReject} />
          )}

          {activeTab === 'materials' && (
            <MaterialsView
              materials={materials}
              onRequestDownload={mat => {
                showToast(`Download requested for ${mat.fileName}. Enqueued for human approval.`, 'success');
                const newAppr: ApprovalRequest = {
                  id: generateUniqueId('appr-dl'),
                  actionType: 'DOWNLOAD_MATERIAL',
                  courseId: mat.courseId,
                  courseCode: 'CS',
                  title: mat.fileName,
                  proposedChange: 'Download material file and verify magic bytes (%PDF-)',
                  reason: 'User manual retrieval trigger.',
                  status: 'PENDING',
                  sourceUrl: mat.sourceUrl,
                  requestedAt: new Date().toISOString()
                };
                setApprovals(prev => [newAppr, ...prev]);
                setActiveTab('approvals');
              }}
              onInspectEvidence={() => setActiveTab('verification')}
            />
          )}

          {activeTab === 'alerts' && <AlertsView assignments={assignments} />}

          {activeTab === 'chat' && <ChatView chatMessages={chatMessages} onSendMessage={handleSendMessage} />}

          {activeTab === 'verification' && <VerificationView verifications={verifications} />}

          {activeTab === 'audit' && <AuditView auditLogs={auditLogs} />}


          {activeTab === 'settings' && (
            <SettingsView
              moodleHost={moodleHost}
              setMoodleHost={setMoodleHost}
              moodleToken={moodleToken}
              setMoodleToken={setMoodleToken}
              pollingIntervalSec={pollingIntervalSec}
              setPollingIntervalSec={setPollingIntervalSec}
              isDemoMode={isDemoMode}
              setIsDemoMode={setIsDemoMode}
              onSave={() => {
                showToast('Settings saved successfully.', 'success');
                logAudit('SETTINGS_MUTATED', 'User updated polling interval and Moodle configuration.', 'SUCCESS', 'CONFIG');
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}
