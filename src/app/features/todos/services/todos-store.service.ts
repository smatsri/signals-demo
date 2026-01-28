import { Injectable, inject, signal, computed } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, firstValueFrom } from 'rxjs';
import { TodosService } from './todos.service';
import { Todo } from '../models/todo.model';

@Injectable()
export class TodosStore {
  private readonly todosService = inject(TodosService);

  // ─── STATE ─────────────────────────────────────────────
  readonly newTodoText = signal('');

  // ─── DATA FETCHING ─────────────────────────────────────
  readonly todosResource = rxResource({
    defaultValue: [] as Todo[],
    loader: () => this.todosService.getTodos(),
  });

  // ─── MUTATIONS ─────────────────────────────────────────
  private readonly addTodoMutation = this.createMutation<Todo>();
  private readonly toggleTodoMutation = this.createMutation<Todo>();
  private readonly removeTodoMutation = this.createMutation<Todo>();
  private readonly clearCompletedMutation =
    this.createMutation<{ message: string }>();

  // ─── SELECTORS ─────────────────────────────────────────
  readonly todos = computed(() => this.todosResource.value());

  readonly remainingCount = computed(() =>
    this.todos().filter(t => !t.completed).length
  );

  readonly error = computed(() =>
    this.todosResource.error()
    ?? this.addTodoMutation.error()
    ?? this.toggleTodoMutation.error()
    ?? this.removeTodoMutation.error()
    ?? this.clearCompletedMutation.error()
  );

  readonly isBusy = computed(() =>
    this.todosResource.isLoading()
    || this.addTodoMutation.isLoading()
    || this.toggleTodoMutation.isLoading()
    || this.removeTodoMutation.isLoading()
    || this.clearCompletedMutation.isLoading()
  );

  // ─── ACTIONS ───────────────────────────────────────────
  async addTodo(): Promise<void> {
    const text = this.newTodoText().trim();
    if (!text) return;

    await this.addTodoMutation.run(
      () => this.todosService.addTodo(text),
      todo => {
        this.todosResource.update(prev => [...prev, todo]);
        this.newTodoText.set('');
      },
      'Failed to add todo'
    );
  }

  async toggleTodo(id: number): Promise<void> {
    const todo = this.todos().find(t => t.id === id);
    if (!todo) return;

    await this.toggleTodoMutation.run(
      () => this.todosService.setCompleted(id, !todo.completed),
      () => {
        this.todosResource.update(prev =>
          prev.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
          )
        );
      },
      'Failed to update todo'
    );
  }

  async removeTodo(id: number): Promise<void> {
    await this.removeTodoMutation.run(
      () => this.todosService.removeTodo(id),
      () => {
        this.todosResource.update(prev =>
          prev.filter(t => t.id !== id)
        );
      },
      'Failed to remove todo'
    );
  }

  async clearCompleted(): Promise<void> {
    await this.clearCompletedMutation.run(
      () => this.todosService.clearCompleted(),
      () => {
        this.todosResource.update(prev =>
          prev.filter(t => !t.completed)
        );
      },
      'Failed to clear completed todos'
    );
  }

  // ─── MUTATION FACTORY ──────────────────────────────────
  private createMutation<T>() {
    const isLoading = signal(false);
    const error = signal<string | null>(null);

    return {
      isLoading,
      error,

      async run(
        op: () => Observable<T>,
        onSuccess: (value: T) => void,
        msg: string
      ): Promise<void> {
        isLoading.set(true);
        error.set(null);

        try {
          const result = await firstValueFrom(op());
          onSuccess(result);
        } catch {
          error.set(msg);
        } finally {
          isLoading.set(false);
        }
      }
    };
  }
}
