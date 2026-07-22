import prisma from '/app/server/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "ID mancante nell'URL",
      })
    }

    await prisma.todo.delete({
      where: { id: parseInt(id) }
    })

    return { success: true, message: `Todo con ID ${id} eliminato` }
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: "Errore durante l'eliminazione del todo",
      cause: e,
    })
  }
})
