import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NotificationsStore } from '../../core/notifications/notifications.store';
import { GreeterCardComponent } from './components/greeter-card/greeter-card.component';

@Component({
  selector: 'app-greeter-page',
  standalone: true,
  imports: [FormsModule, GreeterCardComponent],
  templateUrl: './greeter.page.html',
  styleUrl: './greeter.page.css',
})
export class GreeterPage {
  private readonly notificationsStore = inject(NotificationsStore);

  /** Parent signal: drives the dumb component's [name] input (signals in). */
  readonly selectedName = signal('World');

  /** Optional title for the greeting. */
  readonly title = signal('Hello');

  onWave(): void {
    this.notificationsStore.add({
      message: `${this.selectedName()} waved back! 👋`,
      type: 'info',
      duration: 3000,
    });
  }
}
