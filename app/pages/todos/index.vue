<script setup lang="ts">
import type { Todo } from './todos_schema'
import { todosStore } from './todosStore';

const todos ={
  list: ref<Todo[]>([]),
  input: ref(''),
  
  handleAdd(){
    if (todos.input.value.trim() === '') return console.error("Valore non valido");
    todosStore.create(todos.input.value)
    .then((newTodo)=>{
      todos.list.value.push(newTodo);
      todos.input.value = '';
    })
    .catch(e=> console.error(e))
  },

  async handleDelete(id: number){
    await todosStore.delete(id)
    todos.list.value = todos.list.value.filter(t => t.id !== id)
  },

  async handleToggle(id: number){
    const target = todos.list.value.find(t => t.id === id);
    if (!target) return console.error("Todo non trovato");
    
    target.completed = !target.completed;
    await todosStore.update(target)
  },
  
  async clearCompleted(){
    const targets = todos.list.value.filter(t => t.completed);
    for(const todo of targets){
      await todosStore.delete(todo.id);
    }
    todos.list.value = todos.list.value.filter(t => !t.completed)
  }
}

const todos_completedCount = computed(() => todos.list.value.filter(t => t.completed).length)

onMounted(async () => {
  todos.list.value = await todosStore.read_all()
  document.title ='Todos';
  console.log(todosStore.usedLocalstorage() ?'[Localstorage]' :'[API]');
})
definePageMeta({
  title: 'Todos',
  description: 'Lista dei Todo',
  icon: 'list'
})
</script>

<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6">

        <!-- HEADER -->
        <div class="border rounded shadow overflow-hidden">
          <div class="p-3 pb-1 text-bg-primary">
            <h3>My Tasks</h3>
            <div class="input-group mb-3">
              <input 
                v-model="todos.input.value" 
                @keyup.enter="todos.handleAdd" 
                type="text" 
                class="form-control" 
                placeholder="What needs to be done?"
              >
              <button @click="todos.handleAdd" class="btn btn-info" type="button">
                <span class="bi bi-plus-lg">Add</span>
              </button>
            </div>
          </div>
          
          <!-- LIST -->
          <div class="p-3 bg-blur">
            <div v-if="todos.list.value.length === 0" class="m-0 alert alert-warning text-center">
              <i class="bi bi-info-circle me-2"></i>
              <span>No tasks yet. Enjoy your day!</span>
            </div>

            <ul class="m-0 p-0" v-else>
              <li v-for="todo in todos.list.value" 
                  :key="todo.id" 
                  class="my-1 d-flex gap-2 justify-content-between align-items-center">
                
                <label class="visually-hidden" :for="'todo-' + todo.id">{{ todo.text }}</label>
                <input class="form-check-input" 
                      type="checkbox" 
                      :checked="todo.completed" 
                      @change="todos.handleToggle(todo.id)"
                      :id="'todo-' + todo.id"
                      :name="'todo-' + todo.id">
  
                <label :for="todo.id+'-text'" class="visually-hidden">Edit todo</label>
                <input type="text" :title="todo.text"
                      class="form-control form-control-sm"
                      :name="todo.id+'-text'" 
                      :id="todo.id+'-text'" 
                      @blur="todosStore.update(todo)"
                      v-model="todo.text">

                <button @click="todos.handleDelete(todo.id)" class="btn btn-danger btn-sm">
                  <i class="bi bi-x-lg"></i>
                </button>
              </li>
            </ul>
          </div>
          <div v-if="todos.list.value.length > 0" class="p-3 text-bg-secondary d-flex justify-content-between align-items-center">
            <small>{{ todos_completedCount }} of {{ todos.list.value.length }} completed</small>
            <button 
              v-if="todos_completedCount > 0" 
              @click="todos.clearCompleted" 
              class="btn btn-sm btn-danger"
            >Clear Completed</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
