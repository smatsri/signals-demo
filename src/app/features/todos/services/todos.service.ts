import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodosService {

  private readonly http = inject(HttpClient);

  getTodos() {
    const todos = this.http.get<Todo[]>('/api/todos');
    return todos;
  }
  addTodo(text: string) {
    const todo = this.http.post<Todo>('/api/todos', { text });
    return todo;
  }
  setCompleted(id: number, completed: boolean) {
    const todo = this.http.patch<Todo>(`/api/todos/${id}`, { completed });
    return todo;
  }
  removeTodo(id: number) {
    const todo = this.http.delete<Todo>(`/api/todos/${id}`);
    return todo;
  }

  clearCompleted() {
    const todos = this.http.delete<{ message: string }>('/api/todos');
    return todos;
  }
}

