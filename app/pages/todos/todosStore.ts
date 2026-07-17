import type { Todo } from "./todos_schema";

const URL = '/api/todos';
const LOCALSTORAGE_KEY = 'todos';

export const todosStore = {
  usedLocalstorage(): boolean {
    const wlh =window.location.href;
    return typeof window !== 'undefined' && 
           (!wlh.includes('localhost') && 
            !wlh.includes('127.0.0.1'));
  },

  // Helper per ottenere i todos da localStorage
  getLocalTodos(): Todo[] {   
    const stored = localStorage.getItem(LOCALSTORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  // Helper per salvare i todos su localStorage
  saveLocalTodos(todos: Todo[]): void {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(todos));
  },

  // CREATE
  async create(text: string): Promise<Todo> {
    // localstorage
    if (this.usedLocalstorage()) {
      try {
        const res = await $fetch<Todo>(URL, {
          method: 'POST',
          body: { text }
        });
        return res;
      } catch (e) { throw e; }


    } else {
      // Leggi i todos attuali da localStorage
      const todos = this.getLocalTodos();
      const newTodo: Todo = {
        id: todos.length + 1, // ID temporaneo (in un ambiente reale, usa un UUID)
        text,
        completed: false
      };
      todos.push(newTodo);
      this.saveLocalTodos(todos);
      return newTodo;
    }
  },

  // READ
  async read_all(): Promise<Todo[]> {
    if (this.usedLocalstorage()) {
      try {
        return await $fetch<Todo[]>(URL);
      } catch (e) { throw e; }
    } else {
      return this.getLocalTodos();
    }
  },

  // DELETE
  async delete(id: number): Promise<Todo[]> {
    if (this.usedLocalstorage()) {
      try {
        return await $fetch<Todo[]>(`${URL}/${id}`, { method: 'DELETE' });
      } catch (e) { throw e; }
    } else {
      const todos = this.getLocalTodos();
      const updatedTodos = todos.filter(todo => todo.id !== id);
      this.saveLocalTodos(updatedTodos);
      return updatedTodos;
    }
  },

  // UPDATE
  async update(newTodo: Todo): Promise<Todo[]> {
    if (this.usedLocalstorage()) {
      try {
        return await $fetch<Todo[]>(`${URL}/${newTodo.id}`, {
          method: 'PUT',
          body: newTodo
        });
      } catch (e) { throw e; }
    } else {
      const todos = this.getLocalTodos();
      const updatedTodos = todos.map(todo =>
        todo.id === newTodo.id ? newTodo : todo
      );
      this.saveLocalTodos(updatedTodos);
      return updatedTodos;
    }
  }
};