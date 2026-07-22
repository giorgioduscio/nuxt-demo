import prisma from '/app/server/lib/prisma'
import type { Todo } from "~/pages/todos/_todos_schema"

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody<Todo>(event)
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "ID mancante nell'URL",
      })
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: parseInt(id) },
      data: {
        text: body.text,
        completed: body.completed,
      }
    })

    return updatedTodo
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: "Errore durante l'aggiornamento del todo",
      cause: e,
    })
  }
})
