import React from 'react';
import { Layers, RefreshCw, Terminal } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setMobileMenuOpen: (open: boolean) => void;
  isSyncing: boolean;
  handleSyncMoodle: () => void;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setMobileMenuOpen,
  isSyncing,
  handleSyncMoodle,
  setActiveTab
}) => {
  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between z-10">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-1.5 rounded-lg border border-slate-200 text-slate-600"
        >
          <Layers className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-800 text-sm capitalize">
            {activeTab.replace('-', ' ')}
          </span>
          <span className="text-slate-300">/</span>
          <span className="text-xs text-slate-500 font-normal hidden sm:inline">
            Real-time Moodle Governance & Predictor
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={handleSyncMoodle}
          disabled={isSyncing}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm border transition-all ${
            isSyncing
              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
              : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Sync Moodle Now</span>
        </button>

        <button
          onClick={() => setActiveTab('testlab')}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800"
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Test Lab (TC1-4)</span>
        </button>
      </div>
    </header>
  );
};