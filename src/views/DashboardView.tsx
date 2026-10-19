import React from 'react';
import { BookOpen, CheckSquare, Clock, AlertTriangle, CheckCheck, FileCheck, ShieldAlert, FileText } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { Course, Assignment, RiskAssessment, AuditEvent } from '../types/lms';

interface DashboardViewProps {
  courses: Course[];
  assignments: Assignment[];
  riskMap: Map<string, RiskAssessment>;
  auditLogs: AuditEvent[];
  stats: {
    activeCourses: number;
    pendingCount: number;
    due24hCount: number;
    highRiskCount: number;
    pendingApprovalsCount: number;
    verifiedCount: number;
  };
  courseWorkloadData: Array<{ name: string; pendingHours: number; assignmentCount: number }>;
  statusPieData: Array<{ name: string; value: number; color: string }>;
  setActiveTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  courses,
  assignments,
  riskMap,
  auditLogs,
  stats,
  courseWorkloadData,
  statusPieData,
  setActiveTab
}) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
            <span>Active Courses</span>
            <BookOpen className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-800">{stats.activeCourses}</div>
          <div className="text-[10px] text-slate-400 mt-1">Fall 2026 term</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
            <span>Pending Work</span>
            <CheckSquare className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-indigo-600">{stats.pendingCount}</div>
          <div className="text-[10px] text-indigo-500/80 mt-1 font-medium">Assignments active</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
            <span>Due &lt; 24h</span>
            <Clock className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-600">{stats.due24hCount}</div>
          <div className="text-[10px] text-rose-500 mt-1 font-medium">Immediate priority</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
            <span>High Risk</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-600">{stats.highRiskCount}</div>
          <div className="text-[10px] text-amber-600 mt-1">Score &gt;= 60/100</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
            <span>Pending Approvals</span>
            <CheckCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-indigo-700">{stats.pendingApprovalsCount}</div>
          <div className="text-[10px] text-indigo-600 mt-1">Human-in-the-loop</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium">
            <span>TrustGuard Verified</span>
            <FileCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">{stats.verifiedCount}</div>
          <div className="text-[10px] text-emerald-600 mt-1">SHA-256 passed</div>
        </div>
      </div>

      {stats.due24hCount > 0 && (
        <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-white border border-rose-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-rose-600 text-white rounded-lg mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Critical Deadline Velocity Warning</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                You have {stats.due24hCount} assignment due within the next 24 hours. The risk engine recommends prioritizing &ldquo;{assignments[0]?.title}&rdquo; before starting new tasks.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('planner')}
            className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 whitespace-nowrap shadow-sm"
          >
            Open Smart Planner
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Remaining Workload By Course</h3>
              <p className="text-[11px] text-slate-500">Estimated remaining work hours calculated from active assignments</p>
            </div>
            <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium">Hours of Effort</span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseWorkloadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="pendingHours" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Pending Hours" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Assignment Health</h3>
          <p className="text-[11px] text-slate-500 mb-2">Overall status distribution</p>
          <div className="h-44 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusPieData} innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="border-t border-slate-100 pt-3 mt-2 flex justify-between text-xs text-slate-600">
            <span>Total Tracked</span>
            <span className="font-bold text-slate-800">{assignments.length} Tasks</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Upcoming Deadlines</h3>
            <button onClick={() => setActiveTab('assignments')} className="text-xs text-indigo-600 hover:underline font-medium">
              View all
            </button>
          </div>

          <div className="space-y-3">
            {assignments
              .filter(a => a.status !== 'SUBMITTED')
              .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
              .map(a => {
                const risk = riskMap.get(a.id);
                const course = courses.find(c => c.id === a.courseId);
                const hoursLeft = (new Date(a.deadline).getTime() - Date.now()) / (1000 * 3600);

                return (
                  <div key={a.id} className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <div className="min-w-0 flex-1 pr-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                          {course?.code}
                        </span>
                        <h4 className="text-xs font-semibold text-slate-800 truncate">{a.title}</h4>
                      </div>
                      <div className="flex items-center space-x-3 mt-1.5 text-[11px] text-slate-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>
                            {new Date(a.deadline).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </span>
                        <span>•</span>
                        <span className={hoursLeft < 24 ? 'text-rose-600 font-semibold' : 'text-slate-600'}>
                          {hoursLeft < 24 ? `${hoursLeft.toFixed(1)}h remaining` : `${Math.round(hoursLeft / 24)} days left`}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      {risk && (
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            risk.level === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-700'
                              : risk.level === 'HIGH'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {risk.level} ({risk.score})
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Live Audit Event Feed</h3>
            <button onClick={() => setActiveTab('audit')} className="text-xs text-indigo-600 hover:underline font-medium">
              Audit Log
            </button>
          </div>
          <div className="space-y-3">
            {auditLogs.slice(0, 4).map(event => (
              <div key={event.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex items-start space-x-3 text-xs">
                <div
                  className={`p-1.5 rounded-md mt-0.5 ${
                    event.executionOutcome === 'VERIFIED'
                      ? 'bg-emerald-100 text-emerald-700'
                      : event.executionOutcome === 'FAILED'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 text-[11px] font-mono">{event.eventType}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{event.description}</p>
                  <div className="mt-1 flex items-center space-x-2 text-[10px] text-slate-400">
                    <span>Actor: {event.actor}</span>
                    {event.courseCode && <span>• Course: {event.courseCode}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};