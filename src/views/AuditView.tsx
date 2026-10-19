import React from 'react';
import { AuditEvent } from '../types/lms';

interface AuditViewProps {
  auditLogs: AuditEvent[];
}

export const AuditView: React.FC<AuditViewProps> = ({ auditLogs }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Immutable Audit Trail</h2>
          <p className="text-xs text-slate-500">Every detection, risk calculation, human approval, and execution event logged</p>
        </div>
        <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded font-mono">
          {auditLogs.length} Events Logged
        </span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Actor</th>
              <th className="py-3 px-4">Event Type</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Outcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {auditLogs.map(log => (
              <tr key={log.id}>
                <td className="py-3 px-4 font-mono text-slate-500 text-[10px] whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="py-3 px-4 font-mono text-slate-700">{log.actor}</td>
                <td className="py-3 px-4 font-mono font-bold text-slate-800 text-[11px]">{log.eventType}</td>
                <td className="py-3 px-4 text-slate-600 max-w-md">{log.description}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.executionOutcome === 'SUCCESS' || log.executionOutcome === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : log.executionOutcome === 'FAILED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {log.executionOutcome}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};