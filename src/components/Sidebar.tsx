import React from 'react';
import {
  Shield,
  X,
  RotateCcw,
  BarChart3,
  BookOpen,
  CheckSquare,
  AlertTriangle,
  Calendar,
  Layers,
  CheckCheck,
  Download,
  Bell,
  Sparkles,
  FileCheck,
  History,
  Terminal,
  Settings
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isSyncing: boolean;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  lastSyncTime: string;
  handleResetDemo: () => void;
  pendingAssignmentsCount: number;
  highRiskCount: number;
  collisionCount: number;
  pendingApprovalsCount: number;
  failedVerificationsCount: number;
  due24hCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
  isSyncing,
  isDemoMode,
  setIsDemoMode,
  lastSyncTime,
  handleResetDemo,
  pendingAssignmentsCount,
  highRiskCount,
  collisionCount,
  pendingApprovalsCount,
  failedVerificationsCount,
  due24hCount
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'assignments', label: 'Assignments', icon: CheckSquare, badge: pendingAssignmentsCount },
    { id: 'risk', label: 'Deadline Risk', icon: AlertTriangle, badge: highRiskCount, badgeColor: 'bg-rose-100 text-rose-700' },
    { id: 'planner', label: 'Smart Study Planner', icon: Calendar },
    { id: 'conflicts', label: 'Workload Conflicts', icon: Layers, badge: collisionCount > 0 ? collisionCount : undefined },
    { id: 'approvals', label: 'Human Approvals', icon: CheckCheck, badge: pendingApprovalsCount, badgeColor: 'bg-indigo-100 text-indigo-700 font-bold' },
    { id: 'materials', label: 'Materials & Downloads', icon: Download },
    { id: 'alerts', label: 'Critical Alerts', icon: Bell, badge: due24hCount > 0 ? `${due24hCount} urgent` : undefined, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'chat', label: 'Ask My LMS AI', icon: Sparkles },
    { id: 'verification', label: 'TrustGuard Verifier', icon: FileCheck, badge: failedVerificationsCount > 0 ? `${failedVerificationsCount} fail` : undefined, badgeColor: 'bg-rose-100 text-rose-700' },
    { id: 'audit', label: 'Audit History', icon: History },
    { id: 'settings', label: 'Settings & Moodle', icon: Settings }
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900 leading-none">LMS Sentinel</h1>
            <p className="text-[10px] text-indigo-600 font-medium tracking-wide mt-1 uppercase">Predict, Prevent & Verify</p>
          </div>
        </div>
        <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-slate-600 p-1">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-400 animate-ping' : 'bg-emerald-500'}`} />
          <span className="text-slate-600 font-medium text-[11px] truncate max-w-[120px]">
            {isSyncing ? 'Syncing...' : isDemoMode ? 'Demo Adapter' : 'Moodle API'}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">{lastSyncTime}</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-all ${
                active ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="text-xs">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${item.badgeColor || 'bg-slate-200 text-slate-700'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-100 bg-slate-50 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-medium text-slate-600">Simulated Adapter</span>
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
              isDemoMode ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {isDemoMode ? 'DEMO ACTIVE' : 'LIVE API'}
          </button>
        </div>
        <button
          onClick={handleResetDemo}
          className="w-full text-center py-1 text-[11px] text-slate-500 hover:text-indigo-600 font-medium flex items-center justify-center space-x-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Demo Records</span>
        </button>
      </div>
    </aside>
  );
};
