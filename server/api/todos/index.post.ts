import type { Todo } from "~/pages/todos/todos_schema";

export default defineEventHandler(async (event) => {
  try{
    const body = await readBody(event); 
    const storage = useStorage('todos');
    const customId = `${Date.now()}${Math.floor(Math.random() *1000)}`;
    const newTodo :Todo ={
      id: Number(customId),
      text: body.text,
      completed: false
    };
    
    await storage.setItem(`${customId}.json`, newTodo);
    // console.log("POST todos", customId);
    return newTodo;

  } catch(e){ throw e }
});