import React from 'react';
import { Course, Assignment } from '../types/lms';

interface CoursesViewProps {
  courses: Course[];
  assignments: Assignment[];
}

export const CoursesView: React.FC<CoursesViewProps> = ({ courses, assignments }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Enrolled Moodle Courses</h2>
          <p className="text-xs text-slate-500">Synchronized via Moodle Web Services API</p>
        </div>
        <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-medium">
          {courses.length} Active Enrollments
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map(course => {
          const courseAsgs = assignments.filter(a => a.courseId === course.id);
          const pendingHours = courseAsgs
            .filter(a => a.status === 'PENDING')
            .reduce((acc, curr) => acc + (curr.estimatedHours - curr.completedHours), 0);

          return (
            <div key={course.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                    {course.code}
                  </span>
                  <span className="text-xs text-slate-400">{course.semester}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{course.name}</h3>
                <p className="text-xs text-slate-500">Instructor: {course.instructor}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg">
                  <span className="text-slate-500 text-[11px] block">Assignments</span>
                  <span className="font-bold text-slate-800 text-sm">{courseAsgs.length} Total</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg">
                  <span className="text-slate-500 text-[11px] block">Pending Work</span>
                  <span className="font-bold text-indigo-600 text-sm">{pendingHours.toFixed(1)} hrs</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};