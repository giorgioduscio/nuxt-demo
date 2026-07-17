import { firebase_cv } from './_firebase_cv';

export default defineEventHandler(async (event) => {
  try{
    if (firebase_cv.to_use(event)) {
      return await firebase_cv.read();
    }
    
    const storage = useStorage('cv');
    const keys = await storage.getKeys();
    
    const cv = await Promise.all(
      keys.map(key => storage.getItem(key))
    );

    return cv || [];
    
  } catch(e){ throw e }
});
