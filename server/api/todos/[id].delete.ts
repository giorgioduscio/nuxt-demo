export default defineEventHandler(async (event) => {
  try {
    // Estraiamo l'ID dall'URL (es. /api/todos/12345)
    const id = getRouterParam(event, 'id');
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "ID mancante nell'URL",
      });
    }

    const storage = useStorage('todos');
    const keys = await storage.getKeys();

    // Cerchiamo il file corrispondente all'ID
    const deleteItemKey = keys.find(key => key.includes(id));
    if (!deleteItemKey) {
      throw createError({
        statusCode: 404,
        statusMessage: `Todo con ID ${id} non trovato`,
      });
    }

    // Eliminiamo il file
    await storage.removeItem(deleteItemKey);
    return { success: true, message: `Todo con ID ${id} eliminato` };

  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: "Errore durante l'eliminazione del todo",
      cause: e,
    });
  }
});