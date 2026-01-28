import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TodosService } from './services/todos.service';

@Component({
  selector: 'app-todos-page',
  standalone: true,
  templateUrl: './todos.page.html',
  styleUrl: './todos.page.css',
  imports: [CommonModule, FormsModule],
})
export class TodosPage {
  readonly title = 'Signals Todo List';

  private readonly todosService = inject(TodosService);

  readonly todos = this.todosService.todos;
  readonly newTodoText = signal('');
  readonly remainingCount = this.todosService.remainingCount;

  addTodo(): void {
    const text = this.newTodoText().trim();
    if (!text) {
      return;
    }

    this.todosService.addTodo(text);
    this.newTodoText.set('');
  }

  setNewTodoText(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.newTodoText.set(text);
  }

  toggleTodo(id: number): void {
    this.todosService.toggleTodo(id);
  }

  removeTodo(id: number): void {
    this.todosService.removeTodo(id);
  }

  clearCompleted(): void {
    this.todosService.clearCompleted();
  }
}
