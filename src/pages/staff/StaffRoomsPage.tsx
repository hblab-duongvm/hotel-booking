import React, { useState } from 'react';
import { BedDouble, Wrench, CheckCircle, Clock, AlertCircle, LayoutGrid, List } from 'lucide-react';
import { ROOMS, ROOM_STATUS_MAP } from '../../data/staffMockData';
import type { RoomCondition } from '../../data/staffMockData';

interface Props { lang: 'ja' | 'en' }

const conditionLabel: Record<RoomCondition, { ja: string; en: string; color: string; bg: string; icon: React.ReactNode }> = {
  clean: { ja: '清潔', en: 'Clean', color: 'text-green-700', bg: 'bg-green-100', icon: <CheckCircle className="w-4 h-4 text-green-600" /> },
  dirty: { ja: '清掃待ち', en: 'Needs Cleaning', color: 'text-orange-700', bg: 'bg-orange-100', icon: <Clock className="w-4 h-4 text-orange-500" /> },
  cleaning: { ja: '清掃中', en: 'Cleaning', color: 'text-blue-700', bg: 'bg-blue-100', icon: <Clock className="w-4 h-4 text-blue-500" /> },
  maintenance: { ja: 'メンテナンス中', en: 'Maintenance', color: 'text-red-700', bg: 'bg-red-100', icon: <Wrench className="w-4 h-4 text-red-500" /> },
};

