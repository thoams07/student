import React from 'react';

interface SettingsViewProps {
  moodleHost: string;
  setMoodleHost: (val: string) => void;
  moodleToken: string;
  setMoodleToken: (val: string) => void;
  pollingIntervalSec: number;
  setPollingIntervalSec: (val: number) => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  onSave: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  moodleHost,
  setMoodleHost,
  moodleToken,
  setMoodleToken,
  pollingIntervalSec,
  setPollingIntervalSec,
  isDemoMode,
  setIsDemoMode,
  onSave
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h2 className="text-base font-bold text-slate-900">Integration & System Settings</h2>
        <p className="text-xs text-slate-500">Configure Moodle Web Services API credentials, background polling, and security guards</p>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Moodle Web Services REST Configuration</h3>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Moodle Instance Base URL</label>
            <input
              type="text"
              value={moodleHost}
              onChange={e => setMoodleHost(e.target.value)}
              placeholder="https://moodle.your-institution.edu"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-indigo-600 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Web Services REST Token (wstoken)</label>
            <input
              type="password"
              value={moodleToken}
              onChange={e => setMoodleToken(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-indigo-600 font-mono"
            />
            <p className="text-[10px] text-slate-400 mt-1">Never shared or transmitted to unauthorized clients. Used exclusively by backend adapter.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Background Sync Polling (Seconds)</label>
              <input
                type="number"
                min="10"
                max="300"
                value={pollingIntervalSec}
                onChange={e => setPollingIntervalSec(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Operation Mode</label>
              <select
                value={isDemoMode ? 'DEMO' : 'LIVE'}
                onChange={e => setIsDemoMode(e.target.value === 'DEMO')}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 font-semibold"
              >
                <option value="DEMO">Demo Adapter (Simulated Datasets)</option>
                <option value="LIVE">Live Moodle REST API</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end space-x-2">
          <button
            onClick={onSave}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Moodle Web Services Setup Instructions</h3>
        <div className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
          <p>1. In Moodle as Admin, navigate to <strong>Site Administration → Server → Web Services</strong>.</p>
          <p>2. Enable <strong>REST Protocol</strong> under External Services.</p>
          <p>
            3. Create a service with capabilities:{' '}
            <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono">core_course_get_courses</code>,{' '}
            <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono">mod_assign_get_assignments</code>, and{' '}
            <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono">core_calendar_get_action_events_by_timesort</code>.
          </p>
          <p>4. Generate an authorized Web Services Token for your user role.</p>
        </div>
      </div>
    </div>
  );
};