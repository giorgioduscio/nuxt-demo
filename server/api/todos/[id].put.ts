// ~/server/api/todos/[id].put.ts
import type { Todo } from "~/pages/todos/todos_schema";

export default defineEventHandler(async (event) => {
  try {
    //1) Recupera l'id e il corpo della richiesta
    const id = getRouterParam(event, 'id');
    const body = await readBody<Todo>(event);
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "ID mancante nell'URL",
      });
    }

    //2) Recupera il todo dall'archivio
    const storage = useStorage('todos');
    const keys = await storage.getKeys();
    const key = keys.find(key => key.includes(id));
    if (!key) {
      throw createError({
        statusCode: 404,
        statusMessage: `Todo con ID ${id} non trovato`,
      });
    }

    // Leggiamo il todo esistente
    const todo_match = await storage.getItem<Todo>(key);
    if (!todo_match) {
      throw createError({
        statusCode: 404,
        statusMessage: `Todo con ID ${id} non trovato nello storage`,
      });
    }

    // Aggiorniamo solo i campi forniti nel body
    const updatedTodo: Todo = {
      ...todo_match,
      text: body.text ?? todo_match.text,
      completed: body.completed ?? todo_match.completed,
    };

    // Sovrascriviamo il file
    await storage.setItem(key, updatedTodo);
    return updatedTodo;

  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: "Errore durante l'aggiornamento del todo",
      cause: e,
    });
  }
});