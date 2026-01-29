import { Component, inject } from '@angular/core';
import { NotificationsStore } from '../../../core/notifications/notifications.store';

@Component({
  selector: 'app-notifications-list',
  standalone: true,
  templateUrl: './notifications-list.component.html',
  styleUrl: './notifications-list.component.css',
})
export class NotificationsListComponent {
  protected readonly notificationsStore = inject(NotificationsStore);
}
