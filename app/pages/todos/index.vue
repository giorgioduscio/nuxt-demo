<script setup lang="ts">
import type { Todo } from './_todos_schema'
import { TodoSchema } from './_todos_schema'
import { safeParse } from 'valibot'
import { todosStore } from './todosStore';

const todos ={
  list: ref<Todo[]>([]),
  input: ref(''),
  parsed_todo: computed(() => {
    const result :any = safeParse(TodoSchema, {
      id: 0,
      text: todos.input.value,
      completed: false,
    } as Todo)
    
    return result 
  }),
  
  submittedOnce: ref(false),
  handleReset(){
    todos.input.value = ''
    todos.submittedOnce.value = false
  },
  
  showErrors: computed((): boolean => 
    todos.submittedOnce.value && // submit premuto
    !todos.parsed_todo.value.success // campo invalido
  ),

  handleAdd(){    
    todos.submittedOnce.value = true
    if (!todos.parsed_todo.value.success) {
      return console.error('Validation failed');
    }
    
    todosStore.create(todos.input.value)
    .then((newTodo)=>{
      todos.list.value.push(newTodo);
      todos.handleReset();
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
  console.log('showErrors', todos.showErrors.value);
})
definePageMeta({
  title: 'Todos',
  description: 'Lista dei Todo',
  icon: 'list'
})
</script>

<template>
  <section>
    <!-- HEADER -->
    <div class="p-2 mb-3 text-bg-primary">
      <div class="container">
        <h3>My Tasks</h3>
      </div>
    </div>
    
    <!-- INPUT -->
    <div class="container max-w-500px">
      <div class="mb-3 shadow rounded overflow-hidden bg-light">
        <form @submit.prevent="todos.handleAdd" class="d-flex">
          <input v-model="todos.input.value" 
                 type="text" 
                 class="form-control rounded-0" 
                 :class="{ 'is-invalid': todos.showErrors.value }"
                 placeholder="What needs to be done?">
          <button v-if="todos.input.value" @click="todos.handleReset" 
                  class="btn btn-outline-danger btn-sm rounded-0" type="button">
            <span class="bi bi-x-lg"></span>
          </button>
          <button type="submit" class="btn btn-success rounded-0 text-nowrap">
            <i class="bi bi-plus-lg"></i>
            <span class="ms-2 d-none d-sm-inline">Add</span>
          </button>
        </form>

        <div v-if="todos.showErrors.value" 
              class="p-1 text-bg-danger d-grid gap-2 cols-auto-1fr">
          <i class="bi bi-exclamation-triangle"></i>
          <small>{{ todos.parsed_todo.value.issues?.[0]?.message }}</small>
        </div>
      </div>
    </div>
    
    <!-- LIST -->
    <div class="container mb-3 max-w-500px">
      <div v-if="todos.list.value.length === 0" class="m-0 alert alert-warning text-center">
        <i class="bi bi-info-circle me-2"></i>
        <span>No tasks yet. Enjoy your day!</span>
      </div>

      <ul class="m-0 p-0" v-else>
        <li v-for="todo in todos.list.value" 
            :key="todo.id" 
            class="my-1 d-flex gap-2 justify-content-between align-items-center">
          
          <label class="visually-hidden" :for="'todo-' + todo.id">{{ todo.text }}</label>
          <input class="form-check-input fs-3 m-0" 
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

    <!-- FOOTER -->
    <div class="mb-3 container max-w-500px">
      <div class="p-2 border rounded text-bg-secondary">
        <div class="d-flex justify-content-between align-items-center">
          <small>{{ todos_completedCount }} completed</small>
          <button v-if="todos_completedCount > 0" 
                  @click="todos.clearCompleted" 
                  class="btn btn-sm btn-danger text-truncate">
            <i class="me-1 bi bi-trash"></i>
            <small>Clear Completed</small>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
