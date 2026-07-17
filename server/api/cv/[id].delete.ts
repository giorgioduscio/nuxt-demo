import { firebase_cv } from './_firebase_cv';

export default defineEventHandler(async(event)=>{
  try {
    //1) Estrazione dell'id dall'URL
    const id = getRouterParam(event, 'id');
    if(!id) throw createError({
      statusCode: 400,
      statusMessage: "ID mancante nell'URL",
    });

    if (firebase_cv.to_use(event)) {
      return await firebase_cv.delete(id);
    }

    //2) Cerchiamo il file corrispondente all'ID
    const storage = useStorage('cv');
    const keys = await storage.getKeys();

    const deleteItem = keys.find(key => key.includes(id));
    if (!deleteItem) throw createError({
      statusCode: 404,
      statusMessage: `CV con ID ${id} non trovato`,
    });
    
    //3) Eliminare il file
    await storage.removeItem(deleteItem)
    return {
        success: true,
        message: `CV con ID ${id} eliminato`
    }
    
  } catch (e) { 
    throw createError({
      statusCode: 500,
      statusMessage: "Errore durante l'eliminazione del CV",
      cause: e
    })
  }
})
