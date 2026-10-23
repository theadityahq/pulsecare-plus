/**
 * PulseCare+ Notification Service
 * Strictly opt-in, independent of geolocation, transparent about content.
 */

export type NotificationPermissionStatus = 'default' | 'granted' | 'denied' | 'unsupported';

export interface NotificationPreferences {
  enabled: boolean;
  preparednessReminders: boolean;
  medicationRefills: boolean;
  offlineCardExpiryAlerts: boolean;
}

const PREFS_STORAGE_KEY = 'pulsecare_notification_prefs';

export function getNotificationPermissionStatus(): NotificationPermissionStatus {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission as NotificationPermissionStatus;
}

export function getStoredNotificationPreferences(): NotificationPreferences {
  try {
    const raw = localStorage.getItem(PREFS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Fallback
  }
  return {
    enabled: false,
    preparednessReminders: false,
    medicationRefills: false,
    offlineCardExpiryAlerts: false
  };
}

export function saveNotificationPreferences(prefs: NotificationPreferences): void {
  try {
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore storage issues
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermissionStatus> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission as NotificationPermissionStatus;
  } catch {
    return 'default';
  }
}

export function sendLocalNotification(title: string, options?: NotificationOptions): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/icon.svg',
      badge: '/badge.svg',
      ...options
    });
    return true;
  }
  return false;
}
