import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Todo } from './models/todo.model';

@Component({
  selector: 'app-todos-page',
  standalone: true,
  templateUrl: './todos.page.html',
  styleUrl: './todos.page.css',
  imports: [CommonModule, FormsModule],
})
export class TodosPage {
  readonly title = 'Signals Todo List';

  private nextId = 1;

  readonly todos = signal<Todo[]>([]);
  readonly newTodoText = signal('');
  readonly remainingCount = computed(
    () => this.todos().filter((todo) => !todo.completed).length
  );

  addTodo(): void {
    const text = this.newTodoText().trim();
    if (!text) {
      return;
    }

    const todo: Todo = {
      id: this.nextId++,
      text,
      completed: false,
    };

    this.todos.update((list) => [...list, todo]);
    this.newTodoText.set('');
  }

  setNewTodoText(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.newTodoText.set(text);
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
