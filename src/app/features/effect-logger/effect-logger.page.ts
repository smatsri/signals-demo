import { DatePipe } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-effect-logger-page',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './effect-logger.page.html',
  styleUrl: './effect-logger.page.css',
})
export class EffectLoggerPage {
  readonly name = signal('');
  readonly value = signal(0);
  readonly lastRun = signal<Date | null>(null);
  readonly runCount = signal(0);

  constructor() {
    effect(
      () => {
        this.name();
        this.value();
        this.lastRun.set(new Date());
        this.runCount.update(c => c + 1);
      },
      { allowSignalWrites: true }
    );
  }

  setName(text: string): void {
    this.name.set(text);
  }

  incrementValue(): void {
    this.value.update(v => v + 1);
  }

  decrementValue(): void {
    this.value.update(v => v - 1);
  }
}
