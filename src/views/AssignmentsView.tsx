import React from 'react';
import { Search, ExternalLink } from 'lucide-react';
import { Course, Assignment, RiskAssessment } from '../types/lms';

interface AssignmentsViewProps {
  assignments: Assignment[];
  courses: Course[];
  riskMap: Map<string, RiskAssessment>;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filterCourse: string;
  setFilterCourse: (val: string) => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  assignments,
  courses,
  riskMap,
  searchQuery,
  setSearchQuery,
  filterCourse,
  setFilterCourse
}) => {
  const filtered = assignments.filter(a => {
    const matchesCourse = filterCourse === 'ALL' || a.courseId === filterCourse;
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search assignments or topics..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-indigo-500"
            />
          </div>
          <select
            value={filterCourse}
            onChange={e => setFilterCourse(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg text-xs px-3 py-1.5 text-slate-700"
          >
            <option value="ALL">All Courses</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.code}
              </option>
            ))}
          </select>
        </div>
        <div className="text-xs text-slate-500">
          Showing {filtered.length} of {assignments.length} items
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Assignment / Composite Key</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4">Workload</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Moodle Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(asg => {
                const course = courses.find(c => c.id === asg.courseId);
                const risk = riskMap.get(asg.id);

                return (
                  <tr key={asg.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {course?.code}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{asg.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {asg.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">
                        {new Date(asg.deadline).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      {asg.previousDeadline && (
                        <div className="text-[10px] text-amber-600 line-through">
                          Prior: {new Date(asg.previousDeadline).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">
                        {(asg.estimatedHours - asg.completedHours).toFixed(1)}h remaining
                      </div>
                      <div className="text-[10px] text-slate-400">Total: {asg.estimatedHours}h</div>
                    </td>
                    <td className="py-3 px-4">
                      {risk && (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            risk.level === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-700'
                              : risk.level === 'HIGH'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {risk.level} ({risk.score})
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          asg.status === 'SUBMITTED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : asg.status === 'OVERDUE'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {asg.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <a
                        href={asg.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 font-medium text-[11px]"
                      >
                        <span>Moodle</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};