const StaffRoomsPage: React.FC<Props> = ({ lang }) => {
  const isJa = lang === 'ja';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterCondition, setFilterCondition] = useState<RoomCondition | 'all'>('all');
  const [roomStatuses, setRoomStatuses] = useState(ROOM_STATUS_MAP);

  const rooms = ROOMS.map(r => ({
    ...r,
    status: roomStatuses[r.id] || { roomId: r.id, condition: 'clean' as RoomCondition },
  }));

  const filtered = rooms.filter(r =>
    filterCondition === 'all' || r.status.condition === filterCondition
  );

  const stats = {
    clean: rooms.filter(r => r.status.condition === 'clean').length,
    dirty: rooms.filter(r => r.status.condition === 'dirty').length,
    cleaning: rooms.filter(r => r.status.condition === 'cleaning').length,
    maintenance: rooms.filter(r => r.status.condition === 'maintenance').length,
  };

  const handleUpdateCondition = (roomId: string, condition: RoomCondition) => {
    setRoomStatuses(prev => ({ ...prev, [roomId]: { ...prev[roomId], condition } }));
  };

  const floors = [...new Set(ROOMS.map(r => r.floor))].sort((a, b) => a - b);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{isJa ? '客室管理' : 'Room Management'}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{isJa ? `全${ROOMS.length}室` : `${ROOMS.length} rooms total`}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg border transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg border transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(Object.entries(stats) as [RoomCondition, number][]).map(([cond, count]) => (
          <button
            key={cond}
            onClick={() => setFilterCondition(filterCondition === cond ? 'all' : cond)}
            className={`card p-4 text-left transition-all hover:shadow-md ${filterCondition === cond ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="flex items-center gap-2 mb-2">
              {conditionLabel[cond].icon}
              <span className={`text-xs font-semibold ${conditionLabel[cond].color}`}>
                {isJa ? conditionLabel[cond].ja : conditionLabel[cond].en}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{count}</div>
            <div className="text-xs text-gray-400">{isJa ? '室' : 'rooms'}</div>
          </button>
        ))}
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="space-y-6">
          {floors.map(floor => {
            const floorRooms = filtered.filter(r => r.floor === floor);
            if (floorRooms.length === 0) return null;
            return (
              <div key={floor}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-white text-xs font-bold">{floor}F</div>
                  <span className="text-sm font-semibold text-gray-700">{isJa ? `${floor}階` : `Floor ${floor}`}</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                  {floorRooms.map(room => {
                    const cond = room.status.condition;
                    const cl = conditionLabel[cond];
                    return (
                      <div key={room.id} className={`card p-3 border-2 transition-all hover:shadow-md ${
                        cond === 'clean' ? 'border-green-200' :
                        cond === 'dirty' ? 'border-orange-200' :
                        cond === 'cleaning' ? 'border-blue-200' : 'border-red-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <BedDouble className="w-4 h-4 text-gray-400" />
                          {cl.icon}
                        </div>
                        <div className="text-sm font-bold text-gray-900 mb-0.5">
                          {floor}0{ROOMS.indexOf(room) + 1}
                        </div>
                        <div className="text-xs text-gray-500 mb-2 leading-tight">{isJa ? room.nameJa : room.name}</div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cl.bg} ${cl.color}`}>
                          {isJa ? cl.ja : cl.en}
                        </span>
                        {room.status.assignedStaff && (
                          <div className="text-xs text-gray-400 mt-1.5 truncate">{room.status.assignedStaff}</div>
                        )}
                        {room.status.maintenanceNote && (
                          <div className="text-xs text-red-500 mt-1 truncate">{room.status.maintenanceNote}</div>
                        )}
                        <select
                          value={cond}
                          onChange={e => handleUpdateCondition(room.id, e.target.value as RoomCondition)}
                          className="mt-2 w-full text-xs border border-gray-200 rounded-lg px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                        >
                          <option value="clean">{isJa ? '清潔' : 'Clean'}</option>
                          <option value="dirty">{isJa ? '清掃待ち' : 'Needs Cleaning'}</option>
                          <option value="cleaning">{isJa ? '清掃中' : 'Cleaning'}</option>
                          <option value="maintenance">{isJa ? 'メンテナンス' : 'Maintenance'}</option>
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {[isJa ? '客室番号' : 'Room No', isJa ? '客室名' : 'Room Name',
                    isJa ? 'タイプ' : 'Type', isJa ? '階' : 'Floor',
                    isJa ? '定員' : 'Capacity', isJa ? '状態' : 'Condition',
                    isJa ? '担当スタッフ' : 'Assigned Staff', isJa ? '更新' : 'Update'].map((h, i) => (
                    <th key={i} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((room, idx) => {
                  const cond = room.status.condition;
                  const cl = conditionLabel[cond];
                  return (
                    <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-gray-900">{room.floor}0{idx + 1}</td>
                      <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{isJa ? room.nameJa : room.name}</td>
                      <td className="py-3 px-4 text-gray-500 capitalize text-xs">{room.type}</td>
                      <td className="py-3 px-4 text-gray-500">{room.floor}F</td>
                      <td className="py-3 px-4 text-gray-500">{room.capacity}{isJa ? '名' : ' guests'}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${cl.bg} ${cl.color}`}>
                          {cl.icon}{isJa ? cl.ja : cl.en}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs">{room.status.assignedStaff || '—'}</td>
                      <td className="py-3 px-4">
                        <select
                          value={cond}
                          onChange={e => handleUpdateCondition(room.id, e.target.value as RoomCondition)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                        >
                          <option value="clean">{isJa ? '清潔' : 'Clean'}</option>
                          <option value="dirty">{isJa ? '清掃待ち' : 'Needs Cleaning'}</option>
                          <option value="cleaning">{isJa ? '清掃中' : 'Cleaning'}</option>
                          <option value="maintenance">{isJa ? 'メンテナンス' : 'Maintenance'}</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Maintenance Alert */}
      {rooms.some(r => r.status.condition === 'maintenance') && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-red-800 text-sm">{isJa ? 'メンテナンスが必要な客室があります' : 'Rooms requiring maintenance'}</div>
            <div className="text-red-600 text-xs mt-1">
              {rooms.filter(r => r.status.condition === 'maintenance').map(r => (
                <span key={r.id} className="mr-2">
                  {isJa ? r.nameJa : r.name}
                  {r.status.maintenanceNote && ` — ${r.status.maintenanceNote}`}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffRoomsPage;
