import { Todo } from '../models/todo.model';

export class TodoDomain {
  static add(list: Todo[], todo: Todo): Todo[] {
    return [...list, todo];
  }

  static toggle(list: Todo[], id: number): Todo[] {
    return list.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
  }

  static remove(list: Todo[], id: number): Todo[] {
    return list.filter(t => t.id !== id);
  }

  static clearCompleted(list: Todo[]): Todo[] {
    return list.filter(t => !t.completed);
  }
}
