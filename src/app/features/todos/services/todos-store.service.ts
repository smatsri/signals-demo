import { Injectable, inject, signal, computed } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, firstValueFrom } from 'rxjs';
import { TodosService } from './todos.service';
import { Todo } from '../models/todo.model';

@Injectable()
export class TodosStore {
  private readonly todosService = inject(TodosService);

  // --- STATE ---
  readonly newTodoText = signal('');
  readonly errorMessage = signal<string | null>(null);
  private readonly isSaving = signal(false);

  // --- DATA FETCHING ---
  readonly todosResource = rxResource({
    defaultValue: [] as Todo[],
    loader: () => this.todosService.getTodos(),
  });

  // --- SELECTORS (Computed State) ---
  readonly todos = computed(() => this.todosResource.value());

  readonly remainingCount = computed(() =>
    this.todos().filter((t) => !t.completed).length
  );

  readonly displayError = computed(() => {
    const err = this.errorMessage();
    if (err) return err;
    const resourceErr = this.todosResource.error();
    return resourceErr != null ? String(resourceErr) : null;
  });

  readonly isBusy = computed(() => this.isSaving() || this.todosResource.isLoading());


  // --- ACTIONS ---
  async addTodo(): Promise<void> {
    const text = this.newTodoText().trim();
    if (!text) return;

    await this.run(
      () => this.todosService.addTodo(text),
      (todo) => {
        this.todosResource.update((prev) => [...prev, todo]);
        this.newTodoText.set('');
      },
      'Failed to add todo'
    );
  }

  async toggleTodo(id: number): Promise<void> {
    const todo = this.todos().find((t) => t.id === id);
    if (!todo) return;

    await this.run(
      () => this.todosService.setCompleted(id, !todo.completed),
      () => {
        this.todosResource.update((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          )
        );
      },
      'Failed to update todo'
    );
  }

  async removeTodo(id: number): Promise<void> {
    await this.run(
      () => this.todosService.removeTodo(id),
      () => {
        this.todosResource.update((prev) => prev.filter((t) => t.id !== id));
      },
      'Failed to remove todo'
    );
  }

  async clearCompleted(): Promise<void> {
    await this.run(
      () => this.todosService.clearCompleted(),
      () => {
        this.todosResource.update((prev) => prev.filter((t) => !t.completed));
      },
      'Failed to clear completed'
    );
  }

  // --- PRIVATE METHODS ---
  private async run<T>(
    operation: () => Observable<T>,
    onSuccess: (result: T) => void,
    errorMessage: string
  ): Promise<void> {
    this.isSaving.set(true);
    this.errorMessage.set(null);
    try {
      const result = await firstValueFrom(operation());
      if (onSuccess) {
        onSuccess(result);
      }
    } catch {
      this.errorMessage.set(errorMessage);
    } finally {
      this.isSaving.set(false);
    }
  }

}