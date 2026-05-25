<script setup lang="ts">
import type { Todo } from './todos_schema'

const todos = ref<Todo[]>([])
const newTodo = ref('')

onMounted(() => {
  const saved = localStorage.getItem('todos')
  if (saved) {
    todos.value = JSON.parse(saved)
  }
})

watch(todos, (newVal) => {
  localStorage.setItem('todos', JSON.stringify(newVal))
}, { deep: true })

const addTodo = () => {
  if (newTodo.value.trim() === '') return
  todos.value.push({
    id: Date.now(),
    text: newTodo.value,
    completed: false
  })
  newTodo.value = ''
}

const removeTodo = (id: number) => {
  todos.value = todos.value.filter(t => t.id !== id)
}

const toggleTodo = (id: number) => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) todo.completed = !todo.completed
}

const clearCompleted = () => {
  todos.value = todos.value.filter(t => !t.completed)
}

const completedCount = computed(() => todos.value.filter(t => t.completed).length)
</script>

<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6">

        <div class="border rounded shadow overflow-hidden">
          <div class="p-3 pb-1 text-bg-primary">
            <h3>My Tasks</h3>
            <div class="input-group mb-3">
              <input 
                v-model="newTodo" 
                @keyup.enter="addTodo" 
                type="text" 
                class="form-control" 
                placeholder="What needs to be done?"
              >
              <button @click="addTodo" class="btn btn-info" type="button">
                <span class="bi bi-plus-lg">Add</span>
              </button>
            </div>
          </div>
          
          <div class="p-3 bg-blur">
            <div v-if="todos.length === 0" class="m-0 alert alert-warning text-center">
              <i class="bi bi-info-circle me-2"></i>
              <span>No tasks yet. Enjoy your day!</span>
            </div>

            <ul class="m-0 p-0">
              <li v-for="todo in todos" 
                  :key="todo.id" 
                  class="my-1 d-flex justify-content-between align-items-center">
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    :checked="todo.completed" 
                    @change="toggleTodo(todo.id)"
                    :id="'todo-' + todo.id"
                  >
                  <label 
                    class="form-check-label" 
                    :class="{ 'text-decoration-line-through': todo.completed }"
                    :for="'todo-' + todo.id"
                  >
                    {{ todo.text }}
                  </label>
                </div>
                <button @click="removeTodo(todo.id)" class="btn btn-danger btn-sm bi bi-x-lg"></button>
              </li>
            </ul>
          </div>
          <div v-if="todos.length > 0" class="p-3 text-bg-secondary d-flex justify-content-between align-items-center">
            <small>{{ completedCount }} of {{ todos.length }} completed</small>
            <button 
              v-if="completedCount > 0" 
              @click="clearCompleted" 
              class="btn btn-sm btn-danger"
            >
              Clear Completed
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
