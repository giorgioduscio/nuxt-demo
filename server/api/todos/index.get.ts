
export default defineEventHandler(async (event) => {
  try{
    const storage = useStorage('todos');
    const keys = await storage.getKeys();
    
    // Accediamo allo storage configurato in nuxt.config.ts
    const todos = await Promise.all(
      keys.map(key => storage.getItem(key))
    );

    // console.log(`GET ${todos.length} todos`);
    return todos || [];
    
  } catch(e){ throw e }
});