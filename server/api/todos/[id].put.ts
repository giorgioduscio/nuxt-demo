// ~/server/api/todos/[id].put.ts
import type { Todo } from "~/pages/todos/todos_schema";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "ID mancante nell'URL",
      });
    }

    const body = await readBody<Todo>(event);
    if (!body || (!body.text && body.completed === undefined)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Corpo della richiesta non valido: servono 'text' o 'completed'",
      });
    }

    const storage = useStorage('todos');
    const keys = await storage.getKeys();
    const keyToUpdate = keys.find(key => key.includes(id));

    if (!keyToUpdate) {
      throw createError({
        statusCode: 404,
        statusMessage: `Todo con ID ${id} non trovato`,
      });
    }

    // Leggiamo il todo esistente
    const existingTodo = await storage.getItem<Todo>(keyToUpdate);
    if (!existingTodo) {
      throw createError({
        statusCode: 404,
        statusMessage: `Todo con ID ${id} non trovato nello storage`,
      });
    }

    // Aggiorniamo solo i campi forniti nel body
    const updatedTodo: Todo = {
      ...existingTodo,
      text: body.text ?? existingTodo.text,
      completed: body.completed ?? existingTodo.completed,
    };

    // Sovrascriviamo il file
    await storage.setItem(keyToUpdate, updatedTodo);
    return updatedTodo;

  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: "Errore durante l'aggiornamento del todo",
      cause: e,
    });
  }
});