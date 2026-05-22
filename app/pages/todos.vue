<script setup lang="ts">
interface Todo {
  id: number
  text: string
  completed: boolean
}

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
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h3 class="card-title mb-0">My Tasks</h3>
          </div>
          <div class="card-body">
            <div class="input-group mb-3">
              <input 
                v-model="newTodo" 
                @keyup.enter="addTodo" 
                type="text" 
                class="form-control" 
                placeholder="What needs to be done?"
              >
              <button @click="addTodo" class="btn btn-primary" type="button">Add</button>
            </div>

            <div v-if="todos.length === 0" class="text-center py-4 text-muted">
              <p class="mb-0">No tasks yet. Enjoy your day!</p>
            </div>

            <ul class="list-group list-group-flush">
              <li 
                v-for="todo in todos" 
                :key="todo.id" 
                class="list-group-item d-flex justify-content-between align-items-center"
              >
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
                    :class="{ 'text-decoration-line-through text-muted': todo.completed }"
                    :for="'todo-' + todo.id"
                  >
                    {{ todo.text }}
                  </label>
                </div>
                <button @click="removeTodo(todo.id)" class="btn btn-link text-danger p-0">
                  <span class="fs-4">&times;</span>
                </button>
              </li>
            </ul>
          </div>
          <div v-if="todos.length > 0" class="card-footer d-flex justify-content-between align-items-center bg-light">
            <small class="text-muted">{{ completedCount }} of {{ todos.length }} completed</small>
            <button 
              v-if="completedCount > 0" 
              @click="clearCompleted" 
              class="btn btn-sm btn-outline-danger"
            >
              Clear Completed
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
</style>
