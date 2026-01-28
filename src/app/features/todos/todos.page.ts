import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodosStore } from './services/todos-store.service';
@Component({
  selector: 'app-todos-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [TodosStore], // IMPORTANT: Creates a new store for every instance of this page
  templateUrl: './todos.page.html',
  styleUrl: './todos.page.css',
})
export class TodosPage {
  readonly title = 'Signals Todo List';

  // We make it protected so the HTML template can see it
  protected readonly store = inject(TodosStore);

  // Minimal logic for UI events
  handleInputChange(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.store.newTodoText.set(text);
  }
}
