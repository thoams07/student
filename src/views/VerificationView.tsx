import React from 'react';
import { VerificationRecord } from '../types/lms';

interface VerificationViewProps {
  verifications: VerificationRecord[];
}

export const VerificationView: React.FC<VerificationViewProps> = ({ verifications }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div>
        <h2 className="text-base font-bold text-slate-900">TrustGuard Independent Verification Center</h2>
        <p className="text-xs text-slate-500">
          Byte-level evidence verification: File magic byte header check (%PDF-), SHA-256 hash checks, and session-expired HTML rejection traps.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Filename / Target</th>
              <th className="py-3 px-4">Magic Bytes</th>
              <th className="py-3 px-4">SHA-256 Hash</th>
              <th className="py-3 px-4">HTTP Status</th>
              <th className="py-3 px-4">Size</th>
              <th className="py-3 px-4">Outcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {verifications.map(v => (
              <tr key={v.id} className={v.outcome === 'FAILED' ? 'bg-rose-50/30' : ''}>
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-900">{v.targetFilename}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate max-w-xs">{v.sourceUrl}</div>
                  {v.failureReason && (
                    <div className="text-[10px] text-rose-600 font-medium mt-1">
                      Fail reason: {v.failureReason}
                    </div>
                  )}
                </td>
                <td className="py-3 px-4 font-mono text-[11px]">
                  <span
                    className={`px-1.5 py-0.5 rounded ${
                      v.magicBytesHex === '25 50 44 46' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {v.magicBytesHex}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-[10px] text-slate-500 truncate max-w-[140px]">
                  {v.sha256Hash}
                </td>
                <td className="py-3 px-4 font-mono">{v.httpStatus}</td>
                <td className="py-3 px-4 text-slate-600">{(v.fileSizeBytes / 1024).toFixed(1)} KB</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      v.outcome === 'PASSED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {v.outcome}
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