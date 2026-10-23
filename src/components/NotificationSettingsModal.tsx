import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  X,
  Shield,
  Clock,
  Pill,
  FileCheck
} from 'lucide-react';
import {
  NotificationPreferences,
  NotificationPermissionStatus,
  getNotificationPermissionStatus,
  getStoredNotificationPreferences,
  saveNotificationPreferences,
  requestNotificationPermission,
  sendLocalNotification
} from '../services/notificationService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationSettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermissionStatus>(
    getNotificationPermissionStatus()
  );
  const [prefs, setPrefs] = useState<NotificationPreferences>(getStoredNotificationPreferences());
  const [testSent, setTestSent] = useState(false);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const status = await requestNotificationPermission();
    setPermissionStatus(status);
    if (status === 'granted') {
      const updated = { ...prefs, enabled: true };
      setPrefs(updated);
      saveNotificationPreferences(updated);
    }
  };

  const handleTogglePref = (key: keyof NotificationPreferences) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    saveNotificationPreferences(updated);
  };

  const handleSendTestNotification = () => {
    const success = sendLocalNotification('PulseCare+ Preparedness Check', {
      body: 'Your 72-hour family go-bag review is due. Stay safe and prepared.'
    });
    setTestSent(success);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E2720]/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notif-dialog-title"
    >
      <div className="relative w-full max-w-lg clinic-panel-elevated rounded-3xl p-6 md:p-8 border border-[#C7AE7B]/40 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F4F0E6]/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#163C32] border border-[#C7AE7B]/40 flex items-center justify-center text-[#C7AE7B]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 id="notif-dialog-title" className="text-base font-bold text-[#F4F0E6]">
                Notification & Reminder Controls
              </h3>
              <p className="text-xs text-[#C7AE7B] font-mono">
                Independent of Geolocation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#F4F0E6]/60 hover:text-[#F4F0E6] hover:bg-[#163C32] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Permission Status Banner */}
        <div className="my-4 p-4 rounded-2xl bg-[#163C32]/70 border border-[#C7AE7B]/25 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#F4F0E6]">Browser System Permission:</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                permissionStatus === 'granted'
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                  : permissionStatus === 'denied'
                  ? 'bg-red-950/60 text-red-400 border border-red-500/30'
                  : 'bg-[#0E2720] text-[#C7AE7B] border border-[#C7AE7B]/30'
              }`}
            >
              {permissionStatus}
            </span>
          </div>

          <p className="text-[11px] text-[#F4F0E6]/80 leading-relaxed">
            PulseCare+ never triggers unsolicited push alerts or marketing broadcasts. Notifications are reserved exclusively for user-selected preparedness drills and medication reviews.
          </p>

          {permissionStatus !== 'granted' && permissionStatus !== 'unsupported' && (
            <button
              onClick={handleRequestPermission}
              className="mt-2 w-full py-2.5 px-3 rounded-xl bg-[#F4F0E6] hover:bg-white text-[#1D2521] text-xs font-bold transition-all"
            >
              Enable Browser Notifications
            </button>
          )}

          {permissionStatus === 'denied' && (
            <div className="mt-2 p-2 rounded-lg bg-[#0E2720] border border-[#D94736]/50 text-[11px] text-[#FF8A7A]">
              Notifications are blocked in your browser settings. To enable them, click the padlock/settings icon beside the URL in your address bar.
            </div>
          )}
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase text-[#C7AE7B] tracking-wider">
            Opt-in Channels
          </h4>

          <div
            onClick={() => handleTogglePref('preparednessReminders')}
            className="p-3.5 rounded-2xl bg-[#0E2720]/80 border border-[#F4F0E6]/10 hover:border-[#C7AE7B]/40 cursor-pointer flex items-center justify-between transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Clock className="w-4 h-4 text-[#C7AE7B]" />
              <div>
                <p className="text-xs font-bold text-[#F4F0E6]">Quarterly Go-Bag Review</p>
                <p className="text-[10px] text-[#F4F0E6]/70">Reminder to inspect first-aid supplies & batteries</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={prefs.preparednessReminders}
              readOnly
              className="w-4 h-4 accent-[#C7AE7B] rounded"
            />
          </div>

          <div
            onClick={() => handleTogglePref('medicationRefills')}
            className="p-3.5 rounded-2xl bg-[#0E2720]/80 border border-[#F4F0E6]/10 hover:border-[#C7AE7B]/40 cursor-pointer flex items-center justify-between transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Pill className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-xs font-bold text-[#F4F0E6]">Medication Expiry Alert</p>
                <p className="text-[10px] text-[#F4F0E6]/70">Annual reminder for inhaler and epinephrine replacements</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={prefs.medicationRefills}
              readOnly
              className="w-4 h-4 accent-[#C7AE7B] rounded"
            />
          </div>
        </div>

        {/* Test Button */}
        {permissionStatus === 'granted' && (
          <div className="mt-5 pt-3 border-t border-[#F4F0E6]/10 flex items-center justify-between">
            <span className="text-[11px] text-[#C7AE7B] font-mono">
              {testSent ? '✓ Notification sent' : 'Verify system banner'}
            </span>
            <button
              onClick={handleSendTestNotification}
              className="px-3 py-1.5 rounded-xl bg-[#163C32] border border-[#C7AE7B]/40 hover:border-[#C7AE7B] text-xs text-[#F4F0E6] font-mono"
            >
              Send Test Alert
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
