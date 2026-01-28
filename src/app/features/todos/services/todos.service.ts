import { Injectable, computed, signal } from '@angular/core';

import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  private nextId = 1;

  readonly todos = signal<Todo[]>([]);
  readonly remainingCount = computed(
    () => this.todos().filter((todo) => !todo.completed).length
  );

  addTodo(text: string): void {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    const todo: Todo = {
      id: this.nextId++,
      text: trimmed,
      completed: false,
    };

    this.todos.update((list) => [...list, todo]);
  }

  toggleTodo(id: number): void {
    this.todos.update((list) =>
      list.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  removeTodo(id: number): void {
    this.todos.update((list) => list.filter((todo) => todo.id !== id));
  }

  clearCompleted(): void {
    this.todos.update((list) => list.filter((todo) => !todo.completed));
  }
}

