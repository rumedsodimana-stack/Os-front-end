import React, { useState } from 'react';
import { Calendar, User, CreditCard, Check } from 'lucide-react';

export interface ReservationData {
  name: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
}

export const ReservationForm: React.FC<{ onConfirm?: (data: ReservationData) => void }> = ({ onConfirm }) => {
  const [name, setName] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [roomType, setRoomType] = useState('Deluxe King');

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden my-4">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">New Reservation</h3>
        <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">Draft</span>
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500">Guest Name</label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="John Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">Check-in</label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="date" 
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">Check-out</label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="date" 
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
              />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500">Room Type</label>
          <select 
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option>Deluxe King</option>
            <option>Double Queen</option>
            <option>Executive Suite</option>
          </select>
        </div>

        <button 
          onClick={() => onConfirm?.({ name, checkIn, checkOut, roomType })}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          Confirm Reservation
        </button>
      </div>
    </div>
  );
};
