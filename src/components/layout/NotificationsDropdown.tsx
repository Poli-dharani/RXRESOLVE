import React, { useRef, useEffect } from 'react';
import { Bell, CheckCheck, Clock, AlertTriangle, ArrowRight, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsRead,
    openRefillDetail,
    setMode,
  } = useApp();

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNotificationClick = (id: string, refillId?: string) => {
    markNotificationAsRead(id);
    if (refillId) {
      setMode('app');
      openRefillDetail(refillId);
    }
    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-700" />
          <span className="text-xs font-semibold text-slate-900">Notifications</span>
          {unreadNotificationCount > 0 && (
            <span className="px-1.5 py-0.2 bg-teal-100 text-teal-800 text-[10px] font-bold rounded-full">
              {unreadNotificationCount} new
            </span>
          )}
        </div>
        {unreadNotificationCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1 text-[11px] font-medium text-teal-700 hover:text-teal-900 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No notifications at this time
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item.id, item.refillId)}
              className={`p-3.5 transition-colors cursor-pointer hover:bg-slate-50 ${
                !item.read ? 'bg-teal-50/30' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {!item.read && <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />}
                  <span className="text-xs font-semibold text-slate-900">{item.title}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                  {item.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
              {item.refillId && (
                <div className="flex items-center gap-1 mt-2 text-[11px] font-medium text-teal-700 hover:text-teal-800">
                  <span>View Case {item.refillId}</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-500">
        Connected to Clinical Alerts Gateway & Surescripts Hub
      </div>
    </div>
  );
};
