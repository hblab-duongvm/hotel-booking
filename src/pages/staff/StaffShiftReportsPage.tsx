import React, { useState } from 'react';
import { Plus, X, CheckCircle, AlertCircle, Sun, Sunset, Moon } from 'lucide-react';
import { SHIFT_REPORTS } from '../../data/staffMockData';
import type { ShiftReport, ShiftType } from '../../data/staffMockData';

interface Props { lang: 'ja' | 'en' }

const shiftLabel: Record<ShiftType, { ja: string; en: string; icon: React.ReactNode; color: string }> = {
  morning: { ja: 'モーニング', en: 'Morning', icon: <Sun className="w-4 h-4" />, color: 'text-yellow-600' },
  afternoon: { ja: 'アフタヌーン', en: 'Afternoon', icon: <Sunset className="w-4 h-4" />, color: 'text-orange-600' },
  night: { ja: 'ナイト', en: 'Night', icon: <Moon className="w-4 h-4" />, color: 'text-indigo-600' },
};

const StaffShiftReportsPage: React.FC<Props> = ({ lang }) => {
  const isJa = lang === 'ja';
  const [reports, setReports] = useState<ShiftReport[]>(SHIFT_REPORTS);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<ShiftReport | null>(null);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    shift: 'morning' as ShiftType,
    checkInsCount: 0,
    checkOutsCount: 0,
    newBookings: 0,
    issuesReported: 0,
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const report: ShiftReport = {
      id: `sr${Date.now()}`,
      ...form,
      staffId: 's002',
      staffName: 'Sato Kenji',
      staffNameJa: '佐藤 健二',
      submittedAt: new Date().toLocaleString('ja-JP'),
    };
    setReports(prev => [report, ...prev]);
    setShowForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-5">
      {submitted && (
        <div className="fixed top-20 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> {isJa ? '勤務報告を提出しました' : 'Shift report submitted successfully'}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{isJa ? '勤務報告' : 'Shift Reports'}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{isJa ? `全${reports.length}件` : `${reports.length} reports`}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          {isJa ? '報告を提出' : 'Submit Report'}
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: isJa ? '総チェックイン' : 'Total Check-ins', value: reports.reduce((s, r) => s + r.checkInsCount, 0), color: 'text-blue-600' },
          { label: isJa ? '総チェックアウト' : 'Total Check-outs', value: reports.reduce((s, r) => s + r.checkOutsCount, 0), color: 'text-orange-600' },
          { label: isJa ? '新規予約' : 'New Bookings', value: reports.reduce((s, r) => s + r.newBookings, 0), color: 'text-green-600' },
          { label: isJa ? '報告された問題' : 'Issues Reported', value: reports.reduce((s, r) => s + r.issuesReported, 0), color: 'text-red-600' },
        ].map((s, i) => (
          <div key={i} className="card p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {reports.map(report => {
          const sh = shiftLabel[report.shift];
          return (
            <div
              key={report.id}
              onClick={() => setSelected(report)}
              className="card p-5 cursor-pointer hover:shadow-md transition-all border border-transparent hover:border-blue-100"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-4">
                  <div className={`flex items-center gap-1.5 ${sh.color}`}>
                    {sh.icon}
                    <span className="text-sm font-semibold">{isJa ? sh.ja : sh.en}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{report.date}</span>
                      <span className="text-xs text-gray-400">{isJa ? `提出: ${report.submittedAt}` : `Submitted: ${report.submittedAt}`}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5">{isJa ? report.staffNameJa : report.staffName}</div>
                    {report.notes && (
                      <div className="text-xs text-gray-400 mt-1 italic line-clamp-1">{report.notes}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-blue-600">{report.checkInsCount}</div>
                    <div className="text-xs text-gray-400">{isJa ? 'CI' : 'CI'}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-orange-600">{report.checkOutsCount}</div>
                    <div className="text-xs text-gray-400">{isJa ? 'CO' : 'CO'}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-green-600">{report.newBookings}</div>
                    <div className="text-xs text-gray-400">{isJa ? '予約' : 'BK'}</div>
                  </div>
                  {report.issuesReported > 0 && (
                    <div className="flex items-center gap-1 text-red-500">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-xs font-semibold">{report.issuesReported}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">{isJa ? '勤務報告詳細' : 'Shift Report Detail'}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900">{selected.date}</div>
                  <div className={`flex items-center gap-1.5 mt-1 ${shiftLabel[selected.shift].color}`}>
                    {shiftLabel[selected.shift].icon}
                    <span className="text-sm font-semibold">{isJa ? shiftLabel[selected.shift].ja : shiftLabel[selected.shift].en}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{isJa ? selected.staffNameJa : selected.staffName}</div>
                  <div className="text-xs text-gray-400">{selected.submittedAt}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: isJa ? 'チェックイン件数' : 'Check-ins', value: selected.checkInsCount, color: 'bg-blue-50 text-blue-700' },
                  { label: isJa ? 'チェックアウト件数' : 'Check-outs', value: selected.checkOutsCount, color: 'bg-orange-50 text-orange-700' },
                  { label: isJa ? '新規予約数' : 'New Bookings', value: selected.newBookings, color: 'bg-green-50 text-green-700' },
                  { label: isJa ? '問題報告数' : 'Issues', value: selected.issuesReported, color: selected.issuesReported > 0 ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-600' },
                ].map((item, i) => (
                  <div key={i} className={`${item.color} rounded-xl p-3 text-center`}>
                    <div className="text-2xl font-bold">{item.value}</div>
                    <div className="text-xs mt-0.5">{item.label}</div>
                  </div>
                ))}
              </div>
              {selected.notes && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs font-semibold text-gray-500 mb-2">{isJa ? '備考・特記事項' : 'Notes'}</div>
                  <div className="text-sm text-gray-700 leading-relaxed">{selected.notes}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Submit Report Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">{isJa ? '勤務報告を提出' : 'Submit Shift Report'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">{isJa ? '日付' : 'Date'}</label>
                  <input type="date" className="input-field" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">{isJa ? 'シフト' : 'Shift'}</label>
                  <select className="input-field" value={form.shift} onChange={e => setForm(p => ({ ...p, shift: e.target.value as ShiftType }))}>
                    <option value="morning">{isJa ? 'モーニング' : 'Morning'}</option>
                    <option value="afternoon">{isJa ? 'アフタヌーン' : 'Afternoon'}</option>
                    <option value="night">{isJa ? 'ナイト' : 'Night'}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">{isJa ? 'チェックイン件数' : 'Check-ins'}</label>
                  <input type="number" min={0} className="input-field" value={form.checkInsCount} onChange={e => setForm(p => ({ ...p, checkInsCount: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">{isJa ? 'チェックアウト件数' : 'Check-outs'}</label>
                  <input type="number" min={0} className="input-field" value={form.checkOutsCount} onChange={e => setForm(p => ({ ...p, checkOutsCount: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">{isJa ? '新規予約数' : 'New Bookings'}</label>
                  <input type="number" min={0} className="input-field" value={form.newBookings} onChange={e => setForm(p => ({ ...p, newBookings: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">{isJa ? '問題報告数' : 'Issues Reported'}</label>
                  <input type="number" min={0} className="input-field" value={form.issuesReported} onChange={e => setForm(p => ({ ...p, issuesReported: Number(e.target.value) }))} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">{isJa ? '備考・特記事項' : 'Notes'}</label>
                <textarea
                  className="input-field resize-none"
                  rows={3}
                  value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  placeholder={isJa ? '特記事項、問題の詳細など...' : 'Special notes, issue details...'}
                />
              </div>
              <div className="flex gap-3">
                <button onClick={handleSubmit} className="flex-1 btn-primary text-sm">{isJa ? '報告を提出' : 'Submit Report'}</button>
                <button onClick={() => setShowForm(false)} className="flex-1 btn-secondary text-sm">{isJa ? 'キャンセル' : 'Cancel'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffShiftReportsPage;
