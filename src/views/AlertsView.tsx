import React from 'react';
import { Bell } from 'lucide-react';
import { Assignment } from '../types/lms';

interface AlertsViewProps {
  assignments: Assignment[];
}

export const AlertsView: React.FC<AlertsViewProps> = ({ assignments }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div>
        <h2 className="text-base font-bold text-slate-900">Critical Alerts & Timers</h2>
        <p className="text-xs text-slate-500">Autonomous notifications dispatched based on proximity and risk thresholds</p>
      </div>

      <div className="space-y-3">
        {assignments
          .filter(a => a.status === 'PENDING')
          .map(a => {
            const hoursLeft = (new Date(a.deadline).getTime() - Date.now()) / (1000 * 3600);
            const isUrgent = hoursLeft <= 24;

            return (
              <div
                key={a.id}
                className={`p-4 rounded-xl border bg-white shadow-sm flex items-center justify-between ${
                  isUrgent ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${isUrgent ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{a.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Due: {new Date(a.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                      {new Date(a.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold ${isUrgent ? 'text-rose-600' : 'text-slate-600'}`}>
                    {hoursLeft < 0 ? 'Overdue' : `${hoursLeft.toFixed(1)}h remaining`}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};