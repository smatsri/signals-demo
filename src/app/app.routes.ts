import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/todos/todos.page').then((m) => m.TodosPage),
  },
  {
    path: 'counter',
    loadComponent: () =>
      import('./features/counter/counter.page').then((m) => m.CounterPage),
  },
  {
    path: 'effect-logger',
    loadComponent: () =>
      import('./features/effect-logger/effect-logger.page').then(
        (m) => m.EffectLoggerPage
      ),
  },
];
