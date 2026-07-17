import { firebase_cv } from './_firebase_cv';

export default defineEventHandler(async(event)=>{
  // 1) recupera l'id
  const id = getRouterParam(event, 'id');
  if(!id) throw createError({
    statusCode: 400,
    statusMessage: "ID mancante nell'URL",
  });
  
  if (firebase_cv.to_use(event)) {
    return await firebase_cv.read_id(id);
  }

  // 2) recupera il CV dal database
  const storage = useStorage('cv');
  const key = (await storage.getKeys())
        .find(key=> key.includes(id));
  if(!key) throw createError({
    statusCode: 404,
    statusMessage: `CV con ID ${id} non trovato`,
  });
  const cv_match = await storage.getItem(key);

  // 3) ritorna il CV
  return cv_match;
})
