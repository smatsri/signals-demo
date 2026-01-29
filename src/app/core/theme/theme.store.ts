import {
  Injectable,
  signal,
  computed,
  effect,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const STORAGE_KEY = 'theme-preference';
const THEMES = ['light', 'dark', 'system'] as const;
export type ThemePreference = (typeof THEMES)[number];
export type EffectiveTheme = 'light' | 'dark';

function getStoredPreference(): ThemePreference {
  if (typeof localStorage === 'undefined') return 'system';
  const stored = localStorage.getItem(STORAGE_KEY);
  return THEMES.includes(stored as ThemePreference)
    ? (stored as ThemePreference)
    : 'system';
}

function getSystemPrefersDark(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

@Injectable({ providedIn: 'root' })
export class ThemeStore {
  private readonly platformId = inject(PLATFORM_ID);

  /** User preference: light, dark, or follow system. */
  readonly preference = signal<ThemePreference>(getStoredPreference());

  /** Resolved system preference; only relevant when preference is 'system'. */
  private readonly systemPrefersDark = signal(getSystemPrefersDark());

  /** Resolved theme used for the UI (always light or dark). */
  readonly effectiveTheme = computed<EffectiveTheme>(() => {
    const pref = this.preference();
    if (pref === 'system') {
      return this.systemPrefersDark() ? 'dark' : 'light';
    }
    return pref;
  });

  readonly isDark = computed(() => this.effectiveTheme() === 'dark');

  constructor() {
    // Sync system preference when preference is 'system'.
    effect(() => {
      if (this.preference() !== 'system' || !isPlatformBrowser(this.platformId)) {
        return;
      }
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const update = () => this.systemPrefersDark.set(mq.matches);
      update();
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    });

    // Apply theme to document and persist preference.
    effect(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      const theme = this.effectiveTheme();
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      localStorage.setItem(STORAGE_KEY, this.preference());
    });
  }

  setPreference(preference: ThemePreference): void {
    this.preference.set(preference);
  }

  cyclePreference(): ThemePreference {
    const current = this.preference();
    const next =
      current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
    this.preference.set(next);
    return next;
  }
}
