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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#173E35]/60 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notif-dialog-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 border-2 border-[#C4A66B]/40 shadow-2xl overflow-hidden text-[#173E35]">
        
        {/* Header with High-Contrast Deep Green Text and Dedicated Close Button */}
        <div className="flex items-center justify-between pb-4 border-b border-[#C4A66B]/25">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#173E35] border border-[#C4A66B]/40 flex items-center justify-center text-[#F1F0E9] shadow-sm">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 id="notif-dialog-title" className="text-base sm:text-lg font-black text-[#173E35] tracking-tight">
                Notification & Reminder Controls
              </h3>
              <p className="text-xs text-[#7A5E2E] font-mono font-semibold">
                Independent of Geolocation
              </p>
            </div>
          </div>

          {/* Prominent Dedicated Close Button */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-[#173E35] text-[#F1F0E9] hover:bg-[#CC3B2D] transition-all border border-[#C4A66B]/40 shadow-md flex items-center justify-center group"
            aria-label="Close notification settings"
            title="Close dialog"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* Permission Status Banner */}
        <div className="my-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#C4A66B]/30 space-y-2.5 text-xs text-[#173E35]">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#173E35]">Browser System Permission:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                permissionStatus === 'granted'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : permissionStatus === 'denied'
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              {permissionStatus}
            </span>
          </div>

          <p className="text-[11px] text-[#173E35]/80 leading-relaxed">
            PulseCare+ never triggers unsolicited push alerts or marketing broadcasts. Notifications are reserved exclusively for user-selected preparedness drills and medication reviews.
          </p>

          {permissionStatus !== 'granted' && permissionStatus !== 'unsupported' && (
            <button
              onClick={handleRequestPermission}
              className="mt-2 w-full py-2.5 px-3 rounded-xl bg-[#173E35] hover:bg-[#0E2721] text-[#F1F0E9] text-xs font-bold transition-all shadow-xs"
            >
              Enable Browser Notifications
            </button>
          )}

          {permissionStatus === 'denied' && (
            <div className="mt-2 p-2.5 rounded-xl bg-red-50 border border-[#CC3B2D]/40 text-[11px] text-[#CC3B2D] font-medium">
              Notifications are blocked in your browser settings. To enable them, click the padlock/settings icon beside the URL in your address bar.
            </div>
          )}
        </div>

        {/* Toggles with High-Contrast Text */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase text-[#7A5E2E] tracking-wider">
            Opt-in Channels
          </h4>

          <div
            onClick={() => handleTogglePref('preparednessReminders')}
            className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#C4A66B]/30 hover:border-[#173E35] hover:bg-white cursor-pointer flex items-center justify-between transition-all shadow-xs"
          >
            <div className="flex items-center space-x-3">
              <Clock className="w-4 h-4 text-[#7A5E2E]" />
              <div>
                <p className="text-xs font-bold text-[#173E35]">Quarterly Go-Bag Review</p>
                <p className="text-[10px] text-[#173E35]/70">Reminder to inspect first-aid supplies & batteries</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={prefs.preparednessReminders}
              readOnly
              className="w-4 h-4 accent-[#173E35] rounded"
            />
          </div>

          <div
            onClick={() => handleTogglePref('medicationRefills')}
            className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#C4A66B]/30 hover:border-[#173E35] hover:bg-white cursor-pointer flex items-center justify-between transition-all shadow-xs"
          >
            <div className="flex items-center space-x-3">
              <Pill className="w-4 h-4 text-emerald-700" />
              <div>
                <p className="text-xs font-bold text-[#173E35]">Medication Expiry Alert</p>
                <p className="text-[10px] text-[#173E35]/70">Annual reminder for inhaler and epinephrine replacements</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={prefs.medicationRefills}
              readOnly
              className="w-4 h-4 accent-[#173E35] rounded"
            />
          </div>
        </div>

        {/* Test Button & Dedicated Bottom Close Button */}
        <div className="mt-6 pt-4 border-t border-[#C4A66B]/20 flex items-center justify-between">
          {permissionStatus === 'granted' ? (
            <button
              onClick={handleSendTestNotification}
              className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#C4A66B]/40 hover:border-[#173E35] text-xs text-[#173E35] font-mono font-bold transition-all shadow-xs"
            >
              {testSent ? '✓ Notification sent' : 'Send Test Alert'}
            </button>
          ) : (
            <div className="text-[11px] font-mono text-[#173E35]/70">Opt-in disabled</div>
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#173E35] text-[#F1F0E9] hover:bg-[#CC3B2D] text-xs font-mono font-bold transition-all shadow-sm"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
