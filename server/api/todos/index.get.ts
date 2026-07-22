import prisma from '/app/server/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return todos
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Errore durante il recupero dei todos',
      cause: e
    })
  }
})
