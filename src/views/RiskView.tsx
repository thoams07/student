import React from 'react';
import { Course, Assignment, RiskAssessment } from '../types/lms';

interface RiskViewProps {
  assignments: Assignment[];
  courses: Course[];
  riskMap: Map<string, RiskAssessment>;
}

export const RiskView: React.FC<RiskViewProps> = ({ assignments, courses, riskMap }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div>
        <h2 className="text-base font-bold text-slate-900">AI Deadline Risk Predictor</h2>
        <p className="text-xs text-slate-500">
          Transparent, deterministic scoring model calculating completion risk and time velocity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assignments
          .filter(a => a.status !== 'SUBMITTED')
          .sort((a, b) => (riskMap.get(b.id)?.score || 0) - (riskMap.get(a.id)?.score || 0))
          .map(a => {
            const risk = riskMap.get(a.id);
            if (!risk) return null;
            const course = courses.find(c => c.id === a.courseId);

            return (
              <div key={a.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {course?.code}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        risk.level === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-700'
                          : risk.level === 'HIGH'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {risk.level} RISK ({risk.score}/100)
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-1">{a.title}</h3>
                  <div className="text-xs text-slate-500 mt-1">
                    Due:{' '}
                    {new Date(a.deadline).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>

                  <div className="mt-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Explainable Factor Breakdown
                    </h4>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {risk.factors.map((f, i) => (
                        <li key={i} className="flex items-start space-x-1.5">
                          <span className="text-indigo-500 mt-0.5">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="text-xs">
                    <span className="font-semibold text-slate-800">Action: </span>
                    <span className="text-indigo-700 font-medium">{risk.recommendedAction}</span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500 bg-indigo-50/50 p-2 rounded">
                    <span className="font-semibold text-indigo-900">Schedule: </span>
                    {risk.suggestedSchedule}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};