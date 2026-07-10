export default defineEventHandler(async(event)=>{
  try {
    //1) Estrazione degli IDs dal body della richiesta
    const body = await readBody(event)
    const { ids } = body
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "IDs mancanti o non validi",
      });
    }

    //2) Eliminazione multipla dei CV
    const storage = useStorage('cv');
    const keys = await storage.getKeys();
    
    const results: {
      success: number[]
      failed: Array<{ id: number; error: string }>
    } = {
      success: [],
      failed: []
    }

    for (const id of ids) {
      try {
        const deleteItem = keys.find(key => key.includes(id.toString()));
        if (deleteItem) {
          await storage.removeItem(deleteItem)
          results.success.push(id)
        } else {
          results.failed.push({ id, error: `CV con ID ${id} non trovato` })
        }
      } catch (error) {
        results.failed.push({ id, error: `Errore durante l'eliminazione del CV ${id}` })
      }
    }
    
    return {
        success: true,
        message: `Eliminati ${results.success.length} CV su ${ids.length}`,
        results
    }
    
  } catch (e) { 
    throw createError({
      statusCode: 500,
      statusMessage: "Errore durante l'eliminazione multipla dei CV",
      cause: e
    })
  }
})
