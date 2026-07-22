import type { Todo } from "./_todos_schema";

const URL = '/api/todos';
const LOCALSTORAGE_KEY = 'todos';

export const todosStore = {
  /**
   * se si è in locale, utilizza il db locale
   * altrimenti utilizza localstorage
  
   * @returns true se si usa localstorage, false se si usa l'api
   */
  usedLocalstorage(): boolean {
    const wlh =window.location.href;
    const result = typeof window !== 'undefined' && 
           (!wlh.includes('localhost') && 
            !wlh.includes('127.0.0.1'));
    
    return result;
  },

  /**
   * Helper per ottenere i todos da localStorage
   * @returns 
   */
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
      const todos = this.getLocalTodos();
      const newTodo: Todo = {
        id: todos.length + 1,
        text,
        completed: false
      };
      todos.push(newTodo);
      this.saveLocalTodos(todos);
      return newTodo;

    // api
    } else {
      try {
        const res = await $fetch<Todo>(URL, {
          method: 'POST',
          body: { text }
        });
        return res;
      } catch (e) { throw e; }
    }
  },

  // READ
  async read_all(): Promise<Todo[]> {
    // localstorage
    if (this.usedLocalstorage()) {
      return this.getLocalTodos();

    // api
    } else {
      try {       
        return await $fetch<Todo[]>(URL);
      } catch (e) { throw e; }
    }
  },

  // DELETE
  async delete(id: number): Promise<Todo[]> {
    // localstorage
    if (this.usedLocalstorage()) {
      const todos = this.getLocalTodos();
      const updatedTodos = todos.filter(todo => todo.id !== id);
      this.saveLocalTodos(updatedTodos);
      return updatedTodos;

      // api
    } else {
      try {
        return await $fetch<Todo[]>(`${URL}/${id}`, { method: 'DELETE' });
      } catch (e) { throw e; }
    }
  },

  // UPDATE
  async update(newTodo: Todo): Promise<Todo[]> {
    // localstorage
    if (this.usedLocalstorage()) {
      const todos = this.getLocalTodos();
      const updatedTodos = todos.map(todo =>
        todo.id === newTodo.id ? newTodo : todo
      );
      this.saveLocalTodos(updatedTodos);
      return updatedTodos;

    // api
    } else {
      try {
        return await $fetch<Todo[]>(`${URL}/${newTodo.id}`, {
          method: 'PUT',
          body: newTodo
        });
      } catch (e) { throw e; }
    }
  }
};
