import React from 'react';
import { FileText } from 'lucide-react';
import { MaterialFile } from '../types/lms';

interface MaterialsViewProps {
  materials: MaterialFile[];
  onRequestDownload: (material: MaterialFile) => void;
  onInspectEvidence: () => void;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  materials,
  onRequestDownload,
  onInspectEvidence
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div>
        <h2 className="text-base font-bold text-slate-900">Course Materials & TrustGuard Pipeline</h2>
        <p className="text-xs text-slate-500">Protected downloads with magic byte header inspection and SHA-256 hash validation</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Filename</th>
              <th className="py-3 px-4">Size</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Verification Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {materials.map(mat => (
              <tr key={mat.id}>
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-900 flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>{mat.fileName}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">{mat.sourceUrl}</div>
                </td>
                <td className="py-3 px-4 font-mono text-slate-600">{mat.fileSizeFormatted}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      mat.downloadStatus === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : mat.downloadStatus === 'CORRUPTED_OR_AUTH_FAILED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {mat.downloadStatus}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  {mat.downloadStatus === 'NOT_DOWNLOADED' ? (
                    <button
                      onClick={() => onRequestDownload(mat)}
                      className="px-2.5 py-1 bg-slate-900 text-white rounded text-xs hover:bg-slate-800 font-medium"
                    >
                      Request Download
                    </button>
                  ) : (
                    <button
                      onClick={onInspectEvidence}
                      className="text-xs text-indigo-600 hover:underline font-semibold"
                    >
                      Inspect Evidence
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};