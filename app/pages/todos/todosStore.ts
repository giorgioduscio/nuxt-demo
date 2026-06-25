import type { Todo } from "./todos_schema";

const URL ='/api/todos'
export const todosStore ={

  // CREATE
  async create(text:string) :Promise<Todo> {
    try{
      const res = await $fetch<Todo>(URL, {
        method:'POST',
        body:{ text }
      })
      return res

    } catch(e){ throw e }
  },

  // READ
  async read_all(){
    try{
      return await $fetch<Todo[]>(URL)

    }catch(e){ throw e }
  },
  
  // DELETE
  async delete(id:number){   
    try{
      return await $fetch<Todo[]>(`${URL}/${id}`, {method: 'DELETE'})
  
    }catch(e){ throw e }
  },

  // UPDATE
  async update(newTodo:Todo){
    try{
      return await $fetch<Todo[]>(`${URL}/${newTodo.id}`, {
        method: 'PUT',
        body: newTodo
      })

    }catch(e){ throw e }
  }
    
}