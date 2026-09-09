import React from 'react';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  Clock, 
  Trash2,
  ExternalLink
} from 'lucide-react';
import { PushNotification } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: PushNotification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  onSelectApplication: (appId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onClearAll,
  onSelectApplication,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-100">
      <div 
        id="notification-drawer"
        className="w-full max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Application Push Alerts
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              {notifications.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-[11px] text-slate-400 hover:text-red-600 transition-colors"
                title="Clear all"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2 p-6">
              <Bell className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-semibold">No New Notifications</p>
              <p className="text-[11px]">You will receive live push notifications when your loan status updates.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  onMarkAsRead(notif.id);
                  if (notif.applicationId) {
                    onSelectApplication(notif.applicationId);
                    onClose();
                  }
                }}
                className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${
                  !notif.read ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {notif.type === 'sanction' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : notif.type === 'reject' ? (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    ) : notif.type === 'payment' ? (
                      <CreditCard className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-600" />
                    )}
                  </div>

                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900 dark:text-white leading-tight">
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono block pt-1">
                      {new Date(notif.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
