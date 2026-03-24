import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sun, Sunset, Moon } from 'lucide-react';
import { STAFF_MEMBERS } from '../../data/staffMockData';
import type { ShiftType } from '../../data/staffMockData';

interface Props { lang: 'ja' | 'en' }

const shiftInfo: Record<ShiftType, { label: string; labelJa: string; time: string; color: string; bg: string; icon: React.ReactNode }> = {
  morning: { label: 'Morning', labelJa: 'モーニング', time: '07:00-15:00', color: 'text-yellow-700', bg: 'bg-yellow-100', icon: <Sun className="w-3 h-3" /> },
  afternoon: { label: 'Afternoon', labelJa: 'アフタヌーン', time: '15:00-23:00', color: 'text-orange-700', bg: 'bg-orange-100', icon: <Sunset className="w-3 h-3" /> },
  night: { label: 'Night', labelJa: 'ナイト', time: '23:00-07:00', color: 'text-indigo-700', bg: 'bg-indigo-100', icon: <Moon className="w-3 h-3" /> },
};

// Generate weekly schedule mock
const generateWeekSchedule = () => {
  const schedule: Record<string, Record<string, ShiftType | 'off'>> = {};
  STAFF_MEMBERS.forEach(s => {
    schedule[s.id] = {};
    for (let d = 0; d < 7; d++) {
      if (s.status === 'off') {
        schedule[s.id][d] = 'off';
      } else if (s.status === 'leave' && d >= 2 && d <= 4) {
        schedule[s.id][d] = 'off';
      } else if (d === 0 || d === 6) {
        schedule[s.id][d] = Math.random() > 0.5 ? s.shift : 'off';
      } else {
        schedule[s.id][d] = s.shift;
      }
    }
  });
  return schedule;
};

const StaffSchedulePage: React.FC<Props> = ({ lang }) => {
  const isJa = lang === 'ja';
  const [weekOffset, setWeekOffset] = useState(0);
  const [schedule] = useState(generateWeekSchedule);

  const getWeekDates = (offset: number) => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1 + offset * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  };

  const weekDates = getWeekDates(weekOffset);
  const dayNames = isJa
    ? ['月', '火', '水', '木', '金', '土', '日']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const today = new Date();
  const isToday = (d: Date) => d.toDateString() === today.toDateString();

  const roleLabel: Record<string, { ja: string; en: string }> = {
    manager: { ja: 'マネージャー', en: 'Manager' },
    receptionist: { ja: 'フロント係', en: 'Receptionist' },
    housekeeping: { ja: 'ハウスキーピング', en: 'Housekeeping' },
    concierge: { ja: 'コンシェルジュ', en: 'Concierge' },
  };

  const shiftCounts = weekDates.map((_, dayIdx) => {
    const shifts = STAFF_MEMBERS.reduce((acc, s) => {
      const sh = schedule[s.id]?.[dayIdx];
      if (sh && sh !== 'off') acc[sh] = (acc[sh] || 0) + 1;
      return acc;
    }, {} as Record<ShiftType, number>);
    return shifts;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{isJa ? 'シフト管理' : 'Staff Schedule'}</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {weekDates[0].toLocaleDateString(isJa ? 'ja-JP' : 'en-US')} — {weekDates[6].toLocaleDateString(isJa ? 'ja-JP' : 'en-US')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekOffset(p => p - 1)} className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button onClick={() => setWeekOffset(0)} className="px-4 py-2 text-xs font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
            {isJa ? '今週' : 'This Week'}
          </button>
          <button onClick={() => setWeekOffset(p => p + 1)} className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Shift Legend */}
      <div className="flex flex-wrap gap-3">
        {(Object.entries(shiftInfo) as [ShiftType, typeof shiftInfo[ShiftType]][]).map(([key, info]) => (
          <div key={key} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${info.bg}`}>
            <span className={info.color}>{info.icon}</span>
            <span className={`text-xs font-semibold ${info.color}`}>{isJa ? info.labelJa : info.label}</span>
            <span className={`text-xs ${info.color} opacity-70`}>{info.time}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100">
          <span className="text-xs font-semibold text-gray-500">{isJa ? '休み' : 'Off'}</span>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 w-44">{isJa ? 'スタッフ' : 'Staff'}</th>
                {weekDates.map((d, i) => (
                  <th key={i} className={`py-3 px-2 text-center text-xs font-semibold ${isToday(d) ? 'text-blue-600' : 'text-gray-500'}`}>
                    <div>{dayNames[i]}</div>
                    <div className={`text-base font-bold mt-0.5 ${isToday(d) ? 'w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto' : ''}`}>
                      {d.getDate()}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {STAFF_MEMBERS.map(staff => (
                <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-700 text-xs font-bold flex-shrink-0">
                        {staff.avatar}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-xs">{isJa ? staff.nameJa : staff.name}</div>
                        <div className="text-xs text-gray-400">{isJa ? roleLabel[staff.role].ja : roleLabel[staff.role].en}</div>
                      </div>
                    </div>
                  </td>
                  {Array.from({ length: 7 }, (_, dayIdx) => {
                    const shift = schedule[staff.id]?.[dayIdx];
                    const isOff = !shift || shift === 'off';
                    const info = !isOff ? shiftInfo[shift as ShiftType] : null;
                    return (
                      <td key={dayIdx} className={`py-2 px-1 text-center ${isToday(weekDates[dayIdx]) ? 'bg-blue-50/30' : ''}`}>
                        {isOff ? (
                          <span className="text-xs text-gray-300 font-medium">—</span>
                        ) : (
                          <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-medium ${info!.bg} ${info!.color}`}>
                            {info!.icon}
                            <span className="hidden sm:inline">{isJa ? info!.labelJa : info!.label}</span>
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
            {/* Daily summary */}
            <tfoot className="bg-gray-50 border-t border-gray-200">
              <tr>
                <td className="py-2 px-4 text-xs font-semibold text-gray-500">{isJa ? '合計人数' : 'Total Staff'}</td>
                {shiftCounts.map((counts, i) => {
                  const total = Object.values(counts).reduce((s, c) => s + c, 0);
                  return (
                    <td key={i} className="py-2 px-1 text-center">
                      <span className={`text-xs font-bold ${total === 0 ? 'text-red-500' : total < 2 ? 'text-orange-500' : 'text-green-600'}`}>
                        {total}
                      </span>
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Staff Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STAFF_MEMBERS.map(staff => (
          <div key={staff.id} className="card p-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center text-slate-700 text-xs font-bold flex-shrink-0">
              {staff.avatar}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-gray-900 truncate">{isJa ? staff.nameJa : staff.name}</div>
              <div className={`text-xs mt-0.5 ${staff.status === 'active' ? 'text-green-600' : 'text-gray-400'}`}>
                {staff.status === 'active'
                  ? (isJa ? '勤務中' : 'Active')
                  : staff.status === 'off'
                  ? (isJa ? '休日' : 'Day Off')
                  : (isJa ? '休暇中' : 'On Leave')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffSchedulePage;
