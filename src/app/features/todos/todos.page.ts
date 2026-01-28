import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TodosService } from './services/todos.service';
import { rxResource } from '@angular/core/rxjs-interop';

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

  addTodo(): void {
    this.todosService.addTodo(this.newTodoText()).subscribe((todo) => {
      this.todosResource.value().push(todo);
    });
  }

  setNewTodoText(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.newTodoText.set(text);
  }

  toggleTodo(id: number): void {
    const todo = this.todosResource.value().find((todo) => todo.id === id);
    if (!todo) return;
    this.todosService.setCompleted(id, !todo.completed).subscribe((todo) => {
      todo.completed = todo.completed;
      this.todosResource.value().find((todo) => todo.id === id)!.completed = todo.completed;
    });
  }

  removeTodo(id: number): void {
    this.todosService.removeTodo(id).subscribe((todo) => {
      this.todosResource.value().splice(this.todosResource.value().findIndex((todo) => todo.id === id), 1);
    });
  }

  clearCompleted(): void {
    this.todosService.clearCompleted().subscribe(() => {
      this.todosResource.update((todos) => todos.filter((todo) => !todo.completed));
    });

  }

}
