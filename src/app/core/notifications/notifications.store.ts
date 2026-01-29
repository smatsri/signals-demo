import { Injectable, signal, computed } from '@angular/core';
import type { Notification, NotificationType } from './notification.model';

const DEFAULT_DURATION_MS = 5000;

function generateId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

@Injectable({ providedIn: 'root' })
export class NotificationsStore {
  readonly notifications = signal<Notification[]>([]);

  readonly hasNotifications = computed(
    () => this.notifications().length > 0
  );

  add(options: {
    message: string;
    type?: NotificationType;
    duration?: number;
  }): string {
    const type = options.type ?? 'info';
    const duration = options.duration ?? DEFAULT_DURATION_MS;
    const id = generateId();
    const notification: Notification = {
      id,
      message: options.message,
      type,
      duration,
    };
    this.notifications.update((list) => [...list, notification]);
    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
    return id;
  }

  dismiss(id: string): void {
    this.notifications.update((list) =>
      list.filter((n) => n.id !== id)
    );
  }
}
