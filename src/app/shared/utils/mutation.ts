import { signal, type WritableSignal } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';

export interface Mutation<T> {
  isLoading: WritableSignal<boolean>;
  error: WritableSignal<string | null>;

  run(
    op: () => Observable<T>,
    onSuccess: (value: T) => void,
    msg: string
  ): Promise<void>;
}

export function mutation<T>(): Mutation<T> {
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
    },
  };
}
