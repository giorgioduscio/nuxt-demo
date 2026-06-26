
export default defineEventHandler(async (event) => {
  try{
    const storage = useStorage('cv');
    const keys = await storage.getKeys();
    
    const cv = await Promise.all(
      keys.map(key => storage.getItem(key))
    );

    return cv || [];
    
  } catch(e){ throw e }
});