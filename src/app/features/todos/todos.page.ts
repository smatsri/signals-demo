import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Todo } from './models/todo.model';
import { TodosService } from './services/todos.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';

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

  readonly todosResource = rxResource({
    defaultValue: [],
    loader: () => this.todosService.getTodos(),
  });
  readonly newTodoText = signal('');
  readonly errorMessage = signal<string | null>(null);

  readonly remainingCount = computed(() => this.todosResource.value().filter((todo) => !todo.completed).length);
  readonly todos = computed(() => this.todosResource.value());
  readonly displayError = computed(() => {
    const err = this.errorMessage();
    if (err) return err;
    return this.todosResource.error() != null ? String(this.todosResource.error()) : null;
  });

  setNewTodoText(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.newTodoText.set(text);
  }

  async addTodo(): Promise<void> {
    this.errorMessage.set(null);
    try {
      const todo = await firstValueFrom(this.todosService.addTodo(this.newTodoText()));
      this.todosResource.update((todos) => [...todos, todo]);
      this.newTodoText.set('');
    } catch (err) {
      this.errorMessage.set(err instanceof Error ? err.message : 'Failed to add todo');
    }
  }

  async toggleTodo(id: number): Promise<void> {
    const todo = this.todosResource.value().find((t) => t.id === id);
    if (!todo) return;
    this.errorMessage.set(null);
    try {
      await firstValueFrom(this.todosService.setCompleted(id, !todo.completed));
      this.todosResource.update((todos) =>
        todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
    } catch (err) {
      this.errorMessage.set(err instanceof Error ? err.message : 'Failed to update todo');
    }
  }

  async removeTodo(id: number): Promise<void> {
    this.errorMessage.set(null);
    try {
      await firstValueFrom(this.todosService.removeTodo(id));
      this.todosResource.update((todos) => todos.filter((t) => t.id !== id));
    } catch (err) {
      this.errorMessage.set(err instanceof Error ? err.message : 'Failed to remove todo');
    }
  }

  async clearCompleted(): Promise<void> {
    this.errorMessage.set(null);
    try {
      await firstValueFrom(this.todosService.clearCompleted());
      this.todosResource.update((todos) => todos.filter((t) => !t.completed));
    } catch (err) {
      this.errorMessage.set(err instanceof Error ? err.message : 'Failed to clear completed');
    }
  }

}
