import React from 'react';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Assignment } from '../types/lms';

interface ConflictItem {
  dateStr: string;
  items: Assignment[];
  totalHours: number;
}

interface ConflictsViewProps {
  collisions: ConflictItem[];
}

export const ConflictsView: React.FC<ConflictsViewProps> = ({ collisions }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div>
        <h2 className="text-base font-bold text-slate-900">Workload Collision Detector</h2>
        <p className="text-xs text-slate-500">
          Detects multiple assignments due on the same day or within narrow, overlapping completion windows
        </p>
      </div>

      {collisions.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No Hard Deadline Collisions Detected</h3>
          <p className="text-xs text-slate-500 mt-1">
            Deadlines are staggered cleanly across separate due dates with sufficient study buffers.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {collisions.map((collision, idx) => {
            const isHeavyLoad = collision.totalHours > 8;

            return (
              <div
                key={idx}
                className={`bg-white p-5 rounded-xl border shadow-sm ${
                  isHeavyLoad ? 'border-rose-200 bg-rose-50/10' : 'border-amber-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle
                      className={`w-5 h-5 ${isHeavyLoad ? 'text-rose-500' : 'text-amber-500'}`}
                    />
                    <h3 className="text-sm font-bold text-slate-900">
                      Collision Date:{' '}
                      {new Date(collision.dateStr).toLocaleDateString([], {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-bold w-fit ${
                      isHeavyLoad ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {collision.items.length} Deadlines Overlapping
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-4">
                  Combined estimated workload demands{' '}
                  <span className="font-bold text-slate-900">
                    {collision.totalHours.toFixed(1)} hours
                  </span>{' '}
                  of study time. {isHeavyLoad && 'Exceeds standard realistic daily capacity.'}
                </p>

                {/* Overlapping Assignment Breakdown Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {collision.items.map(item => {
                    const remainingHours = Math.max(0, item.estimatedHours - item.completedHours);

                    return (
                      <div
                        key={item.id}
                        className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                              {item.courseId}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              Total: {item.estimatedHours}h
                            </span>
                          </div>
                          <span className="font-semibold text-slate-900 block truncate">
                            {item.title}
                          </span>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>
                              {new Date(item.deadline).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </span>
                          <span className="font-semibold text-indigo-600">
                            {remainingHours.toFixed(1)}h remaining
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};