import React from 'react';

const STAFF_MEMBERS = [
  { name: 'Elena Rostova', role: 'General Manager', department: 'Executive', shift: '08:00 - 18:00', status: 'On Duty' },
  { name: 'Marcus Vance', role: 'Front Desk Lead', department: 'Front Office', shift: '07:00 - 15:30', status: 'On Duty' },
  { name: 'Aaliyah Patel', role: 'Head of Housekeeping', department: 'Housekeeping', shift: '06:30 - 15:00', status: 'On Duty' },
  { name: 'Chef Jean-Pierre Laurent', role: 'Executive Chef', department: 'Food & Beverage', shift: '10:00 - 22:00', status: 'On Duty' },
  { name: 'Daisuke Takahashi', role: 'Chief Concierge (Les Clefs d\'Or)', department: 'Concierge', shift: '09:00 - 17:30', status: 'On Break' },
];

export const StaffPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-12 font-sans text-zinc-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-900 border border-indigo-100">
              Staff Operations & Shift Roster
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight mt-1">Staff Roster & Department Shifts</h1>
        </div>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-700">
            <thead className="bg-zinc-50 text-zinc-400 border-b border-zinc-200 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Role / Title</th>
                <th className="py-3.5 px-4">Active Shift</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {STAFF_MEMBERS.map((s, i) => (
                <tr key={i} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-zinc-900">{s.name}</td>
                  <td className="py-3.5 px-4 text-zinc-500 font-medium">{s.department}</td>
                  <td className="py-3.5 px-4 text-indigo-600 font-bold">{s.role}</td>
                  <td className="py-3.5 px-4 font-mono text-zinc-600 font-medium">{s.shift}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
