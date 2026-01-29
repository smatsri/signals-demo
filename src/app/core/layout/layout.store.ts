import { Injectable, signal, inject, effect, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const STORAGE_KEY = 'sidebar-open';

function getStoredSidebarOpen(): boolean {
  if (typeof localStorage === 'undefined') return true;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === null) return true;
  return stored === 'true';
}

@Injectable({ providedIn: 'root' })
export class LayoutStore {
  private readonly platformId = inject(PLATFORM_ID);

  /** Whether the sidebar is open. */
  readonly sidebarOpen = signal(getStoredSidebarOpen());

  constructor() {
    effect(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      localStorage.setItem(STORAGE_KEY, String(this.sidebarOpen()));
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(open => !open);
  }

  setSidebarOpen(open: boolean): void {
    this.sidebarOpen.set(open);
  }
}
