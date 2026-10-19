import React from 'react';
import { CheckCheck, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { ApprovalRequest } from '../types/lms';

interface ApprovalsViewProps {
  approvals: ApprovalRequest[];
  handleApprove: (req: ApprovalRequest) => void;
  handleReject: (req: ApprovalRequest) => void;
}

export const ApprovalsView: React.FC<ApprovalsViewProps> = ({
  approvals,
  handleApprove,
  handleReject
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div>
        <h2 className="text-base font-bold text-slate-900">Human Approval Governance</h2>
        <p className="text-xs text-slate-500">
          Autonomous changes to calendars, reminders, or downloads require explicit user sign-off
        </p>
      </div>

      <div className="space-y-3">
        {approvals.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
            <CheckCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No actions currently pending approval.</p>
          </div>
        ) : (
          approvals.map(req => (
            <div
              key={req.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {req.courseCode}
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-600">
                    {req.actionType}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      req.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800'
                        : req.status === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : req.status === 'REJECTED'
                        ? 'bg-rose-100 text-rose-800'
                        : req.status === 'EXECUTING'
                        ? 'bg-blue-100 text-blue-800 animate-pulse'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{req.title}</h4>
                <p className="text-xs text-slate-700 font-medium">
                  <span className="text-slate-500">Proposed: </span>
                  {req.proposedChange}
                </p>
                <p className="text-xs text-slate-500">
                  <span className="font-medium text-slate-600">Reason: </span>
                  {req.reason}
                </p>

                <div className="flex items-center space-x-1 text-[10px] text-slate-400 mt-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    Requested:{' '}
                    {new Date(req.requestedAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              {/* Action Buttons based on status */}
              {req.status === 'PENDING' && (
                <div className="flex items-center space-x-2 self-end md:self-auto">
                  <button
                    onClick={() => handleReject(req)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(req)}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold shadow-sm transition-colors"
                  >
                    Approve & Execute
                  </button>
                </div>
              )}

              {req.status === 'EXECUTING' && (
                <div className="flex items-center space-x-1.5 text-xs text-indigo-600 font-semibold self-end md:self-auto">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping mr-1" />
                  <span>Executing Pipeline...</span>
                </div>
              )}

              {req.status === 'VERIFIED' && (
                <div className="flex items-center space-x-1.5 text-xs text-emerald-600 font-semibold self-end md:self-auto">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Executed & Verified</span>
                </div>
              )}

              {req.status === 'REJECTED' && (
                <div className="flex items-center space-x-1.5 text-xs text-rose-600 font-semibold self-end md:self-auto">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Action Halted</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};