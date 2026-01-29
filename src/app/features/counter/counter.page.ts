import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

const COUNTER_STORAGE_KEY = 'signals-demo-counter';

@Component({
  selector: 'app-counter-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './counter.page.html',
  styleUrl: './counter.page.css',
})
export class CounterPage {
  readonly count = signal(0);

  constructor() {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(COUNTER_STORAGE_KEY);
      if (raw !== null) {
        const parsed = Number(raw);
        if (Number.isInteger(parsed)) {
          this.count.set(parsed);
        }
      }
    }
    effect(() => {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(COUNTER_STORAGE_KEY, String(this.count()));
      }
    });
  }

  increment(): void {
    this.count.update(c => c + 1);
  }

  decrement(): void {
    this.count.update(c => c - 1);
  }
}
