import React, { useState } from 'react';
import { CheckCircle, Clock, Plus, X, User } from 'lucide-react';
import { HOUSEKEEPING_TASKS, STAFF_MEMBERS, ROOMS } from '../../data/staffMockData';
import type { HousekeepingTask, TaskStatus } from '../../data/staffMockData';

interface Props { lang: 'ja' | 'en' }

const taskTypeLabel: Record<string, { ja: string; en: string }> = {
  checkout_clean: { ja: 'チェックアウト清掃', en: 'Checkout Clean' },
  daily_clean: { ja: '日常清掃', en: 'Daily Clean' },
  deep_clean: { ja: '深部清掃', en: 'Deep Clean' },
  turndown: { ja: 'ターンダウン', en: 'Turndown' },
};
const priorityColor: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-100 text-gray-600',
};

const StaffHousekeepingPage: React.FC<Props> = ({ lang }) => {
  const isJa = lang === 'ja';
  const [tasks, setTasks] = useState<HousekeepingTask[]>(HOUSEKEEPING_TASKS);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ roomId: 'r001', assignedTo: 's004', type: 'daily_clean', priority: 'medium', scheduledTime: '10:00', notes: '' });

  const filtered = tasks.filter(t => filterStatus === 'all' || t.status === filterStatus);

  const handleUpdateStatus = (id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? {
      ...t, status,
      completedTime: status === 'done' ? new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }) : t.completedTime
    } : t));
  };

  const handleAddTask = () => {
    const room = ROOMS.find(r => r.id === newTask.roomId)!;
    const staff = STAFF_MEMBERS.find(s => s.id === newTask.assignedTo)!;
    const task: HousekeepingTask = {
      id: `hk${Date.now()}`,
      roomId: room.id,
      roomName: room.name,
      roomNameJa: room.nameJa,
      floor: room.floor,
      assignedTo: staff.name,
      assignedToJa: staff.nameJa,
      type: newTask.type as HousekeepingTask['type'],
      status: 'pending',
      priority: newTask.priority as HousekeepingTask['priority'],
      scheduledTime: newTask.scheduledTime,
      notes: newTask.notes,
    };
    setTasks(prev => [task, ...prev]);
    setShowAddTask(false);
  };

  const stats = {
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{isJa ? 'ハウスキーピング' : 'Housekeeping'}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{isJa ? `本日のタスク: ${tasks.length}件` : `Today's tasks: ${tasks.length}`}</p>
        </div>
        <button onClick={() => setShowAddTask(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          {isJa ? 'タスク追加' : 'Add Task'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { key: 'pending', label: isJa ? '未着手' : 'Pending', count: stats.pending, color: 'text-gray-600', bg: 'bg-gray-50', icon: <Clock className="w-5 h-5 text-gray-400" /> },
          { key: 'in_progress', label: isJa ? '作業中' : 'In Progress', count: stats.in_progress, color: 'text-blue-700', bg: 'bg-blue-50', icon: <Clock className="w-5 h-5 text-blue-500" /> },
          { key: 'done', label: isJa ? '完了' : 'Done', count: stats.done, color: 'text-green-700', bg: 'bg-green-50', icon: <CheckCircle className="w-5 h-5 text-green-500" /> },
        ].map(s => (
          <button
            key={s.key}
            onClick={() => setFilterStatus(filterStatus === s.key as TaskStatus ? 'all' : s.key as TaskStatus)}
            className={`card p-4 text-left transition-all hover:shadow-md ${filterStatus === s.key ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="flex items-center gap-2 mb-2">{s.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{s.count}</div>
            <div className={`text-xs font-medium ${s.color}`}>{s.label}</div>
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="card py-12 text-center text-gray-400 text-sm">{isJa ? 'タスクが見つかりませんでした' : 'No tasks found'}</div>
        )}
        {filtered.map(task => (
          <div key={task.id} className={`card p-4 border-l-4 transition-all hover:shadow-md ${
            task.status === 'done' ? 'border-l-green-400 opacity-80' :
            task.status === 'in_progress' ? 'border-l-blue-400' :
            task.priority === 'high' ? 'border-l-red-400' : 'border-l-gray-300'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  task.status === 'done' ? 'bg-green-100' :
                  task.status === 'in_progress' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  {task.status === 'done'
                    ? <CheckCircle className="w-5 h-5 text-green-600" />
                    : task.status === 'in_progress'
                    ? <Clock className="w-5 h-5 text-blue-600" />
                    : <Clock className="w-5 h-5 text-gray-400" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm">{isJa ? task.roomNameJa : task.roomName}</span>
                    <span className="text-xs text-gray-400">{task.floor}F</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColor[task.priority]}`}>
                      {isJa
                        ? task.priority === 'high' ? '高優先度' : task.priority === 'medium' ? '中優先度' : '低優先度'
                        : task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {isJa ? task.assignedToJa : task.assignedTo}
                    </span>
                    <span>🕐 {task.scheduledTime}</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {isJa ? taskTypeLabel[task.type].ja : taskTypeLabel[task.type].en}
                    </span>
                  </div>
                  {task.notes && <div className="text-xs text-gray-400 mt-1 italic">{task.notes}</div>}
                  {task.completedTime && (
                    <div className="text-xs text-green-600 mt-1">✓ {isJa ? `${task.completedTime}に完了` : `Completed at ${task.completedTime}`}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {task.status === 'pending' && (
                  <button
                    onClick={() => handleUpdateStatus(task.id, 'in_progress')}
                    className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {isJa ? '開始' : 'Start'}
                  </button>
                )}
                {task.status === 'in_progress' && (
                  <button
                    onClick={() => handleUpdateStatus(task.id, 'done')}
                    className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    {isJa ? '完了' : 'Complete'}
                  </button>
                )}
                {task.status === 'done' && (
                  <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />{isJa ? '完了済み' : 'Completed'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddTask(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">{isJa ? 'タスク追加' : 'Add Housekeeping Task'}</h3>
              <button onClick={() => setShowAddTask(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">{isJa ? '客室' : 'Room'}</label>
                <select className="input-field" value={newTask.roomId} onChange={e => setNewTask(p => ({ ...p, roomId: e.target.value }))}>
                  {ROOMS.map(r => <option key={r.id} value={r.id}>{isJa ? r.nameJa : r.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">{isJa ? '担当スタッフ' : 'Assigned Staff'}</label>
                <select className="input-field" value={newTask.assignedTo} onChange={e => setNewTask(p => ({ ...p, assignedTo: e.target.value }))}>
                  {STAFF_MEMBERS.filter(s => s.role === 'housekeeping').map(s => (
                    <option key={s.id} value={s.id}>{isJa ? s.nameJa : s.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">{isJa ? 'タスクタイプ' : 'Task Type'}</label>
                  <select className="input-field" value={newTask.type} onChange={e => setNewTask(p => ({ ...p, type: e.target.value }))}>
                    {Object.entries(taskTypeLabel).map(([k, v]) => (
                      <option key={k} value={k}>{isJa ? v.ja : v.en}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">{isJa ? '優先度' : 'Priority'}</label>
                  <select className="input-field" value={newTask.priority} onChange={e => setNewTask(p => ({ ...p, priority: e.target.value }))}>
                    <option value="high">{isJa ? '高' : 'High'}</option>
                    <option value="medium">{isJa ? '中' : 'Medium'}</option>
                    <option value="low">{isJa ? '低' : 'Low'}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">{isJa ? '予定時刻' : 'Scheduled Time'}</label>
                <input type="time" className="input-field" value={newTask.scheduledTime} onChange={e => setNewTask(p => ({ ...p, scheduledTime: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">{isJa ? 'メモ' : 'Notes'}</label>
                <textarea className="input-field resize-none" rows={2} value={newTask.notes} onChange={e => setNewTask(p => ({ ...p, notes: e.target.value }))} placeholder={isJa ? '特記事項...' : 'Special notes...'} />
              </div>
              <div className="flex gap-3">
                <button onClick={handleAddTask} className="flex-1 btn-primary text-sm">{isJa ? 'タスクを追加' : 'Add Task'}</button>
                <button onClick={() => setShowAddTask(false)} className="flex-1 btn-secondary text-sm">{isJa ? 'キャンセル' : 'Cancel'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffHousekeepingPage;
