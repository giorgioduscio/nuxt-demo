import { CV, cvSchema } from '~/pages/cv/cv_schema';
import { safeParse } from 'valibot';
import { firebase_cv } from './_firebase_cv';

export default defineEventHandler(async(event)=>{
  try{
    const body = await readBody(event);
    
    // Valida i dati con valibot
    const result = safeParse(cvSchema, body);
    if (!result.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "Dati non validi",
        cause: result.issues
      });
    }

    if (firebase_cv.to_use(event)) {
      return await firebase_cv.create(result.output);
    }
    
    const storage = useStorage('cv');
    
    // Usa l'ID fornito dal client, se presente, altrimenti generane uno
    const customId = `${Date.now()}${Math.floor(Math.random() *1000)}`;
    const newCV: CV = {
      ...result.output,
      id: Number(customId),
    };
    
    await storage.setItem(`${customId}.json`, newCV);
    return newCV;

  } catch(e){ throw e }
})
