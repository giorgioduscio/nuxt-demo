import { cvSchema, type CV } from "~/pages/cv/cv_schema";
import { safeParse } from 'valibot';

export default defineEventHandler(async(event)=>{
  try {
    //1) Recupera l'id e il corpo della richiesta
    const body = await readBody(event);
    const id = event.context.params?.id;
    if(!id) throw createError({
      statusCode: 400,
      statusMessage: "ID mancante nell'URL",
    });

    //2) Valida i dati con valibot
    const result = safeParse(cvSchema, body);
    if (!result.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "Dati non validi",
        cause: result.issues
      });
    }
    const validatedData = result.output;

    //3) Recupera l'oggetto
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

    //4) Aggiorna i valori
    const updatedCV = {...cv_match, ...validatedData};
    await storage.setItem(key, updatedCV);
    return updatedCV;
    
  } catch (e) {
    throw createError({
      statusCode: 500, 
      statusMessage: "Errore durante l'aggiornamento del cv",
      cause: e,
    });
    
  }
})
