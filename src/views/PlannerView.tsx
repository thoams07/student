import React from 'react';
import { StudyBlock } from '../types/lms';

interface PlannerViewProps {
  studyPlan: StudyBlock[];
  availableDailyHours: number;
  setAvailableDailyHours: (val: number) => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  studyPlan,
  availableDailyHours,
  setAvailableDailyHours
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">Smart Study Recovery Planner</h2>
          <p className="text-xs text-slate-500">Autonomous schedule respecting daily study budget and risk priorities</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-600">Daily Study Budget:</span>
          <input
            type="number"
            min="1"
            max="12"
            value={availableDailyHours}
            onChange={e => setAvailableDailyHours(Math.max(1, Number(e.target.value)))}
            className="w-16 px-2 py-1 text-xs border border-slate-300 rounded bg-white text-center font-bold"
          />
          <span className="text-xs text-slate-600">hours</span>
        </div>
      </div>

      <div className="space-y-3">
        {studyPlan.map((block, idx) => (
          <div
            key={block.id}
            className={`p-4 rounded-xl border bg-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
              block.exceedsDailyBudget
                ? 'border-amber-300 bg-amber-50/20'
                : block.isOverdueRisk
                ? 'border-rose-300 bg-rose-50/30'
                : 'border-slate-200'
            }`}
          >
            <div className="flex items-start space-x-3.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                #{idx + 1}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {block.courseCode}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{block.title}</h4>
                </div>
                <p className="text-xs text-slate-500 mt-1">{block.reason}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 self-end md:self-auto">
              <div className="text-right">
                <div className="text-xs font-bold text-slate-800">
                  {block.startTime} — {block.endTime}
                </div>
                <div className="text-[11px] text-slate-500">{block.durationMinutes} minutes dedicated</div>
              </div>
              <span
                className={`px-2.5 py-1 text-xs rounded-lg font-semibold border ${
                  block.exceedsDailyBudget
                    ? 'bg-amber-100 text-amber-800 border-amber-200'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                }`}
              >
                {block.exceedsDailyBudget ? 'Budget Exceeded' : 'Assigned Slot'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};