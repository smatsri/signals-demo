import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeStore } from './core/theme/theme.store';
import { LayoutStore } from './core/layout/layout.store';
import { NotificationsStore } from './core/notifications/notifications.store';
import { NotificationsListComponent } from './shared/components/notifications-list/notifications-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    NotificationsListComponent,
  ],
})
export class AppComponent {
  protected readonly themeStore = inject(ThemeStore);
  protected readonly layoutStore = inject(LayoutStore);
  protected readonly notificationsStore = inject(NotificationsStore);
}
