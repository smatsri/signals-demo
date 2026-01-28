import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

  remainingCount = computed(() => this.todosResource.value().filter((todo) => !todo.completed).length);
  todos = computed(() => this.todosResource.value());

  setNewTodoText(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.newTodoText.set(text);
  }

  async addTodo() {
    const todo = await firstValueFrom(this.todosService.addTodo(this.newTodoText()));
    this.todosResource.update((todos) => [...todos, todo]);
  }

  async toggleTodo(id: number) {
    const todo = this.todosResource.value().find((todo) => todo.id === id);
    if (!todo) return;
    await firstValueFrom(this.todosService.setCompleted(id, !todo.completed));
    todo.completed = !todo.completed;
    this.todosResource.update((todos) => todos.map((t) => t.id === id ? todo : t));
  }

  async removeTodo(id: number) {
    await firstValueFrom(this.todosService.removeTodo(id));
    this.todosResource.update((todos) => todos.filter((todo) => todo.id !== id));
  }

  async clearCompleted() {
    await firstValueFrom(this.todosService.clearCompleted());
    this.todosResource.update((todos) => todos.filter((todo) => !todo.completed));
  }

}
