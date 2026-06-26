import { CV } from "~/pages/cv/cv_schema";

export default defineEventHandler(async(event)=>{
  try {
    //1) Recupera l'id e il corpo della richiesta
    const body = await readBody<CV>(event);
    const id = event.context.params?.id;
    if(!id) throw createError({
      statusCode: 400,
      statusMessage: "ID mancante nell'URL",
    });

    //2) Recupera l'oggetto
    const storage = useStorage('cv');
    const keys = await storage.getKeys();
    const key = keys.find(key=> key.includes(id));
    if(!key) throw createError({
      statusCode: 404,
      statusMessage: "CV non trovato",
    });

    const cv_match = await storage.getItem<CV>(key);
    if(!cv_match) throw createError({
      statusCode: 404,
      statusMessage: "CV non trovato"
    })

    //3) Aggiorna i valori
    const updatedCV :CV ={...cv_match, ...body};
    await storage.setItem(key, updatedCV);
    return updatedCV;
    
  } catch (e) {
    throw createError({
      statusCode: 500, 
      statusMessage: "Errore durante l'aggiornaamento del cv",
      cause: e,
    });
    
  }
})